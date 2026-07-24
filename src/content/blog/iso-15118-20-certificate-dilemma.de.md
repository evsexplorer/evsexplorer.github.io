---
title: "Das Zertifikate-Dilemma: Wie wir den ISO-15118-20-Support auf OCPP 1.6 und 2.0.1 zurückportieren (müssen)"
date: 2026-06-02
description: "Ab 2027 verlangt AFIR ISO 15118-20, doch OCPP 1.6 und 2.0.1 haben keinen standardisierten Weg für dessen separate Zertifikatsketten. Drei Wege zum Backport, und warum die OCA handeln sollte."
tags: [afir, ocpp, iso-15118, certificates]
---

Als Softwareentwickler für Ladeinfrastruktur blickt man mit gemischten Gefühlen
auf das Jahr 2027.

Einerseits bringt die europäische AFIR-Verordnung (Alternative Fuels
Infrastructure Regulation) den lang ersehnten Push für moderne Protokolle: Ab
dem 1. Januar 2027 müssen neu installierte öffentliche und private Ladepunkte
(Mode 3 AC und DC) die ISO 15118-20:2022 zwingend unterstützen. Das bedeutet
unter anderem TLS 1.3, neue Cipher Suites und neue V2G-Zertifikatsketten.

Andererseits stehen wir in der Entwicklung vor einer relevanten Protokoll-Lücke.
Fahrzeughersteller migrieren nur langsam, weshalb Ladestationen im Feld
Dual-Stack operieren müssen. Sie müssen sowohl die alte ISO 15118-2 (für
Bestandsfahrzeuge) als auch die neue ISO 15118-20 parallel bedienen.

Das Problem? Das Kommunikationsprotokoll zum Backend (CSMS). Der offizielle
Support für das Zertifikatsmanagement der ISO 15118-20 kommt erst mit OCPP 2.1.
Im Feld dominieren jedoch OCPP 1.6J und zunehmend OCPP 2.0.1. Beide wissen nichts
von den neuen, separaten Zertifikatsketten der ISO 15118-20.

Wie lösen wir dieses Problem bei Bestands-Wallboxen und aktuellen Produktlinien,
ohne auf OCPP 2.1 warten zu können? Ein Blick in die technische Realität.

## Die Ausgangslage: Warum die aktuellen OCPP-Standards noch nicht bereit sind

Um Plug & Charge sicher zu betreiben, benötigt die Ladestation (EVSE) ein
gültiges V2G-Root-Zertifikat (bzw. die Kette), um die TLS-Verbindung mit dem
Fahrzeug zu verifizieren. Da ISO 15118-2 und ISO 15118-20 kryptografisch und
strukturell nicht abwärtskompatibel sind, benötigen wir im Speicher der Wallbox
zwei parallele V2G-Zertifikatsketten.

Hier stoßen die etablierten OCPP-Versionen an ihre Grenzen.

### OCPP 1.6J: kein natives Zertifikatsmanagement

OCPP 1.6 kennt im Core-Standard überhaupt kein Zertifikatshandling. Die Branche
rettet sich seit Jahren mit zwei bekannten Erweiterungen:

- der offiziellen OCA Application Note "Using ISO 15118 Plug & Charge with OCPP 1.6"
- der weit verbreiteten has-to-be-Erweiterung (v1.4)

Beide nutzen den DataTransfer.req-Mechanismus, um Pendants zu
OCPP-2.0.1-Nachrichten wie SignCertificate.req oder CertificateSigned.req
abzubilden. Das Problem: Diese Erweiterung wurde exklusiv für die ISO 15118-2
geschrieben. Sie erlaubt strukturell nur das Hinterlegen eines einzigen
V2G-Zertifikats.

### OCPP 2.0.1: die Standardisierungs-Sackgasse

OCPP 2.0.1 brachte zwar natives ISO-15118-2-Zertifikatemanagement mit, sperrt
sich jedoch explizit gegen die Zukunft. In den Datentypen (z. B. im
SignCertificateRequest) ist das Feld `certificateType` als Enumeration definiert:

```json
"CertificateSigningUseEnumType": {
  "description": "Indicates the type of certificate that is to be signed. When omitted the certificate is to be used for both the 15118 connection (if implemented) and the Charging Station to CSMS connection.",
  "javaType": "CertificateSigningUseEnum",
  "type": "string",
  "additionalProperties": false,
  "enum": [
    "ChargingStationCertificate",
    "V2GCertificate"
  ]
}
```

Genau hier setzt der neueste Standard (OCPP 2.1) an und erweitert den Enum-Typ um
den neuen Wert `V2G20Certificate`.

In OCPP 2.0.1 bleiben uns nur die beiden gelisteten Enum-Werte. Das 
`"additionalProperties": false` im Ausschnitt verbietet zusätzliche
Properties zwar nur an JSON-Objekten, das Schlüsselwort `enum` sorgt
jedoch dafür, dass ein strikter Validierer nur die dort aufgeführten
Strings akzeptiert.

Den Sender hindert demnach nichts daran, `V2G20Certificate` zu schicken,
doch ein standardkonformes CSMS (oder eine Ladestation), das gegen das
offizielle Schema validiert, weist die Nachricht sehr wahrscheinlich mit
einer `PropertyConstraintViolation` oder `FormatViolation` zurück (das
Erweitern einer Enumeration gefährdet unter Umständen auch die
OCA-Zertifizierung via OCTT).
Es gibt also keinen einheitlichen, standardkonformen Weg, der Gegenseite
mitzuteilen: Das hier ist ein V2G-Zertifikat speziell für die ISO 15118-20.

## Drohender Wildwuchs: das Albtraum-Szenario für CPOs

Wenn die Open Charge Alliance (OCA) jetzt nicht schnell reagiert und eine
einheitliche Application Note herausbringt, wird genau das passieren, was ihr
offener Standard eigentlich verhindern soll:

Hersteller von Ladestationen werden wieder eigene Wege gehen, um die "-20er"
Zertifikate auf die Box zu pushen. Für Charge Point Operators (CPOs) bedeutet das
einen unnötig hohen Integrationsaufwand, wenn sie im Backend für denselben
Usecase (das Bereitstellen eines ISO-15118-20-Zertifikats) verschiedene Dialekte
sprechen müssen.

## Technische Lösungswege für Entwickler

Solange kein offizieller OCA-Leitfaden existiert, stehen uns Firmware-Entwicklern
im Wesentlichen drei Pfade zur Verfügung, um ältere OCPP-Versionen AFIR-konform
aufzubohren.

### Lösung A (OCPP 1.6J): die bestehende DataTransfer-Nachricht erweitern

Da OCPP 1.6J über DataTransfer.req Freitext-JSON erlaubt, können wir die
bestehende OCA/has-to-be-Spezifikation erweitern. Statt einer neuen Nachricht
erweitern wir die Payload von TriggerMessage, SignCertificate bzw.
CertificateSigned um ein optionales Unterscheidungsmerkmal.

```json
[2, "123456", "DataTransfer", {
  "vendorId": "com.example.ocpp",
  "messageId": "SignCertificate",
  "data": "{ \"csr\": \"<certificate signing request>\", \"certificateType\": \"V2G20Certificate\" }"
}]
```

- Vorteil: volle Flexibilität, keine Verletzung des OCPP-1.6J-Schemas.
- Nachteil: eine proprietäre Schnittstelle zwischen Ladestation und CSMS.

### Lösung B (OCPP 2.0.1): die Allzweckwaffe customData

Da OCPP 2.0.1 für sämtliche JSON-Klassen (sprich Nachrichten) ein
kundenspezifisches Erweiterungsobjekt namens `customData` vorsieht, können wir
die bestehenden Nachrichten hiermit um einen "-20"-Indikator erweitern.
`customData` ist vom Typ `CustomDataType`, der (im Gegensatz zu allen anderen
Standarddatentypen) beliebige Erweiterungen erlaubt. Die Spezifikation nennt ihn
sogar ausdrücklich die einzige Klasse in den JSON-Schema-Dateien, die zusätzliche
Properties zulässt.

Wir könnten also TriggerMessageRequest, SignCertificateRequest oder
CertificateSignedRequest um einen entsprechenden Indikator erweitern, ohne dafür
gleich spezielle DataTransferRequest-Nachrichten definieren zu müssen.

```json
[2, "123456", "SignCertificate", {
  "csr": "...",
  "certificateType": "V2GCertificate",
  "customData": {
    "vendorId": "com.example.ocpp",
    "v2gVersion": "20"
  }
}]
```

- Vorteil: volle Flexibilität, keine Verletzung des OCPP-Schemas.
- Nachteil: eine proprietäre Schnittstelle zwischen Ladestation und CSMS.

### Lösung C (OCPP 1.6J / 2.0.1): der Multi-Format-Zertifikate-Container

Das CSMS sendet beide Zertifikatsketten als `V2GCertificate`. Die Ladestation
akzeptiert im Feld `certificateChain` ein kombiniertes PEM-File oder einen
benutzerdefinierten String-Container (z. B. ein base64-kodiertes JSON), der beide
Ketten (ISO 15118-2 und ISO 15118-20) hintereinander enthält. Die Firmware trennt
diese beim Parsen anhand der Krypto-Algorithmen (z. B. ECDSA gegenüber den
neueren Kurven in -20) oder der Root-CNs und speichert sie separat.

- Vorteil: die OCPP-2.0.1-Schema-Validierung läuft fehlerfrei durch.
- Nachteil: erhöhte Komplexität durch das Parsen auf Embedded-Ebene, und es
  widerspricht dem Gedanken sauberer Schnittstellentrennung.

## Fazit: ein Appell an die Open Charge Alliance

Die technischen Workarounds zeigen: Wir können ISO-15118-20-Zertifikate auf
älteren Systemen bereitstellen. Aber jeder dieser Wege schmerzt aus
softwarearchitektonischer Sicht. Sie sind Krücken, um eine regulatorische
Deadline einzuhalten, während die Standardisierung hinterherhinkt.

Um ein Kompatibilitätschaos im Jahr 2027 zu verhindern, ist die Open Charge
Alliance (OCA) dringend gefordert. Es bedarf einer standardisierten
Übergangs-Application-Note für OCPP 1.6J und OCPP 2.0.1, die analog zu den alten
ISO-15118-2-Erweiterungen klare Vorgaben für die ISO 15118-20 macht. Nur so
bleibt Interoperabilität gewahrt und der Integrationsaufwand für CPOs bezahlbar.

Die Spezifikation deutet es selbst an. Sie bezeichnet customData und DataTransfer
als Notausgänge, die man mit äußerster Vorsicht verwenden soll, da sie die
Kompatibilität mit Systemen beeinträchtigen, die sie nicht implementieren, und
sie empfiehlt, vorher die OCA zu konsultieren. Ein Übergang, der innerhalb einer
gemeinsamen Application Note bleibt, ist genau der Weg, um proprietären Wildwuchs
zu vermeiden.
