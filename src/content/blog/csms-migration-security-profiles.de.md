---
title: "Deine Wallbox, dein Backend? Warum die Migration einer Ladestation zu einem neuen CSMS am Security Profile scheitert"
date: 2026-08-02
updated: 2026-08-13
description: "Der EU Data Act gibt Eigentümern das Recht, ihre Ladedaten an einen Dienst ihrer Wahl zu schicken. Ob das eine Sache von fünf Minuten oder ohne Mithilfe des neuen Betreibers technisch unmöglich ist, entscheiden die OCPP Security Profiles 1, 2 und 3."
tags: [ocpp, security, certificates, data-act]
---

Ein Kunde kauft eine Wallbox, nutzt sie zwei Jahre mit der Hersteller-App und
will dann etwas anderes. Vielleicht einen Tarifoptimierer, der in den günstigsten
Stunden lädt, vielleicht einen PV-Überschuss-Dienst, vielleicht einfach die
eigene Hausautomatisierung, die endlich ein OCPP-Backend hat. Also stellt er die
naheliegende Frage: Kann ich meinen Ladepunkt auf ein anderes CSMS umbiegen?

Regulatorisch bewegt sich die Antwort in Richtung Ja. Technisch lautet sie in
viel zu vielen Fällen weiterhin Nein. Und entschieden wird das weder von der App
noch vom Tarif noch vom Geschäftsmodell des Herstellers, sondern vom OCPP
Security Profile, mit dem die Box läuft.

## Was die Regulierung tatsächlich sagt

Maßgeblich ist hier der **EU Data Act (Verordnung (EU) 2023/2854)**, dessen
Kernvorschriften seit September 2025 gelten. Er erfasst vernetzte
Produkte und eine vernetzte Wallbox ist genau das. Nutzer (also die Personen und
Unternehmen, die das Gerät besitzen oder mieten) haben das Recht, auf die durch
die Nutzung erzeugten Daten zuzugreifen und diese mit Dritten ihrer Wahl zu
teilen. Und zwar mit minimalem rechtlichem und technischem Aufwand.

Das ist ein echter Einschnitt. Die Ladedaten einer privat betriebenen Wallbox
sind nichts mehr, was Hersteller oder vertraglich gebundener Backend-Anbieter als
allein ihre Sache behandeln können. Will der Eigentümer, dass seine
Ladevorgänge, Zählerstände und Ladeprofile in einem Tarifoptimierer oder einem
Energiemanagement landen, steht das Gesetz auf seiner Seite.

Ein Recht auf die Daten ist aber nicht automatisch ein Recht, das OCPP-Backend
um eine Datenausleitung erweitern zu lassen. In der Praxis ist der sauberste Weg,
Ladedaten in einen Dienst der eigenen Wahl zu bekommen, das CSMS dieses Dienstes direkt
mit der Station sprechen zu lassen, damit es das Laden auch steuern kann und nicht
nur im Nachhinein mitliest. Womit wir bei dem Teil sind, den die Verordnung nicht
beschreibt, nämlich was diese Migration technisch bedeutet.

## Was eine CSMS-Migration wirklich ist

In OCPP 2.x wird die Verbindung zu einem Backend über ein
`NetworkConnectionProfile` beschrieben. Es enthält die CSMS-URL, den Transport,
ein Message-Timeout, das Netzwerkinterface und, entscheidend, ein Feld
`securityProfile`. Eine Ladestation hält mehrere Verbindungsprofile in nummerierten
Konfigurations-Slots und probiert sie in der Reihenfolge, die
`OCPPCommCtrlr.NetworkConfigurationPriority` vorgibt. Die Spezifikation verlangt
mindestens zwei Slots (B09.FR.06), damit eine Station auch remote umgezogen werden kann.

Der Standardweg ist Use Case B10 (Migrate to new CSMS). Das aktuelle CSMS
schreibt mit `SetNetworkProfileRequest` (B09) ein neues Verbindungsprofil in einen freien
Slot, sortiert `NetworkConfigurationPriority` so um, dass das neue Profil vorne
steht, schickt einen `ResetRequest(OnIdle)` und nach dem Reboot verbindet sich
die Station mit dem neuen CSMS. Scheitert das neue Profil nach
`NetworkProfileConnectionAttempts` Versuchen, fällt die Station auf den nächsten
Eintrag der Liste zurück.

Man beachte, wer hier steuert: das alte CSMS. B10 ist für einen CPO geschrieben,
der einen Standort geordnet an einen anderen CPO übergibt. Der private
Eigentümer, der einfach nur wechseln will, hat keinen solchen Akteur. Sein
einziger Hebel ist das, was die Ladestation lokal anbietet, bspw. über ein Web-UI, eine
Bluetooth-App oder eine Konfigurationsdatei.

Und was er dort lokal eingeben muss, hängt stark vom Security Profile ab.

## Die Security Profiles, die OCPP 2.x definiert

Der [Artikel zum Protokoll-Stack](/blog/ocpp-protocol-stack) hat die drei Profile
bereits von der Transportseite her eingeführt, einschließlich der Frage, warum
das gelegentlich genannte Profil 0 eine Altlast aus OCPP 1.6-J ist und nichts,
was OCPP 2.x definiert. Hier stehen sie noch einmal, zusammen mit den Details der 
Authentifizierung, die bei einer Migration vom Transportdetail zum Produktproblem
werden können:

| Profil | Authentifizierung Ladestation | Authentifizierung CSMS | Kanal |
| --- | --- | --- | --- |
| 1 | HTTP Basic Authentication | keine | Klartext, kein TLS |
| 2 | HTTP Basic Authentication | TLS-Serverzertifikat | TLS |
| 3 | TLS-Clientzertifikat | TLS-Serverzertifikat | TLS |

Der [Security Operations Guide der OCA](https://openchargealliance.org/ocpp-info-whitepapers/security-operations-guide/)
wird noch deutlicher als der Text der Spezifikation: OCPP 2.x ohne Security Profile 2 (und optional 3) ist keine
gültige OCPP-2.x-Implementierung, und die Zertifizierung für OCPP 2.x setzt
Profil 2 voraus. Für alles, was einem im Feld begegnet, ist Profil 2 oder 3 also
der realistische Ausgangspunkt einer Migration.

Für alle gelten zwei generische Regeln. Station und CSMS nutzen immer genau ein
Profil, und jede Seite beendet die Verbindung, wenn die andere mit einem anderen
Profil ankommt (A00.FR.001 bis A00.FR.003). Und das Security Profile muss
konfiguriert sein, bevor OCPP-Kommunikation überhaupt möglich ist (A00.FR.004).

### Profil 1: ungesicherter Transport mit Basic Authentication

Was der Nutzer ändern muss: URL, Charge-Point-Identity, Passwort. Mehr nicht.

Der Benutzername muss der Charging Station Identity entsprechen, die in der
OCPP-J-Verbindungs-URL verwendet wird (A00.FR.204), und das Passwort liegt in der
Variablen `SecurityCtrlr.BasicAuthPassword`, eine zufällige Zeichenkette mit 16
bis 40 Zeichen, als UTF-8 gesendet, nicht base64-kodiert (A00.FR.205, und das
unterscheidet sich von OCPP 1.6). Jedes lokale UI mit drei Textfeldern schafft
diese Migration.

Der Haken ist, dass Profil 1 im Feld ohnehin nichts zu suchen hat. Die Spec
begrenzt es auf vertrauenswürdige Netze wie ein VPN zwischen CSMS und Station
(A00.FR.201), und die OCA benennt die Konsequenz explizit: Ist das VPN die
einzige Sicherheitsmaßnahme, legt eine Fehlkonfiguration oder eine gestohlene
SIM-Karte das CSMS und womöglich alle dahinter liegenden Stationen offen. Profil
1 ist also die einfache Migration, die man nicht haben will.

### Profil 2: TLS mit Basic Authentication

Was der Nutzer ändern muss: URL, Identity, Passwort **und den Trust Anchor**.

Hier beginnen Migrationen unter Umständen bereits zu scheitern. Die Station muss den
Zertifikatspfad des CSMS-Zertifikats prüfen (A00.FR.308) und verifizieren, dass
der `commonName` den FQDN des CSMS enthält (A00.FR.309). Sind Zertifikat oder
Kette ungültig, löst die Station ein `InvalidCsmsCertificate` Security Event aus
und beendet die Verbindung (A00.FR.310, A00.FR.311). Die Spec sichert sogar den
Wechsel selbst ab: Soll eine Station auf Profil 2 oder höher wechseln und es ist
kein gültiges `CSMSRootCertificate` installiert, muss sie den Request ablehnen
und das Profil nicht ändern (A05.FR.02).

Die naheliegende Frage ist, ob die Station der öffentlichen CA, die das neue
CSMS-Zertifikat ausgestellt hat, einfach vertraut, so wie ein Browser es täte.
Meistens nicht. Und das mit Absicht. Die OCA rät ausdrücklich von vorinstallierten
Bundles bekannter Root-CAs auf Ladestationen ab, denn in kritischer Infrastruktur
hunderten CAs zu vertrauen bedeutet, dass ein Angreifer nur eine davon
kompromittieren muss, und der Angriff trifft dann jede Station mit diesem Bundle.
Für die OCPP-Verbindung sollen nur Roots aus der Hierarchie des Charge Point
Operators verwendet werden.

Praktisch gelingt eine Profil-2-Migration also nur, wenn eine der folgenden
Bedingungen erfüllt ist:

- das neue CSMS präsentiert ein Zertifikat, dessen Kette auf eine Root CA führt,
  dem die Station bereits vertraut (über Betreibergrenzen hinweg selten, realistisch
  nur wenn beide dieselbe öffentliche CA nutzen und der Hersteller doch ein
  Bundle ausgeliefert hat)
- das lokale UI erlaubt dem Nutzer, ein neues Root-Zertifikat als PEM zu
  installieren
- jemand mit bestehender OCPP-Verbindung installiert es vorher per
  `InstallCertificateRequest` (Use Case M05), was bedeutet, dass der Betreiber des
  **alten** CSMS mitspielen muss.

Drei weitere Punkte verschärfen das Problem im Feld. Wildcard-Zertifikate sind nicht
OCPP-konform, ein neues CSMS mit `*.example.com` wird also abgelehnt, sofern der
Hersteller nicht das nicht empfohlene Opt-out `AllowCSMSTLSWildcards`
implementiert hat. Station und CSMS müssen sich auf TLS 1.2 oder höher und auf
die vorgeschriebenen Cipher Suites einigen (A00.FR.313, A00.FR.318, A00.FR.319),
sonst gibt es ein `InvalidTLSVersion` oder `InvalidTLSCipherSuite` Event und eine
geschlossene Verbindung. Und die Uhr muss vor dem ersten TLS-Handshake stimmen,
denn eine Station mit falschem Datum kann das Serverzertifikat gar nicht
validieren. Die Spec weist darauf hin, und die OCA empfiehlt NTS (Network Time
Security, RFC 8915, also NTP mit TLS-basierter Authentifizierung, damit niemand
die Uhr so verstellen kann, dass ein abgelaufenes Zertifikat akzeptiert wird) und
warnt, dass der OCPP-Heartbeat keine Zeitquelle sein kann, weil es ihn erst nach der
Verbindung gibt, die man gerade aufbauen will.

### Profil 3: TLS mit clientseitigen Zertifikaten

Was der Nutzer ändern muss: alles Obige, plus ein neues Clientzertifikat aus der
PKI des neuen Betreibers. Genau hier endet die Selbstbedienungs-Migration.

Die Station authentifiziert sich mit ihrem eigenen Zertifikat als
TLS-Clientzertifikat (A00.FR.401, A00.FR.402). Auf der Gegenseite prüft das neue
CSMS nicht nur die Kette (A00.FR.403). Es verifiziert außerdem, dass der
`organizationName` (O) im Subject den Namen des CSO enthält (A00.FR.404) und dass
der `commonName` (CN) die eindeutige Seriennummer der Ladestation enthält
(A00.FR.405). Ein Zertifikat des bisherigen Betreibers fällt damit doppelt durch.
Falsche Kette, falsche Organisation.

Die Box braucht also ein frisches Zertifikat, und OCPP hat genau dafür einen
Mechanismus. In Use Case A02 stößt das CSMS das Update an, die Station erzeugt
ein neues Schlüsselpaar und sendet einen `SignCertificateRequest` mit dem CSR,
das CSMS reicht ihn an seine CA weiter und liefert das signierte Zertifikat per
`CertificateSignedRequest` zurück. A03 ist derselbe Ablauf, nur von der Station
angestoßen.

Diese Sequenz liest man mit Blick auf eine Migration am besten zweimal. Jede
Nachricht darin läuft über eine bestehende OCPP-Verbindung zu genau dem CSMS, das
das Zertifikat signieren soll. Das neue CSMS akzeptiert aber keine TLS-Verbindung
von einer Station, deren Clientzertifikat es nicht validieren kann. Der
Enrollment-Pfad führt durch die Tür, die er erst aufschließen soll. Solange der
neue Betreiber keinen Out-of-band-Weg für das Enrollment anbietet oder das alte
CSMS zum Abschied bereit ist, neuen Root und neues Stationszertifikat zu
installieren, gibt es innerhalb von OCPP keinen Weg von A nach B.

Die OCA beschreibt den Workaround, der eigentlich für die Produktion gedacht ist:
Die Station verbindet sich zuerst mit einem Commissioning-Server und dieser
tauscht das Zertifikat gegen eines der Ziel-PKI, bevor die Station jemals mit dem
produktiven CSMS spricht. Das ist ein Migrationsservice, den der neue Betreiber
bauen muss. Über eine Einstellungsseite bekommt ein Eigentümer das nicht hin.

### Zwei Fallen, die es schlimmer machen

**Zurück geht es nicht.** Das Absenken des Security Profiles ist bewusst nicht
Teil von OCPP und darf nicht per `SetVariablesRequest` oder `DataTransfer`
erfolgen (A00.FR.005). Für einen migrierenden Eigentümer noch unangenehmer: hat
sich eine Station einmal erfolgreich mit einem höheren Profil verbunden, muss sie
jedes `NetworkConnectionProfile` mit niedrigerem Profil löschen und die
Prioritätenliste entsprechend aktualisieren, und das CSMS darf ab dann keine
Verbindung mit niedrigerem Profil mehr zulassen (A05.FR.06, A05.FR.07). Der alte,
einfache Slot, den man wiederverwenden wollte, ist weg.

OCPP 2.1 hat das mit der Variablen `AllowSecurityProfileDowngrade` etwas
entschärft, und es gibt sie genau wegen der Migration von CSMS zu CSMS. Erlaubt
ist damit aber nur der Schritt von Profil 3 auf Profil 2, niemals hinunter auf
Profil 1. Die Konsequenz für alle, die ein aufnehmendes CSMS bauen: Man muss das
Profil unterstützen, das die Station bereits fährt, mindestens aber Profil 2.

**Das Root-Zertifikat kann cross-signiert sein.** Ist
`SecurityCtrlr.AdditionalRootCertificateCheck` gesetzt, darf nur ein
`CSMSRootCertificate` (plus ein temporäres Fallback) installiert sein, und eine
neue Root CA wird nur akzeptiert, wenn sie von der CA signiert ist, die sie ersetzt
(M05.FR.09 bis M05.FR.13). Als Manipulationsschutz ist das sinnvoll, denn ein
Angreifer müsste CSMS und CA gleichzeitig kompromittieren. Es bedeutet aber auch,
dass das unabhängige Root CA Zertifikat eines neuen Betreibers niemals über OCPP
installiert werden kann, weil es die CA des bisherigen Betreibers signieren müsste.
Für eine betreiberübergreifende Migration auf einer solchen Station ist der OCPP-Weg
konstruktionsbedingt zu.

## Woran es in der Praxis scheitert

Stellt man die Profile dem gegenüber, was eine typische Heim-Wallbox lokal
tatsächlich anbietet, sieht das so aus.

| Profil | Was der Nutzer liefern muss | Übliche Unterstützung im lokalen UI |
| --- | --- | --- |
| 1 | URL, Identity, Passwort | ja, drei Textfelder |
| 2 | zusätzlich neues CSMS-Root-Zertifikat | selten, PEM-Upload ist unüblich |
| 3 | zusätzlich CSR-Erzeugung, signiertes Clientzertifikat, passende O und CN | so gut wie nie |

Hersteller-Apps und lokale Web-UIs unterstützen häufig nur bei der Inbetriebnahme, um
OCPP-URL und Zugangsdaten einzutragen. Zertifikatsverwaltung galt als Sache des CPO.
Erledigt über OCPP aus einem Backend, das mitspielt. Genau diese Annahme ist nicht
erfüllt, wenn der Migrierende der Eigentümer ist und das alte Backend kein Interesse
daran hat, zu helfen.

Das Ergebnis ist ein Gerät, das technisch problemlos mit einem anderen CSMS
sprechen könnte, hinter einem UI, das diese Migration nicht unterstützt.

## Was es bräuchte

Für Hersteller von Ladestationen muss die lokale Konfigurationsoberfläche
erwachsen werden. Konkret:

- URL, Charge-Point-Identity und Basic-Auth-Passwort, wie heute.
- Ein CSMS-Root-Zertifikat als PEM installieren und ansehen, installierte
  Zertifikate auflisten und löschen (die OCPP-Entsprechungen sind M03, M04, M05).
- Ein Schlüsselpaar erzeugen und einen CSR exportieren, damit der Nutzer ihn dem
  neuen Betreiber geben kann, plus Import des signierten Zertifikats.
- Aktives Security Profile und konfigurierte Netzwerk-Slots anzeigen, mit ehrlich
  erklärten Downgrade-Regeln statt einer stillen Ablehnung.
- Verlässliche Systemzeit vor dem ersten TLS-Versuch, über NTP oder besser NTS.
- Security Events sichtbar machen. Wer vor einer Station steht, die sich nicht
  verbindet, sollte `InvalidCsmsCertificate` lesen können und nicht auf eine
  blinkende LED starren.

Für Betreiber eines aufnehmenden CSMS ist die Migration ein Produktfeature und
kein Support-Ticket:

- Root-Zertifikatskette und CSMS-FQDN veröffentlichen und nicht auf
  Wildcard-Zertifikate setzen.
- Mindestens Profil 2 unterstützen (die Zertifizierung verlangt es ohnehin) und
  das Profil unterstützen, das die ankommenden Stationen bereits fahren.
- Einen Enrollment-Endpunkt anbieten, der einen CSR out of band annimmt, oder
  einen Commissioning-Server, den die Station erreichen kann, bevor sie
  vollständig provisioniert ist.
- Dokumentieren, welche Hersteller-UIs die nötigen Schritte überhaupt können.
  Der Onboarding-Funnel stirbt an dem Schritt, den die Box nicht beherrscht.

## Das Ganze von der CSMS-Seite prüfen

Zum Testen einer Migration brauchen Sie ein empfangendes CSMS, das Sie selbst
kontrollieren. Bevor Sie eines aufsetzen, lohnt es sich, die oben beschriebenen
Fehler danach zu trennen, welche Seite ablehnt. Beide sind nicht gleich gut
beobachtbar.

Lehnt das CSMS ab (ein Client-Zertifikat, das es nicht validieren kann, nicht
passende Basic Auth, ein Security Profil, für das die Station nicht provisioniert ist),
kann es festhalten, was passiert ist. [EVSExplorer](/) schreibt jeden Versuch als
Verbindungsereignis mit einem Grund mit, und das Binden einer Station an ein
Security Profil macht Verbindungsversuche, die nicht die Anforderungen dieses
Profils entsprechen, sichtbar.

```bash
# Die Station ausschließlich für gegenseitiges TLS provisionieren
curl -s -X PATCH $BASE/api/charge-points/CS001 \
  -H 'Content-Type: application/json' -d '{"securityProfile": 3}'

# Welches Profil haben die letzten Sitzungen ausgehandelt, und warum wurde etwas abgelehnt?
curl -s "$BASE/api/charge-points/CS001/connection-events?limit=10" \
  | jq '.[] | {recordedAt, event, reason, securityProfile}'
```

Jedes [Verbindungsereignis hält das ausgehandelte Profil fest](/#connection-stability),
sodass Sie erkennen können, wenn eine Station auf ein niedrigeres Profil zurückfällt.
Genauso dokumentiert ein abgelehnter Verbindungsversuch seinen Grund:
`profile_mismatch`, `invalid_client_cert`, `missing_auth` oder `invalid_auth`.
Wird die Station an ein anderes Security Profil gebunden, wird eine bereits offene
Sitzung mit `profile_changed` geschlossen, damit sich die Station auf dem vorgesehenen
Security Profil neu verbindet.

Eine Besonderheit: A00.FR.405 verlangt, dass der `commonName` die Seriennummer der Station
enthält. EVSExplorer prüft den gesamten CN gegen die Ladestations-Id. Das ist Serverrichtlinie,
keine OCPP-Vorgabe.

Lehnt die **Station** ab, erfährt das empfangende CSMS sehr wenig. Das ist genau
der Profil-2-Fall weiter oben in diesem Artikel. Die Station kann die Zertifikate-Kette
des neuen CSMS nicht validieren und bricht deshalb den TLS-Handshake ab. Es entsteht
kein WebSocket und keine OCPP-Sitzung, über die sich etwas melden ließe.

Ganz stumm ist dieser Fehler eine Schicht tiefer allerdings nicht. Eine Station, die
die Kette nicht validieren kann, beendet den Handshake typischerweise mit einem
TLS-Alert `unknown_ca`, den die Gegenstelle sieht, obwohl OCPP nie beginnt.
Dieses Signal liegt in der TLS-Schicht und nicht in einem OCPP-Nachrichten-Log.
Ob Sie es je zu lesen bekommen, hängt also davon ab, was Ihr CSMS bzgl. Handshakes
protokolliert, die vor dem Upgrade abbrechen.

Es liegt nahe, diese Lücke durch Security-Ereignissen der Station zu füllen, doch das
kann nicht gelingen. Die Station legt das Ereignis zwar in ihrem Security-Log ab (A04.FR.04)
und muss Meldungen im Offline-Zustand für eine garantierte Zustellung puffern
(A04.FR.02), doch die Zustellung braucht weiterhin eine Verbindung. B02.FR.02 definiert:
Solange eine BootNotification nicht mit Accepted beantwortet ist, darf eine Station außer
`BootNotificationRequest` keinen CALL senden, sofern das CSMS nicht danach fragt, und
`SecurityEventNotification` ist kein Wert, den `TriggerMessage` anfordern kann.

[Die Security-Ereignisse einer Station](/#feature-security-events)
(`InvalidCsmsCertificate`, `InvalidTLSVersion`, `InvalidTLSCipherSuite`) sind
damit eine nachträgliche Auswertung und kein Live-Signal, und diese Auswertung
landet womöglich nicht dort, wo Sie stehen. Im B10-Ablauf unternimmt die Station
je Eintrag der Prioritätsliste `NetworkProfileConnectionAttempts` Versuche
(B10.FR.03), eine Verbindung aufzubauen. Sind die erschöpft, soll sie auf das
Verbindungsprofil ihrer letzten erfolgreichen Verbindung zurückfallen (B10.FR.07). Der gepufferte
Bericht darüber, warum das neue Backend sie abgewiesen hat, wird also eher an das **alte**
CSMS zugestellt, sofern dieses die Station noch annimmt. Was für sich genommen
schon etwas darüber sagt, wen dieser Prozess begünstigt.

Auf der empfangenden Seite bleiben Ihnen Verbindungsereignisse für das, was Sie
abgelehnt haben, und ein abgebrochener Handshake für das, was Sie abgelehnt hat.

Das Security Profile 3 Enrollment-Problem bleibt. Ohne bestehende WebSocket-Verbindung
wird kein CSR signiert. An der Henne-Ei-Situation von A02 und A03 ändern SecurityEvents
und TLS Alerts nichts.

## Fazit

Der Data Act hat die Frage geklärt, wem die Ladedaten gehören. Die Mechanik hat
er nicht geklärt, und die Mechanik steckt in einer Spezifikation, die davon
ausgeht, dass ein kooperativer CPO jede Änderung steuert. Profil-1-Migrationen
sind trivial aber unsicher. Profil-2-Migrationen hängen an einer einzigen
PEM-Datei, für deren Installation die meisten Wallboxen dem Eigentümer keinen Weg
anbieten. Profil-3-Migrationen verlangen eine Schlüsselzeremonie zwischen zwei
Betreibern, die Wettbewerber sein können.

Das ist keine Lücke in OCPP. Jede dieser Anforderungen ist für sich genommen
sicherheitstechnisch begründet. Es ist eine Lücke im Werkzeug drumherum, und
Hersteller von Ladestationen können sie schließen, indem sie
Zertifikatsverwaltung als etwas behandeln, das der Eigentümer des Geräts tun
darf.
