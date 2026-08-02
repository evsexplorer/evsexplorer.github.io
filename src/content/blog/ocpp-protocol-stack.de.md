---
title: "Der Protokoll-Stack unter OCPP: TCP, TLS, WebSocket und OCPP-J"
date: 2026-05-10
description: "OCPP-Nachrichten reisen nicht von allein über die Leitung. Sie nutzen dafür altbekannte Transportmittel. Von TCP bis zur Anwendungsschicht, und wo die Security Profiles und TLS ins Spiel kommen."
tags: [ocpp, transport, security]
---

Eine OCPP-Nachricht wie eine BootNotification reist nicht von allein über die
Leitung. Sie wird von verschiedenen Protokollschichten transportiert, jede mit einer
klaren Aufgabe. Wenn Sie diesen Protokoll-Stack kennen, wissen Sie auch wo Sie bei
einem Fehler suchen müssen, denn ein fehlgeschlagener TLS-Handshake, ein abgelehntes
WebSocket-Upgrade und ein fehlerhaftes OCPP-J-Frame sind drei sehr unterschiedliche
Probleme.

Hier der gesamte Stack für OCPP 2.0.1:

```
+--------------------------------------------------------+
|  OCPP application layer                        Part 2  |
+--------------------------------------------------------+
|  OCPP-J  JSON message framing                  Part 4  |
+--------------------------------------------------------+
|  WebSocket  (RFC 6455)                                 |
+--------------------------------------------------------+
|  TLS   (optional: security profiles 2 and 3)           |
+--------------------------------------------------------+
|  TCP  /  IP                                            |
+--------------------------------------------------------+
```

Gehen wir ihn von unten nach oben durch.

## TCP / IP

Ganz unten liegt eine gewöhnliche TCP-Verbindung über IP. Dabei baut die
**Ladestation** die Verbindung zum CSMS auf, nicht umgekehrt. Das umgeht
NAT und Firewalls auf der Seite der Ladestation, da nur eine ausgehende
Verbindung nötig ist, und die Station hält diese Verbindung für ihre gesamte
Sitzung offen.

Das TCP Protokoll bietet OCPP einen zuverlässigen, geordneten Bytestrom, auf
den sich OCPP-J verlässt. Für die Datenintegrität stützt es sich auf den
darunterliegenden TCP/IP-Transport, statt eigene Prüfsummen hinzuzufügen.

## TLS (optional)

Hier kommt die Sicherheit ins Spiel, wenn auch optional. Bei zwei der drei OCPP
Security Profiles wird die TCP-Verbindung in **TLS** gehüllt, bevor überhaupt
etwas passiert. Das ist der Unterschied zwischen einer `ws://`-URL und einer
`wss://`-URL. TLS verschlüsselt den Kanal und erlaubt es der Ladestation (über
das Server-Zertifikat des CSMS) zu prüfen, ob sie wirklich mit ihrem CSMS spricht.
Im strengsten Profil prüft im Gegenzug auch das CSMS die Station über ein
Client-Zertifikat.

Eine Einschränkung, die man kennen sollte, wenn Zertifikate im Spiel sind: Eine
Station mit falscher Uhrzeit kann das Server-Zertifikat unter Umständen nicht
erfolgreich validieren, weil die Gültigkeit eines Zertifikats zeitlich begrenzt
ist. Das ist ein weiterer Grund, warum die korrekte Uhrzeit der Ladestation wichtig
ist (siehe `currentTime` im [BootNotification-Artikel](/blog/ocpp-boot-notification)).

## WebSocket

Auf TCP (oder TLS) sitzt eine **WebSocket**-Verbindung (RFC 6455). Sie beginnt
als HTTP-Anfrage, die dann zu einem dauerhaften, bidirektionalen Kanal hochgestuft
wird, sodass beide Seiten jederzeit senden können.
Bei diesem Upgrade einigen sich beide Seiten über den registrierten Subprotokoll-Namen
`ocpp2.0.1` im Header `Sec-WebSocket-Protocol` darauf, welche OCPP-Version sie
sprechen. Ist die WebSocket-Verbindung aufgebaut, wird sie durch regemäßige Ping/Pong
Nachrichten am Leben gehalten, die es jeder Seite der Verbindung ermöglichen,
Netzwerkunterbrechungen oder das Wegfallen der anderen Seite zu erkennen.

Die Details dieses Handshakes (die URL, die Aushandlung des Subprotokolls und
wie eine Ablehnung aussieht) sind ein Thema für sich und bekommen einen eigenen
Artikel. Für das Stack-Bild genügt es zu wissen, dass WebSocket eine langlebige,
bidirektionale Nachrichtenleitung bereitstellt.

## OCPP-J (Teil 4)

Der WebSocket transportiert lediglich Nachrichten. **OCPP-J** (Teil 4 der
Spezifikation) legt fest, was darin steht. Jede OCPP-Nachricht ist ein JSON-Array
mit einer führenden Zahl, die angibt, um welche Art von Nachricht es sich handelt.
- Ein Request (**Call**) sieht so aus: `[2, messageId, action, payload]`.
- Eine erfolgreiche Antwort (**CallResult**) sieht so aus: `[3, messageId, payload]`.
- Ein Fehler (**CallError**) sieht so aus: `[4, messageId, errorCode, errorDescription, errorDetails]`.

Die `messageId` ordnet eine Antwort (CallResult, CallError) ihrer Anfrage (Call) zu,
und spiegelt deshalb die ID zurück, die der Call gewählt hat.

## OCPP-Anwendungsschicht (Teil 2)

Ganz oben liegt das Protokoll, das alle meinen, wenn sie "[OCPP](/blog/what-is-ocpp)" sagen. Es definiert
die eigentlichen Nachrichten und ihre Regeln gemäß Teil 2 der Spezifikaton.
BootNotification, Authorize, TransactionEvent, MeterValues, Reset und Co wohnen
hier, jede mit ihren Feldern, Enums und Requirements. Die meisten Artikel dieser Reihe
handeln eigentlich von dieser Schicht. Alles darunter bringt nur das JSON sicher
von einer Seite zur anderen.

## Die drei Security Profiles

OCPP 2.0.1 definiert genau drei Security Profiles, und eine Station und ihr CSMS
verwenden jeweils eines davon. Sie unterscheiden sich darin, wie jede Seite
authentifiziert wird und ob der Kanal verschlüsselt ist:

| Profil | Station authentifiziert durch | CSMS authentifiziert durch | Kanal |
| --- | --- | --- | --- |
| 1. Unsecured Transport with Basic Authentication | HTTP Basic Auth | nicht authentifiziert | unverschlüsselt (`ws://`) |
| 2. TLS with Basic Authentication | HTTP Basic Auth | Server-Zertifikat | TLS (`wss://`) |
| 3. TLS with Client Side Certificates | Client-Zertifikat | Server-Zertifikat | TLS (`wss://`) |

TLS kommt also mit den **Profilen 2 und 3** ins Spiel. Profil 1 läuft über
offenes `ws://` mit nur HTTP Basic Authentication für die Station, was bedeutet,
dass das CSMS nicht authentifiziert und der Verkehr nicht verschlüsselt ist. Die
Spezifikation sagt hier deutlich, dass Profil 1 nur in vertrauenswürdigen Netzen
verwendet werden soll (etwa mit einem VPN zwischen Station und CSMS). Für den
Feldbetrieb wird ein TLS-Profil dringend empfohlen. OCPP 2.0.1 ganz ohne Sicherheit
zu betreiben (manchmal auch als Profil 0 bezeichnet) ist technisch möglich, gilt
aber ausdrücklich nicht als gültige OCPP-2.0.1-Implementierung.

Welches Profil eine Station fährt, ist nicht nur eine Transportfrage. Es
entscheidet auch darüber, wie viel Aufwand es später kostet, dieselbe Station auf
ein anderes Backend umzubiegen, von drei Textfeldern bis zur Zertifikatszeremonie.
Das ist das Thema von
[Migration einer Ladestation zu einem neuen CSMS](/blog/csms-migration-security-profiles).

## Wie es in dieser Reihe weitergeht

Nachdem Sie jetzt den Aufbau des Protokoll-Stack kennen, ist es an der Zeit zu verstehen,
[wie die WebSocket-Verbindung tatsächlich aufgebaut wird](/blog/ocpp-websocket-connection). Vom
HTTP-Upgrade bis zur Aushandlung des Subprotokolls. Das ist das Thema des nächsten Artikels.
