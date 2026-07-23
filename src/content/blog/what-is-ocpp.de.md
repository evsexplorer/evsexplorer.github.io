---
title: "Was ist OCPP, und woher bekommt man es?"
date: 2026-05-03
description: "Eine kurze Einführung in das Open Charge Point Protocol: was es leistet, wer es pflegt, wie man die offene Spezifikation bekommt und was jeder der sieben Teile enthält."
tags: [ocpp, introduction]
---

Bevor wir einzelne OCPP Nachrichten lesen, lohnt sich ein Absatz darüber, was OCPP
eigentlich ist, wer dahintersteht und wie Sie an Ihr eigenes Exemplar der
Spezifikation kommen.

## Was OCPP ist

**OCPP** steht für **Open Charge Point Protocol**. Es ist das offene
Anwendungsprotokoll, mit dem eine Ladestation mit einem zentralen Backend
spricht, das in der 2.x-Reihe **CSMS** (Charging Station Management System) und
in älteren Versionen "Central System" heißt.

OCPP standardisiert das Gespräch zwischen beiden Seiten: eine Station meldet
sich an, autorisiert einen Fahrer, startet und stoppt Transaktionen, meldet
Messwerte, nimmt Befehle entgegen, aktualisiert ihre Firmware, hält
Smart-Charging-Grenzen ein und vieles mehr. Weil das Protokoll herstellerneutral
ist, kann ein Backend Ladestationen vieler verschiedener Hersteller betreiben,
und genau darum geht es.

## Wer es pflegt

OCPP wird von der **Open Charge Alliance (OCA)** weiterentwickelt und gepflegt,
einem globalen Industriekonsortium, zu dessen Mitgliedern Hersteller von
Lade-Hardware und -Software, Netzbetreiber und Energieversorger gehören.

Die Spezifikation ist urheberrechtlich geschützt und "Offen" bedeutet, dass sie
frei verfügbar ist und implementierbar werden kann, nicht dass sie gemeinfrei
wäre. Sie dürfen Produkte daraus bauen, die Dokumente aber nicht selbst
weiterverbreiten.

Eine kurze Anmerkung zu den Versionen: Die heute am weitesten verbreiteten
Releases sind **1.6** und **2.0.1**, wobei **2.1** das neueste ist. Ein
praktischer Unterschied, den man kennen sollte: 2.0.1 streicht den älteren
SOAP-Transport, den 1.6 noch anbot und setzt ausschließlich auf JSON über
WebSocket.

## Woher man die Spezifikation bekommt

Sie laden sie bei der Open Charge Alliance unter **openchargealliance.org**
herunter, kostenlos und, zum Zeitpunkt dieses Artikels, ohne Registrierung.
Dort prüfen Sie auch, welche Edition und welche Errata aktuell sind, denn die
Spezifikation wird über die Zeit korrigiert.

## Die sieben Teile

OCPP 2.0.1 ist in sieben Teile gegliedert. Zu wissen, welcher Teil welche Frage
beantwortet, erspart viel Scrollen:

- **Teil 0, Introduction.** Der Überblick, die Terminologie und die Liste
  der Functional Blocks. Fangen Sie hier an, wenn Sie neu sind.
- **Teil 1, Architecture & Topology.** Die Akteure (Charging Station, EVSE,
  Connector, CSMS) und das Device-Model, das eine Station als Baum aus
  Components und Variables beschreibt.
- **Teil 2, Specification.** Das Herzstück. Use Cases und Requirements,
  gruppiert in Functional Blocks (von A Security bis P Data Transfer), dazu jede
  Nachricht, jeder Datentyp und die referenzierten Components und Variables. Ein
  begleitender Teil **Part 2 Appendices** listet die Security Events, die
  standardisierten Maßeinheiten und die standardisierten Components und
  Variables.
- **Teil 3, Schemas.** Die JSON-Schema-Dateien für jede Nachricht, damit Sie
  Payloads gegen die Spezifikation validieren können, statt sie mit dem Auge zu
  prüfen.
- **Teil 4, Implementation Guide JSON.** Das ist OCPP-J: wie die Nachrichten als
  JSON über WebSocket transportiert werden, inklusive des Framings aus Call,
  CallResult und CallError, der Message-IDs und der Reconnect-Regeln.
- **Teil 5, Certification Profiles.** Welche Mengen an Use Cases ein Produkt
  umsetzen muss, um sich OCPP-2.0.1-zertifiziert nennen zu dürfen.
- **Teil 6, Test Cases.** Die Testfälle der OCA mit den erwarteten
  Nachrichtenabläufen, die für Konformitätstests verwendet werden.

Im Prüfstandsalltag bewegen Sie sich meist in Teil 2 (was eine Nachricht
bedeutet), Teil 3 (ist meine Payload gültig) und Teil 4 (wie sie über die
Leitung geht).

## Wie es in dieser Reihe weitergeht

Die nächsten Artikel bauen Schritt für Schritt aufeinander auf:
- [der Protokollstack, auf dem OCPP aufsetzt](/blog/ocpp-protocol-stack)
- [wie eine Ladestation ihre Verbindung zum CSMS aufbaut und hält](/blog/ocpp-websocket-connection)
- und schließlich die einzelnen Anwendungsnachrichten, die darüber laufen,
  sobald sie online ist.
