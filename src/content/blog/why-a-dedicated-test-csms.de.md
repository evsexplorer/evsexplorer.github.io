---
title: "Warum das Testen einer Ladestation ein anderes CSMS braucht als der Betrieb"
date: 2026-08-22
description: "Ein CPO kennt die Ladestationen, die er integriert. Ein Hersteller kennt das CSMS, an dem die Station betrieben wird, nicht. Diese Asymmetrie entscheidet, was ein Test-CSMS können muss."
tags: [ocpp, testing, csms]
---

Viele Teams testen eine Ladestation zunächst gegen ein CSMS, das ohnehin bereits
vorhanden ist. Bspw. eine Entwicklungs- oder Staging-Instanz des Produktiv-Backends,
ein Open-Source CSMS oder das, was das Integrationsteam gerade betreibt. Das funktioniert
eine ganze Weile, stößt jedoch dann an Grenzen, wenn es darum geht, tiefer liegende
Fehler zu finden oder gewisse Testbedingungen herzustellen.

Das liegt nicht daran, dass das Produktiv-CSMS schlecht entworfen wäre. Testen und
Betreiben einer Ladestation sind einfach verschiedene Aufgaben und Backends sind auf
unterschiedliche Anforderungen optimiert.

## Die Asymmetrie, die über das CSMS entscheidet

Die zwei Enden einer OCPP-Verbindung stehen nicht vor demselben Problem.

Ein Ladepunktbetreiber weiß, womit er es zu tun hat bzw. bekommen wird. Er wählt schließlich
die Ladestationen aus, die er integriert oder hat im Vorfeld ein Exemplar für Integrationstests
zur Verfügung. Er kennt auch seine eigene Zertifizierungsstelle, die Zertifikatskette, die
sie ausstellt und er entscheidet, welche(s) Security Profil(e) sein CSMS anbietet. Er kann
sich auf herstellerspezifische Erweiterungen (bspw. spezielle DataTransfer Nachrichten) oder
das angebotene OCPP Device Modell einstellen.

Ein Hersteller von Ladestationen weiß nicht, an welchem CSMS sein Produkt betrieben
wird und kann sich deshalb auf kein bestimmtes Backend vorbereiten. Er muss
Zertifikatsketten von Betreibern akzeptieren, die er vorher nie gesehen hat und er muss
alle drei Security Profiles unterstützen, weil er nicht wissen kann, welches ein
Kunde verlangt. Zugegeben, auch er hat Freiheitsgrade bei der Implementierung, denn die OCPP
Zertifizierungsprofile verlangen bspw. nicht alle definierten Funktionen und auch die Hardware
bestimmt, was umgesetzt werden kann und was nicht. Eine Einschränkung im OCPP-Funktionsumfang
ist für den Hersteller jedoch häufig ein Wettbewerbsnachteil.

Kurzum: Der Betreiber kann den Problemraum oft eingrenzen, der Hersteller muss ihn meist
vollständig abdecken. Die
[Migration einer Station zu einem neuen CSMS](/blog/csms-migration-security-profiles)
ist dieselbe Asymmetrie, nur vom anderen Ende aus betrachtet. Dort muss der Betreiber
des neuen CSMS akzeptieren, welches Security Profil und welche Zertifikatskette die
Station bereits mitbringt. Das ist die Position, in der sich der Hersteller immer
befindet.

Deshalb müssen sich die Werkzeuge je nach Einsatzzweck unterscheiden. Ein CSMS, das einen
Ladepark mit bekannten Stationen betreibt, darf bewusst einen selektiven Funktionsumfang
nutzen. Ein CSMS, das eine Station gegen unbekannte Backends testen soll, darf das nicht.

## Worauf ein Produktiv-CSMS optimiert ist

Ein Produktiv-CSMS ist ein System mit zahlenden Kunden dahinter. Darauf ist es optimiert.

1. Es implementiert die Use Cases, die der Betreiber tatsächlich nutzt und das ist in der Regel
eine Teilmenge von OCPP. Angefangen vom verwendeten Security-Profil, über das konfigurierte
Autorisierungs- und Transaktionsverhalten der Ladestation bis zu Ladeprofilen für Smart Charging.
2. Es blockiert bspw. bewusst die Schnittstellen, welche die laufende Kommunikation stören könnten,
denn ein unerwartetes oder gar falsches Kommando an eine Station, an der gerade ein Fahrzeug lädt, hat
reale Folgen. Einen Verbindungsaufbau einer Ladestation bewusst nicht zu erlauben, widerspricht ebenso
der Intention eines Produktiv-CSMS wie das Herausfordern der Station mit korrumpierten oder falsch
signierten Softwarepaketen.
3. Dauern Softwareanpassungen in der Ladestation lange oder sind gar nicht möglich, werden Workarounds
im Produktiv-CSMS schnell akzeptiert. Wie gesagt, das Kundenerlebnis und die Abrechnung von
Ladevorgängen stehen im Fokus. Ein Produktiv-CSMS sammelt im Laufe der Zeit Toleranz für
stationsspezifisches Verhalten an, das nicht korrekt oder erst gar nicht exakt spezifiziert, aber
bereits im Feld ist. Die Alternative wäre, das Kundenerlebnis beim Laden negativ zu beeinflussen.

Jede dieser Entscheidungen ist für den operativen Betrieb richtig. Sie machen es jedoch zu einem
schlechten Werkzeug, um eine Ladestation zu testen.

Fairerweise muss man auch erwähnen, dass ein Produktiv-CSMS Aufgaben übernimmt, die ein Test-CSMS
vollständig ignorieren kann wie bspw. Roaming über OCPI, Hubject-Anbindungen oder die Bezahlung und
Abrechnung von Ladetransaktionen. Das ist zusätzliche Komplexität, die das Produktiv-CSMS implementiert,
die allerdings ebenfalls nicht zum Testen einer Ladestation beiträgt.

## Was ein Test-CSMS stattdessen leisten muss

Nun drehen wir einmal jeden dieser Punkte um.

**Abdeckung.** Eine Ladestation muss gegen den gesamten Funktionsumfang der Use Cases getestet werden,
die sie unterstützt. Nicht nur gegen die Teilmenge, die ein Betreiber nutzt. Dazu gehören auch Nachrichten,
die ein Produktiv-Backend niemals senden wird, Nachrichten die im Netzwerk verloren gingen oder defekte
Softwarepakete, die erkannt und nicht installiert werden sollen.

**Einblick unterhalb der Nachrichten.** OCPP JSON-Frames zu lesen genügt nicht. Wenn eine Station sich gar
nicht erst verbindet, gibt es keine OCPP-Nachrichten, und der Grund liegt dann häufig ein oder zwei Schichten
tiefer, im TLS-Handshake, im [WebSocket-Upgrade oder im falschen Subprotokoll](/blog/ocpp-websocket-connection).

**Kontrolle.** Das ist der Teil, den ein Produktiv-CSMS bewusst nicht anbietet. Um herauszufinden, wie eine
Station reagiert, müssen Sie sich ihr gegenüber absichtlich falsch verhalten können:
- einen Request mit einem falschen Wert beantworten oder mit einer Payload, die gegen das JSON-Schema verstößt
- gar nicht antworten und den Timeout der Station ablaufen lassen
- eine Antwort so lange verzögern, bis die Station von alleine weitermacht oder die Nachricht erneut sendet
- dieselbe Nachricht zweimal senden
- die Verbindung im ungünstigsten Moment schließen und den Reconnect abweisen

Nichts davon ist in einem Produktiv-CSMS akzeptabel. Alles davon ist auf einem Prüfstand erforderlich.

## Eine Ladestation zu testen ist mehr als OCPP

Alles bisher Beschriebene spielt sich noch innerhalb von OCPP ab. OCPP ist jedoch nur
eine Dimension, bzw. eine Schnittstelle der Ladestationstests (unser Prüfling).

Eine moderne Ladestation ist nicht nur ein OCPP-Client mit angeflanschtem Schütz. Sie hat
einen ISO-15118-Stack zum Fahrzeug, einen RFID-Leser, eine Bluetooth-Schnittstelle
für die Inbetriebnahme bzw. ein lokales Web-UI oder eine lokale API. Häufiger auch EEBus
oder Modbus in Richtung Energiemanagement. Jede Schnittstelle, die in den Prüfling
hineingezogen wird, erhöht die Testoberfläche und damit auch die Komplexität deutlich.

Auch die Hardware gehört in den Test. Sendet die Station bei einem Fehler der
Schutzleiterüberwachung oder Unterspannung auf einer Phase eine OCPP StatusNotification bzw.
SecurityEventNotification? Genau das kann zwar im CSMS geprüft, jedoch nicht mittels OCPP
ausgelöst werden.

Dann kommt die Orchestrierung. Manche Use Cases kollidieren und welcher gewinnt,
hängt manchmal auch von den Fähigkeiten der Hardware und Firmware ab. Kann die Station
bspw. ein Firmware-Update einspielen, während ein Fahrzeug lädt? Wenn nicht, was
macht sie mit dem Request? Verschiebt sie die Bearbeitung hinter das Ladeende oder
lehnt sie ihn ab? Beide Entscheidungen sind vertretbar. Geprüft werden kann die erwartete
Antwort auch hier wieder im CSMS, den Ladevorgang starten kann es jedoch nicht.

Auch andere Testfälle lassen sich über OCPP nicht auslösen:
- Übersteht ein Zertifikats-Update einen Stromausfall während das neue Zertifikat in den
  persistenten Speicher geschrieben wird oder endet dies mit einem Gerät ohne brauchbares
  Zertifikat und somit ohne eine Möglichkeit, ein neues zu erhalten?
- Meldet ein lokaler Neustart, ausgelöst über das Web-UI, eine Bluetooth-App oder einen Taster
  am Gerät, nach dem Hochfahren den korrekten [Boot-Grund](/blog/ocpp-boot-notification)?
- Beendet dieser Neustart einen laufenden Ladevorgang mit dem korrekten Stop-Grund oder
  mit irgendeinem Standardwert?

Der Auslöser für die o.g. Testbedingungen liegt auch hier wieder außerhalb von OCPP. Der
Nachweis kann in allen drei Fällen über OCPP erbracht werden.

## Ein Test-CSMS ist ein Baustein, nicht der ganze Prüfstand

Daraus folgt eine klare Schlussfolgerung. Wenn das Testen einer Ladestation OCPP,
Hardware sowie mehrere weitere Schnittstellen und Trigger umfasst, die ein Mensch durch
Vorhalten eines RFID-Chips, dem Stecken des Ladesteckers oder dem Betätigen eines Buttons
in der Smartphone-App auslöst, dann deckt das kein einzelnes Werkzeug ab. Ein Test-CSMS
bedient dabei lediglich eine Dimension. Der Rest muss durch andere Instanzen gesteuert und
koordiniert werden.

Das beeinflusst auch, wie ein Test-CSMS gebaut sein sollte. Es muss seine Daten
und Ereignisse an die koordinierende Instanz weitergeben, damit ein Prüfstand bspw. ein
OCPP-Ereignis mit einem Netzteil korrelieren kann, das ein anderes Werkzeug Sekunden
vorher abgeschaltet hat. Ein Test-CSMS, das sich nur über seine eigene Oberfläche
bedienen lässt, ist in dieser Architektur eine Sackgasse, so gut diese Oberfläche
auch sein mag.

Die Anforderungsliste ist damit kurz:
- Das ganze Protokoll abdecken statt einer Teilmenge.
- Die Schichten unter den Nachrichten zeigen.
- Absichtliches Fehlverhalten erlauben.
- Von etwas anderem auslesbar sein.

## Wo OCTT einzusortieren ist

Ein Werkzeug muss an dieser Stelle genannt werden, weil es vermeintlich auch
Test-CSMS-Fähigkeiten mitbringt. Die Open Charge Alliance bietet das
[OCPP Compliance Test Tool (OCTT)](https://openchargealliance.org/test-tool/) an.
Es führt die offiziellen Testfälle gegen eine Ladestation aus und tritt dabei
selbst als CSMS auf. Es ist **die** Referenz für Protokollkonformität und ein
offizielles OCPP-Zertifikat wird letztlich auf Basis eines Laufs in einem von
der OCA zugelassenen Testlabor ausgestellt.

Bei der Abdeckung, dem ersten Punkt der obigen Liste, kommt nichts an OCTT
heran. Es implementiert sämtliche normativ geforderten Testfälle, strukturiert
entlang der Zertifizierungsprofile. An ihnen wird die Standardkonformität
gemessen.
Eine herstellerspezifische Erweiterung des Standard-Protokollumfangs (bspw.
DataTransfer Nachrichten oder eine spezifische Controller-Komponente im OCPP
Device-Model) bleibt dem Compliance-Testwerkzeug im besten Fall verborgen und
kann damit nicht abgesichert werden. Im schlechtesten Fall stört eine nicht
erwartete DataTransfer oder NotifyEvent Nachricht die Testauswertung.

Bei der Kontrolle, dem dritten Punkt, beschreibt die OCA den Umfang selbst, auf
der [Seite des Werkzeugs](https://openchargealliance.org/test-tool/): „OCTT is
capable of executing predefined scenarios only. It is not a CS/CSSS or CSMS
simulator.“ Die obige Liste des absichtlichen Fehlverhaltens liegt damit
außerhalb dessen, wofür das Werkzeug gedacht ist. Einen falschen Wert an die
Ladestation senden, eine Antwort, die Sie zurückhalten, oder ein Socket, den Sie
in einem selbst gewählten Moment schließen. Nichts davon ist ein vordefiniertes
Szenario.

Das ist kein Mangel von OCTT. Es folgt aus der Aufgabe, für die das Werkzeug
geschaffen wurde. Ein Konformitätsurteil muss reproduzierbar und zwischen
Herstellern vergleichbar sein. Ein ausgestelltes Zertifikat muss belastbar sein.
Alle drei Punkte verlangen einen festen Satz an Szenarien und ein (nahezu) binäres
Ergebnis. Standardkonform oder nicht, je Testfall. Doch das ist nicht das, was ein
Entwickler wissen muss.

Die Entwicklung einer OCPP-fähigen Ladestation ist eine andere Situation. Erfüllt
die Station die Konformitätsbedingungen nicht, lautet die Frage nicht „bestanden
oder nicht bestanden“, sondern warum die Station sich so verhält, wie sie sich verhält.
Ein Werkzeug, das für ein abschließendes Testat gebaut ist, kann das nicht beantworten
und soll es auch nicht.

Der Unterschied zeigt sich auch darin, wie und wann beide eingesetzt werden. Ein
Konformitätslauf ist ein Ereignis, nahe am Ende des Entwicklungszyklus. Er wird
vorbereitet, gebucht, durchgeführt und berichtet. Ein Entwicklungs-Prüfstand ist
idealerweise im Dauerbetrieb. Mehrere Personen arbeiten täglich, gleichzeitig an
mehreren verbundenen Stationen. Ein Werkzeug, das auf ein System im Test lizenziert
und zugeschnitten ist, passt nicht dazu. Hier braucht es ein CSMS, das ein ganzes
Team nutzen kann, ohne dass jemand auf einen freien Platz wartet und das dort läuft,
wo der Prüfstand steht. Im Zweifel hinter einer Unternehmensfirewall oder in einem
Labor ohne Weg ins Internet.

Ein Punkt aus der [von der OCA veröffentlichten Architekturbeschreibung von
OCTT](https://openchargealliance.org/wp-content/uploads/2024/03/Presentation-OCTT-Update-February-2024.pdf) stützt unsere These aus dem vorigen Abschnitt. Ein einziges OCPP-Testwerkzeug kann nicht alles steuern, was
seine Testfälle brauchen. Es benötigt weitere Interaktionsmöglichkeiten zu etwas,
das einen Stecker stecken, einen RFID-Token vorhalten oder den Zustand des Fahrzeugs
ändern kann. Auch die OCA kommt zum selben Schluss: Die CSMS-Seite ist nur ein Teil
des Prüfstands.

OCTT und ein spezielles Test-CSMS ersetzen sich also nicht. OCTT beantwortet die Frage,
ob eine Implementierung standardkonform ist. Ein Test-CSMS, das Sie selbst steuern,
brauchen Sie für alles davor und für alles, was die vordefinierten Testfälle nicht abdecken.

## Wie das in der Praxis aussieht

In [EVSExplorer](/) kann Fehlverhalten bewusst konfiguriert werden. Automatische
OCPP-Antworten je Request
[beantworten den Request einer Station mit einer Payload, die Sie selbst festlegen, oder lassen ihn unbeantwortet](/#feature-auto-responses). Ein OCPP-Request lässt sich mit abgeschalteter Schema-Validierung
senden, sodass eine Payload, die gegen das OCPP-Schema verstößt, unverändert auf die Leitung
geht. [Den Socket schließen und alles Weitere abweisen](/#feature-websocket-control)
sind zwei API-Aufrufe, die gezielt Fehlerszenarien wie einen CSMS-Ausfall oder
eine falsch konfigurierte Firewall simulieren. Konfigurieren Sie den EVSExplorer OCPP Server
bewusst so, dass er sich ggü. der Station mit unerwarteten Server-Zertifikaten oder einer alten
TLS-Version meldet und prüfen Sie, ob die Station wie erwartet den Verbindungsaufbau ablehnt
und später ein passendes SecurityEvent schickt.

Die Verbindungsereignisse halten fest, was unterhalb der Nachrichten passiert ist:
Welches Security Profile für eine Session ausgehandelt wurde, welche Seite den Socket
geschlossen hat und warum und aus welchem Grund ein Verbindungsversuch abgewiesen wurde.
Sequenznummern von Transaktionsereignissen werden als Lücken sichtbar gemacht, sodass ein
Wechsel des Netzwerk-Interface oder eine Verbindungsunterbrechung, die zum Verlust von
OCPP-Nachrichten führt, einfach erkennbar wird.

Alles, was die Oberfläche kann, gibt es
[auch über die dokumentierte REST-API](/#feature-rest-api), sodass ein Prüfstand, der mehrere
Test-Systeme koordiniert, EVSExplorer automatisiert ansteuern und die aufgezeichneten Nachrichten
und Ereignisse auslesen kann. Damit ist der letzte Punkt der Anforderungsliste erfüllt.

Ein Test-CSMS wie EVSExplorer soll sich bestmöglich in viele Prüfstände integrieren. Es
[bedient viele Ladestationen gleichzeitig](/#feature-ocpp-csms), mehrere
Personen arbeiten parallel damit und es läuft wahlweise in der Cloud oder auf
Ihrer eigenen Hardware im eigenen Netzwerk.

Ein Test-CSMS ist ein Spezialist in Richtung Ladestation (es spricht OCPP 2.0.1)
und dabei offen für darüberliegende Systeme. Die Fahrzeugschnittstelle, die lokale
API und die Hardware brauchen jeweils ihre eigene Instrumentierung.
