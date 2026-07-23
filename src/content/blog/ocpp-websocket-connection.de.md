---
title: "Wie eine Ladestation ihre OCPP-J-WebSocket-Verbindung aufbaut"
date: 2026-05-17
description: "Die Connection-URL, das HTTP-Upgrade und die Subprotokoll-Aushandlung, HTTP Basic Auth und TLS über die drei Security Profiles, und wie die Verbindung am Leben gehalten und wieder aufgebaut wird."
tags: [ocpp, websocket, transport]
---

Bevor auch nur eine einzige OCPP-Nachricht fließt, muss die Ladestation die
WebSocket-Verbindung zum CSMS aufbauen. Im
[Protokoll-Stack](/blog/ocpp-protocol-stack) haben wir gesehen, wo die
WebSocket-Schicht sitzt (auf TCP, optional in TLS gehüllt). Dieser Artikel geht
den Aufbau dieser Verbindung durch, mit und ohne TLS.

## Wer verbindet sich mit wem

Die Rollen sind klar definiert: Das **CSMS ist der WebSocket-Server** und die
**Ladestation der Client**. Die Ladestation baut die Verbindung immer selbst auf,
und zwar als *ausgehende* TCP-Verbindung zum CSMS. Das ist Absicht, denn eine
ausgehende Verbindung umgeht NAT und Firewalls auf der Seite der Station.
Sobald sie offen ist, schickt das CSMS seine eigenen Requests über genau
denselben Socket zurück. Die Station hält diese eine Verbindung für ihre gesamte
Sitzung offen.

## Die Connection-URL

Das CSMS veröffentlicht eine **OCPP-J-Endpunkt-URL**, die eine beliebige
`ws://`- oder `wss://`-URL sein kann. Host und Pfad legt das CSMS fest.
Der Pfad ist typischerweise etwas wie `/ocpp`, festgelegt ist er aber nicht,
und die beiden Beispiele unten verwenden `/ocpp` und `/ocppj`. Die Station
leitet daraus ihre eigene **Connection-URL** ab, indem sie an diese Endpunkt-URL
einen `/` gefolgt von ihrer prozentkodierten Ladestations-Id anhängt.

```
ws://csms.example.com/ocpp/CS001
wss://csms.example.com/ocppj/RDAM%20123
```

Die Ladestations-Id im Pfad sagt dem CSMS, welche Station sich verbindet. Für sie
gelten ein paar Regeln: Sie ist ein `identifierString` von höchstens 48 Zeichen
und darf keinen Doppelpunkt (`:`) enthalten, denn derselbe Identifier dient
zugleich als HTTP-Basic-Auth-Benutzername, und ein Doppelpunkt trennt dort
Benutzername und Passwort. Die Spezifikation empfiehlt außerdem, dass sich das
CSMS nicht allein auf die URL verlässt, sondern die Ladestations-Id gegen die
Anmeldedaten der Ladestation prüft.

## Der Opening-Handshake

Eine WebSocket-Verbindung beginnt als gewöhnlicher HTTP-`GET`, der um ein
Upgrade bittet (RFC 6455). Der Opening-Request einer Station sieht so aus:

```
GET /webServices/ocpp/CS3211 HTTP/1.1
Host: some.server.com:33033
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: ocpp2.0.1, ocpp1.6
Sec-WebSocket-Version: 13
```

Der für OCPP entscheidende Header ist `Sec-WebSocket-Protocol`. Er listet die
OCPP-Versionen auf, die die Station sprechen kann, die bevorzugte zuerst, unter
Verwendung der offiziellen, bei der IANA registrierten Subprotokoll-Namen
(`ocpp2.0.1` für 2.0.1, `ocpp1.6` für 1.6). Das Beispiel oben bietet 2.0.1 an
und fällt auf 1.6 zurück.

Akzeptiert das CSMS, antwortet es mit `101 Switching Protocols` und spiegelt das
eine gewählte Subprotokoll zurück:

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
Sec-WebSocket-Protocol: ocpp2.0.1
```

Zwei Fehlerfälle sollte man auf dem Prüfstand erkennen:

- Kennt das CSMS die Ladestations-Id im URL-Pfad nicht, sollte es mit
  **HTTP 404** antworten und abbrechen.
- Stimmt das CSMS keinem angebotenen Subprotokoll zu, muss es den Handshake
  **ohne** `Sec-WebSocket-Protocol`-Header abschließen und die Verbindung dann
  sofort schließen. Ein `101` ohne vereinbartes Subprotokoll ist also in
  Wirklichkeit eine Ablehnung, kein Erfolg.

## Authentifizierung und TLS: die drei Security Profiles

Wo Authentifizierung und Verschlüsselung ins Spiel kommen, hängt vom verwendeten
[Security Profile](/blog/ocpp-protocol-stack) ab. Die drei Profile bauen die
Verbindung unterschiedlich auf.

### Profil 1: offenes ws:// mit HTTP Basic Auth

Kein TLS. Die Station authentifiziert sich mit **HTTP Basic Authentication** im
`Authorization`-Header des Upgrade-Requests. Der Benutzername ist die
Ladestations-Id (dieselbe Zeichenkette wie in der URL), und das Passwort ist
die Konfigurationsvariable `BasicAuthPassword`, eine zufällig gewählte
Zeichenkette aus 16 bis 40 Zeichen. Da kein TLS im Spiel ist, sind diese
Anmeldedaten nur base64-kodiert, also praktisch Klartext, weshalb Profil 1 in
vertrauenswürdige Netze gehört (etwa hinter ein VPN).

### Profil 2: wss:// (TLS) mit HTTP Basic Auth

Die Station schließt zuerst einen **TLS**-Handshake ab und validiert das
Server-Zertifikat des CSMS, und erst dann läuft dieselbe HTTP Basic Auth, nun im
verschlüsselten Kanal. Das CSMS ist also über sein Server-Zertifikat
authentifiziert, die Station über Basic Auth, und das Passwort liegt nicht mehr
offen.

### Profil 3: wss:// (TLS) mit Client-Zertifikat

Gegenseitiges TLS. Während des TLS-Handshakes fragt das CSMS zusätzlich ein
Client-Zertifikat an, und die Station legt ihr eigenes Zertifikat vor, um sich
zu authentifizieren. Basic Auth ist hier nicht nötig, das Client-Zertifikat
tritt an seine Stelle. Beide Seiten sind zertifikatsbasiert authentifiziert.

Bei den beiden TLS-Profilen ist die Reihenfolge: TCP öffnen, den TLS-Handshake
(mit den Zertifikatsprüfungen) durchführen, dann das HTTP-Upgrade mit
`Sec-WebSocket-Protocol` (plus Basic Auth bei Profil 2), und erst danach ist der
WebSocket offen. Ein bekanntes Problem taucht hier wieder auf: Eine Station
mit falscher Uhrzeit kann das Server-Zertifikat nicht validieren, weil die
Gültigkeit eines Zertifikats zeitlich begrenzt ist und die Ladestation das Zertifikat
bspw. als noch nicht gültig ansieht.

## Die Verbindung am Leben halten

Ist der Socket einmal offen, bleibt er offen. Dafür sorgen WebSocket-**Ping- und
Pong**-Frames. Sie lassen jede Seite einen toten Gegenpart oder einen Netzbetreiber
erkennen, der eine untätige Verbindung stillschweigend kappt. Die Station sendet
dabei Pings im Intervall, das in `WebSocketPingInterval` konfiguriert ist. Ping/Pong
kann die meisten OCPP-Heartbeats ersetzen, aber nicht die Zeitsynchronisation, die
eine HeartbeatResponse liefert. Deshalb wird mindestens ein echter Heartbeat pro Tag
empfohlen, um die Uhrzeit korrekt zu halten.

## Wenn die Verbindung abbricht: Reconnect mit Back-off

Geht die Verbindung verloren, muss die Station sich neu verbinden, und zwar mit
einer **steigenden Back-off-Zeit plus Randomisierung**. Die Randomisierung ist
wichtig! Sie verhindert, dass eine ganze Flotte von Ladestationen das CSMS in dem
Moment überrennt, in dem sie nach einem Neustart alle gleichzeitig zurückkommen.

Der erste Versuch wartet `RetryBackOffWaitMinimum` Sekunden plus einen
Zufallswert bis zu `RetryBackOffRandomRange`. Jeder fehlgeschlagene Versuch
verdoppelt die Back-off-Zeit (und addiert jedes Mal einen neuen Zufallswert) bis
zu `RetryBackOffRepeatTimes` Verdopplungen, danach versucht die Station es
weiter mit diesem letzten Intervall, ohne es weiter zu erhöhen.

Beim Wiederverbinden sollte die Station **keine** neue [BootNotification](/blog/ocpp-boot-notification)
senden, sofern sich darin nichts geändert hat. Das CSMS hat die Ladestation ja bereits
im Moment des Verbindungsaufbaus dem WebSocket zugeordnet.

## Wie es in dieser Reihe weitergeht

Mit offener oder authentifizierter WebSocket-Verbindung ist die Station nun bereit,
OCPP zu sprechen. Die allererste Anwendungsnachricht, die sie sendet, ist die
[BootNotification](/blog/ocpp-boot-notification) und um diese Nachricht geht es im
nächste Artikel.
