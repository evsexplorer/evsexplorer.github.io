---
title: "Die OCPP-2.0.1-BootNotification"
date: 2026-05-24
description: "Die allererste Nachricht einer Ladestation nach dem Verbinden: der Boot-Grund, die Hardware, die sie verrät, und die Zeitsynchronisation, die in der Response steckt."
tags: [ocpp, boot, websocket]
---

Wenn eine Ladestation ihren [OCPP-J-WebSocket](/blog/ocpp-protocol-stack) zum CSMS öffnet, ist die erste
Anwendungsnachricht fast immer eine **BootNotification**. Die Station stellt
sich damit vor, und keine andere Nachricht sagt so viel darüber aus, *was* sich
gerade mit Ihrem Prüfstand verbunden hat.

## Der Request

Ein BootNotification-Request enthält einen `reason` und ein `chargingStation`-Objekt:

```json
[2, "9f1c2d3e-4b5a-4c6d-8e7f-0a1b2c3d4e5f", "BootNotification", {
  "reason": "PowerUp",
  "chargingStation": {
    "model": "CBOX 01",
    "vendorName": "MyBox",
    "serialNumber": "SN-000123",
    "firmwareVersion": "1.4.2",
    "modem": { "iccid": "…", "imsi": "…" }
  }
}]
```

### Was der reason verrät

Der `reason` ist ein `BootReasonEnumType` und sagt Ihnen, *warum* die Station
gerade gebootet hat. Die Werte, die auf dem Prüfstand wirklich zählen:

- **PowerUp**: ein Kaltstart (z. B. weil die Netzspannung zurückgekehrt ist).
- **RemoteReset**: die Station hat nach einem `Reset`-Befehl des CSMS neu
  gestartet.
- **FirmwareUpdate**: sie ist gerade vom Flashen neuer Firmware zurückgekehrt.
- **ScheduledReset**: ein `Reset` vom Typ `OnIdle`, den die Station während
  einer laufenden Transaktion aufgeschoben und dann ausgeführt hat, sobald der
  Connector frei war.
- **ApplicationReset**: die OCPP-Anwendung selbst ist abgestürzt und neu
  gestartet.
- **Watchdog**: die Anwendung hing, der Watchdog-Timer lief ab, und das
  Betriebssystem hat sie beendet und neu gestartet.

Die letzten beiden sind die Interessanten. Eine Station, die alle paar Stunden
`Watchdog` oder `ApplicationReset` meldet, hat ein Problem, und der Boot-Grund
ist oft die einzige Spur, die Sie bekommen. Wenn Sie einer Reconnect-Schleife
nachgehen, lesen Sie dieses Feld zuerst.

## Die Response

Das CSMS antwortet mit einem CallResult, das `status`, `currentTime` und
`interval` enthält:

```json
[3, "9f1c2d3e-4b5a-4c6d-8e7f-0a1b2c3d4e5f", {
  "status": "Accepted",
  "currentTime": "2026-07-15T09:00:00Z",
  "interval": 300
}]
```

### currentTime: die erste Zeitsynchronisation der Station

Über `currentTime` liest man leicht hinweg, doch es leistet echte Arbeit. Es
ist die aktuelle Uhrzeit des CSMS, und für viele Stationen ist es die *erste*
korrekte Zeit, die sie nach dem Booten haben.

Ein Ladepunkt ohne batteriegepufferte RTC weiß nach einem Power-Cycle nicht,
wie spät es ist (seine Uhr startet bei irgendeinem Firmware-Standardwert). Bis
er die echte Zeit kennt, ist jeder Zeitstempel, den er erzeugt (Start/Ende
einer Transaktion, Messwerte, Log-Einträge), falsch. Die `currentTime` in der
BootNotificationResponse ist der Punkt, an dem er das behebt: Wenn die Station
so konfiguriert ist, dass sie ihre Zeit vom CSMS bezieht, synchronisiert sie
ihre interne Uhr mit diesem Wert (OCPP 2.0.1 B01.FR.06) und hält sie danach
über die `currentTime` in jeder folgenden HeartbeatResponse synchron.

Eine BootNotification ist also nicht nur ein "Hallo!". Für eine Station ohne RTC
ist sie auch der Moment, in dem ihre Uhr vertrauenswürdig wird. Wenn
Transaktions-Zeitstempel auf dem Prüfstand um Jahrzehnte danebenliegen, prüfen
Sie, ob die Station diesen Wert tatsächlich übernimmt.

### Was interval bedeutet (hängt vom status ab)

Die Bedeutung von `interval` ändert sich mit dem `status`:

- **Accepted**: die Station ist registriert. `interval` ist das
  Heartbeat-Intervall in Sekunden.
- **Pending**: das CSMS möchte die Station konfigurieren, bevor es sie
  akzeptiert. `interval` gibt an, wie lange bis zur nächsten BootNotification
  gewartet werden soll.
- **Rejected**: die Station muss `interval` Sekunden warten und es erneut
  versuchen.

## Warum das auf dem Prüfstand zählt

Weil die BootNotification der Ort ist, an dem Firmware-Fehler zuerst sichtbar
werden. Ein Modellname, der nicht zum Etikett passt, eine Seriennummer, die
sich über Reboots hinweg ändert, ein Firmware-String, der nach dem Flashen nie
aktualisiert wird, eine Uhr, die nie gestellt wird. All das taucht hier auf,
bevor eine einzige Transaktion gelaufen ist. Achten Sie also auf diese Nachricht,
um inkorrektes Verhalten der Ladestation frühzeitig zu erkennen.
