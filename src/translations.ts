export type Language = "en" | "de";

export const translations = {
  en: {
    // Header
    nav: {
      product: "Product",
      features: "Features",
      api: "REST API",
      ai: "AI",
      contact: "Contact",
    },
    requestDemo: "Request a demo",

    // Hero
    tagline: "OCPP 2.0.1 testing & monitoring for charging station teams",
    heroTitle: "See what your charge point is really saying",
    heroDescription:
      "EVSExplorer is the OCPP 2.0.1 CSMS companion for developing and testing charging stations. Inspect every message, analyze connection stability, fire any request — and automate all of it through a REST API.",
    heroCtaPrimary: "Request a demo",
    heroCtaSecondary: "See it in action",
    heroHighlights: [
      "OCPP 2.0.1 WebSocket server",
      "Validated against the official JSON schemas",
      "Full REST API for automation",
      "AI-agent-ready — skill file included",
      "Runs on your own hardware",
    ],
    heroImageAlt:
      "EVSExplorer dashboard showing seven charge points with live connection and charging status",

    // Personas
    personasTitle: "Built for the whole charging station team",
    personasSubtitle:
      "From the first BootNotification of a new prototype to the release test report — one tool for the bench.",
    personas: [
      {
        title: "Developers",
        description:
          "Follow every frame while you code. Watch your station's OCPP-J traffic live, inspect schema-validated payloads and answer “what did we actually send?” in seconds — no more digging through serial logs.",
      },
      {
        title: "Testers",
        description:
          "Make the flaky stuff reproducible. Close WebSocket connections, block reconnects, auto-respond with custom or deliberately broken payloads — then watch exactly how the station recovers.",
      },
      {
        title: "Project managers",
        description:
          "Know where every prototype stands. A live dashboard across all devices on the bench, uptime figures and transaction histories you can drop straight into a status report.",
      },
    ],

    // Product tour
    tourTitle: "A closer look",
    tourSubtitle:
      "Real screenshots, real bench traffic — this is what your day-to-day with EVSExplorer looks like.",
    tour: [
      {
        kicker: "Message log",
        title: "Every OCPP message, validated and searchable",
        description:
          "Raw OCPP-J traffic in both directions, checked against the official OCPP 2.0.1 JSON schemas. Filter by action, direction or payload content, hide heartbeat noise, and expand any frame to see exactly what went over the wire.",
        bullets: [
          "Request / response / error pairing with anomaly detection — late, duplicate and unmatched responses are flagged",
          "Full-text search inside payloads",
          "Rolling time windows or custom historical ranges",
        ],
        alt: "OCPP message log with an expanded StatusNotification request showing its raw JSON payload",
      },
      {
        kicker: "Connection stability",
        title: "Find flaky connections before your customers do",
        description:
          "Sessions, offline gaps and rejected attempts are derived from raw WebSocket connect and disconnect events — including who closed the connection and why.",
        bullets: [
          "Uptime, connect/disconnect counts and longest offline gap per time window",
          "Close codes and originator: did the station drop, or did the CSMS?",
          "Session timeline down to the second",
        ],
        alt: "Connection stability view with uptime statistics and a timeline of sessions and offline gaps",
      },
      {
        kicker: "Transactions",
        title: "From the first TransactionEvent to the last meter value",
        description:
          "Charging sessions with a full event timeline and charts for every reported measurand — power, energy, state of charge, voltage, current, per phase where available.",
        bullets: [
          "Sequence numbers made visible — gaps reveal lost events",
          "Offline-recorded meter values are flagged",
          "Stop reasons, ID tokens and remote/local context per transaction",
        ],
        alt: "Transaction detail with an 11 kW charging power curve over almost four hours",
      },
      {
        kicker: "Command console",
        title: "Send any request — even the broken ones",
        description:
          "Fire every CSMS-initiated OCPP 2.0.1 action with an editable payload template. Schema violations are allowed on purpose: negative testing is a feature, not an error.",
        bullets: [
          "Payload templates for all OCPP 2.0.1 actions",
          "%UTC_TIMESTAMP% placeholder resolved at send time",
          "Responses tracked until they complete, fail or time out",
        ],
        alt: "Command console prepared to send a TriggerMessage request to a charge point",
      },
    ],

    // Features
    featuresTitle: "Everything you need for OCPP 2.0.1 work",
    featuresSubtitle:
      "No mock data, no magic — every feature works on the real traffic of your charging stations.",
    features: [
      {
        title: "OCPP 2.0.1 CSMS",
        description:
          "A WebSocket server speaking OCPP-J 2.0.1, handling many charge points concurrently — with optional HTTP Basic Auth per station.",
      },
      {
        title: "Schema validation",
        description:
          "Every incoming and outgoing message is validated against the official OCPP 2.0.1 JSON schemas — compliance issues surface immediately.",
      },
      {
        title: "Live dashboard",
        description:
          "All registered charge points with connection state, charging state, firmware and vendor info, refreshed automatically.",
      },
      {
        title: "Auto-responses",
        description:
          "Answer station-initiated requests automatically: custom payloads per action, standard CallErrors, or full manual control.",
      },
      {
        title: "Connection analytics",
        description:
          "Uptime, sessions, offline gaps, close codes and rejected connection attempts — derived from every single WebSocket event.",
      },
      {
        title: "WebSocket control",
        description:
          "Close a station's connection or block reconnects for a defined period to test offline behavior and recovery.",
      },
      {
        title: "Transactions & meter values",
        description:
          "Event timelines with lost-event detection and per-measurand charts for detailed meter value analysis.",
      },
      {
        title: "Security events",
        description:
          "Security notifications and certificate-related traffic of each charge point in one place.",
      },
      {
        title: "Device model browser",
        description:
          "Request a base report and browse the reconstructed EVSE / component / variable tree of the station.",
      },
      {
        title: "Command console",
        description:
          "Every CSMS-initiated action with editable payloads — including intentionally invalid ones for negative tests.",
      },
      {
        title: "Message history",
        description:
          "Browse, filter and search all OCPP traffic in rolling or custom time windows.",
      },
      {
        title: "REST API",
        description:
          "Everything the UI does is available as a documented REST API — the foundation for scripted and CI-driven testing.",
      },
    ],

    // API section
    apiTitle: "Automate it all through the REST API",
    apiSubtitle:
      "The UI is just one client. Register stations, send commands, read logs and assert on results from your test scripts or CI pipeline — the OpenAPI specification documents every endpoint.",
    apiBullets: [
      "Send any OCPP action and poll its result — 202, then completed, failed or timed out",
      "Query message logs, connection events, transactions and meter values with time filters",
      "Configure auto-responses and connection blocking on the fly",
    ],
    apiFootnote:
      "Also runs on your own hardware — a Raspberry Pi is enough. Your OCPP traffic never leaves the lab.",

    // AI section
    aiKicker: "AI-ready",
    aiTitle: "Let your AI agent drive the test bench",
    aiSubtitle:
      "The REST API is designed for efficient use by LLM-based agents, and EVSExplorer ships with a skill file that teaches your AI assistant the domain model, the interaction patterns and the common workflows — so it can operate the bench for you.",
    aiBullets: [
      "Self-teaching: the instance serves its skill file at /api/skill.md — point Claude Code or any agentic tool at it and the agent learns the domain model and workflows on the spot",
      "Token-efficient by design: server-side limits, time-range filters, action exclusion and sparse field selection keep responses small enough for an LLM context window",
      "Machine-readable error codes and an asynchronous command pattern that agents can poll deterministically",
      "The OpenAPI spec is served by the instance too, so agents can discover every endpoint at runtime",
    ],
    aiTranscriptCaption:
      "From a real agent session (Claude CLI) against a bench instance — recreated with the demo identities.",

    // Contact
    contactTitle: "Put EVSExplorer on your bench",
    contactSubtitle:
      "Tell us about your setup and testing requirements — we'll show you EVSExplorer live and get you started within days.",
    contactCardTitle: "Contact us",
    contactCardText:
      "Get in touch to discuss your OCPP testing requirements and discover how EVSExplorer fits your workflow.",
    contactButton: "Contact us",
    contactEmail: "hello@evsexplorer.com",
    mailSubject: "EVSExplorer demo request",
    contactPoints: [
      {
        title: "Expert support",
        description: "Technical guidance from OCPP specialists",
      },
      {
        title: "Quick setup",
        description: "Start testing your charge points within hours",
      },
      {
        title: "Custom solutions",
        description: "Tailored implementations for your specific needs",
      },
    ],

    // Footer
    footerClaim: "Professional OCPP 2.0.1 testing & monitoring",
    copyright: "© 2026 EVSExplorer. All rights reserved.",
  },

  de: {
    nav: {
      product: "Produkt",
      features: "Funktionen",
      api: "REST-API",
      ai: "KI",
      contact: "Kontakt",
    },
    requestDemo: "Demo anfragen",

    tagline: "OCPP-2.0.1-Testing & -Monitoring für Ladestations-Teams",
    heroTitle: "Sehen Sie, was Ihre Ladestation wirklich sendet",
    heroDescription:
      "EVSExplorer ist der OCPP-2.0.1-CSMS-Begleiter für Entwicklung und Test von Ladestationen. Untersuchen Sie jede Nachricht, analysieren Sie die Verbindungsstabilität, senden Sie beliebige Requests — und automatisieren Sie alles über die REST-API.",
    heroCtaPrimary: "Demo anfragen",
    heroCtaSecondary: "Produkt ansehen",
    heroHighlights: [
      "OCPP-2.0.1-WebSocket-Server",
      "Validierung gegen die offiziellen JSON-Schemata",
      "Vollständige REST-API zur Automatisierung",
      "Bereit für KI-Agenten — Skill-Datei inklusive",
      "Läuft auf Ihrer eigenen Hardware",
    ],
    heroImageAlt:
      "EVSExplorer-Dashboard mit sieben Ladepunkten samt Verbindungs- und Ladestatus",

    personasTitle: "Für das ganze Ladestations-Team",
    personasSubtitle:
      "Von der ersten BootNotification eines neuen Prototyps bis zum Release-Testbericht — ein Werkzeug für den Prüfstand.",
    personas: [
      {
        title: "Entwickler",
        description:
          "Jede Nachricht live verfolgen, während Sie entwickeln. Beobachten Sie den OCPP-J-Verkehr Ihrer Station in Echtzeit, prüfen Sie schema-validierte Payloads und beantworten Sie „Was haben wir eigentlich gesendet?“ in Sekunden — ohne serielle Logs zu durchsuchen.",
      },
      {
        title: "Tester",
        description:
          "Machen Sie Wackelkandidaten reproduzierbar. Schließen Sie WebSocket-Verbindungen, blockieren Sie Reconnects, antworten Sie automatisch mit eigenen oder absichtlich fehlerhaften Payloads — und beobachten Sie genau, wie sich die Station erholt.",
      },
      {
        title: "Projektleiter",
        description:
          "Wissen, wo jeder Prototyp steht. Ein Live-Dashboard über alle Geräte auf dem Prüfstand, Uptime-Zahlen und Ladehistorien, die Sie direkt in den Statusbericht übernehmen können.",
      },
    ],

    tourTitle: "Ein genauerer Blick",
    tourSubtitle:
      "Echte Screenshots, echter Prüfstands-Verkehr — so sieht der Alltag mit EVSExplorer aus.",
    tour: [
      {
        kicker: "Nachrichten-Log",
        title: "Jede OCPP-Nachricht, validiert und durchsuchbar",
        description:
          "Roher OCPP-J-Verkehr in beide Richtungen, geprüft gegen die offiziellen OCPP-2.0.1-JSON-Schemata. Filtern Sie nach Aktion, Richtung oder Payload-Inhalt, blenden Sie Heartbeats aus und öffnen Sie jede Nachricht, um zu sehen, was tatsächlich übertragen wurde.",
        bullets: [
          "Request-/Response-/Error-Zuordnung mit Anomalie-Erkennung — verspätete, doppelte und unzuordenbare Antworten werden markiert",
          "Volltextsuche in Payloads",
          "Rollierende Zeitfenster oder historische Zeiträume",
        ],
        alt: "OCPP-Nachrichten-Log mit geöffnetem StatusNotification-Request samt JSON-Payload",
      },
      {
        kicker: "Verbindungsstabilität",
        title: "Finden Sie instabile Verbindungen vor Ihren Kunden",
        description:
          "Sitzungen, Offline-Lücken und abgewiesene Verbindungsversuche werden aus den rohen WebSocket-Ereignissen abgeleitet — inklusive der Frage, wer die Verbindung beendet hat und warum.",
        bullets: [
          "Uptime, Verbindungszähler und längste Offline-Lücke je Zeitfenster",
          "Close-Codes und Verursacher: Hat die Station getrennt oder das CSMS?",
          "Sitzungsverlauf sekundengenau",
        ],
        alt: "Verbindungsstabilität mit Uptime-Statistik und Zeitleiste aus Sitzungen und Offline-Lücken",
      },
      {
        kicker: "Ladevorgänge",
        title: "Vom ersten TransactionEvent bis zum letzten Messwert",
        description:
          "Ladevorgänge mit vollständiger Ereignis-Zeitleiste und Diagrammen für jeden gemeldeten Messwert — Leistung, Energie, Ladezustand, Spannung, Strom, je Phase, sofern verfügbar.",
        bullets: [
          "Sequenznummern sichtbar gemacht — Lücken zeigen verlorene Ereignisse",
          "Offline aufgezeichnete Messwerte werden gekennzeichnet",
          "Stop-Grund, ID-Token und Remote-/Lokal-Kontext je Ladevorgang",
        ],
        alt: "Ladevorgang-Detailansicht mit 11-kW-Ladekurve über fast vier Stunden",
      },
      {
        kicker: "Kommando-Konsole",
        title: "Senden Sie jeden Request — auch absichtlich kaputte",
        description:
          "Senden Sie jede CSMS-initiierte OCPP-2.0.1-Aktion mit editierbarer Payload-Vorlage. Schema-Verletzungen sind ausdrücklich erlaubt: Negativtests sind ein Feature, kein Fehler.",
        bullets: [
          "Payload-Vorlagen für alle OCPP-2.0.1-Aktionen",
          "%UTC_TIMESTAMP%-Platzhalter wird beim Senden aufgelöst",
          "Antworten werden verfolgt, bis sie abgeschlossen sind, fehlschlagen oder das Timeout greift",
        ],
        alt: "Kommando-Konsole mit vorbereitetem TriggerMessage-Request an eine Ladestation",
      },
    ],

    featuresTitle: "Alles, was Sie für OCPP 2.0.1 brauchen",
    featuresSubtitle:
      "Keine Mock-Daten, keine Magie — jede Funktion arbeitet auf dem echten Verkehr Ihrer Ladestationen.",
    features: [
      {
        title: "OCPP-2.0.1-CSMS",
        description:
          "Ein WebSocket-Server für OCPP-J 2.0.1 mit vielen Ladepunkten gleichzeitig — optional mit HTTP Basic Auth je Station.",
      },
      {
        title: "Schema-Validierung",
        description:
          "Jede ein- und ausgehende Nachricht wird gegen die offiziellen OCPP-2.0.1-JSON-Schemata geprüft — Compliance-Probleme fallen sofort auf.",
      },
      {
        title: "Live-Dashboard",
        description:
          "Alle registrierten Ladepunkte mit Verbindungs- und Ladestatus, Firmware- und Herstellerinfo, automatisch aktualisiert.",
      },
      {
        title: "Automatische Antworten",
        description:
          "Beantworten Sie stationsseitige Requests automatisch: eigene Payloads je Aktion, Standard-CallErrors oder volle manuelle Kontrolle.",
      },
      {
        title: "Verbindungsanalyse",
        description:
          "Uptime, Sitzungen, Offline-Lücken, Close-Codes und abgewiesene Verbindungsversuche — abgeleitet aus jedem einzelnen WebSocket-Ereignis.",
      },
      {
        title: "WebSocket-Kontrolle",
        description:
          "Trennen Sie die Verbindung einer Station oder blockieren Sie Reconnects für definierte Zeiträume, um Offline-Verhalten zu testen.",
      },
      {
        title: "Ladevorgänge & Messwerte",
        description:
          "Ereignis-Zeitleisten mit Erkennung verlorener Ereignisse und Diagramme je Messgröße für die detaillierte Analyse.",
      },
      {
        title: "Security-Ereignisse",
        description:
          "Sicherheitsmeldungen und zertifikatsbezogener Verkehr jeder Ladestation an einem Ort.",
      },
      {
        title: "Device-Model-Browser",
        description:
          "Fordern Sie einen Base Report an und navigieren Sie durch den EVSE-/Komponenten-/Variablen-Baum der Station.",
      },
      {
        title: "Kommando-Konsole",
        description:
          "Jede CSMS-initiierte Aktion mit editierbaren Payloads — auch absichtlich ungültige für Negativtests.",
      },
      {
        title: "Nachrichten-Historie",
        description:
          "Durchsuchen und filtern Sie den gesamten OCPP-Verkehr in rollierenden oder historischen Zeitfenstern.",
      },
      {
        title: "REST-API",
        description:
          "Alles, was die Oberfläche kann, gibt es als dokumentierte REST-API — die Basis für skriptgesteuerte Tests und CI.",
      },
    ],

    apiTitle: "Automatisieren Sie alles über die REST-API",
    apiSubtitle:
      "Die Oberfläche ist nur ein Client. Registrieren Sie Stationen, senden Sie Kommandos, lesen Sie Logs und prüfen Sie Ergebnisse aus Ihren Testskripten oder der CI-Pipeline — die OpenAPI-Spezifikation dokumentiert jeden Endpunkt.",
    apiBullets: [
      "Beliebige OCPP-Aktionen senden und das Ergebnis abfragen — 202, dann completed, failed oder timed out",
      "Nachrichten-Logs, Verbindungsereignisse, Ladevorgänge und Messwerte mit Zeitfiltern abfragen",
      "Automatische Antworten und Verbindungsblockaden zur Laufzeit konfigurieren",
    ],
    apiFootnote:
      "Läuft auch auf Ihrer eigenen Hardware — ein Raspberry Pi genügt. Ihr OCPP-Verkehr verlässt das Labor nicht.",

    aiKicker: "Bereit für KI",
    aiTitle: "Lassen Sie Ihren KI-Agenten den Prüfstand bedienen",
    aiSubtitle:
      "Die REST-API ist auf die effiziente Nutzung durch LLM-basierte Agenten ausgelegt, und EVSExplorer liefert eine Skill-Datei mit, die Ihrem KI-Assistenten das Domänenmodell, die Interaktionsmuster und die typischen Arbeitsabläufe beibringt — damit er den Prüfstand für Sie bedient.",
    aiBullets: [
      "Selbsterklärend: die Instanz liefert ihre Skill-Datei unter /api/skill.md aus — verweisen Sie Claude Code oder ein anderes agentisches Tool darauf und der Agent lernt Domänenmodell und Workflows an Ort und Stelle",
      "Token-effizient von Haus aus: serverseitige Limits, Zeitfilter, Aktions-Ausschluss und schlanke Feldauswahl halten Antworten klein genug für ein LLM-Kontextfenster",
      "Maschinenlesbare Fehlercodes und ein asynchrones Kommando-Muster, das Agenten deterministisch abfragen können",
      "Auch die OpenAPI-Spezifikation wird von der Instanz ausgeliefert, sodass Agenten jeden Endpunkt zur Laufzeit entdecken können",
    ],
    aiTranscriptCaption:
      "Aus einer echten Agenten-Session (Claude CLI) gegen eine Prüfstand-Instanz — nachgestellt mit den Demo-Identitäten.",

    contactTitle: "Holen Sie EVSExplorer auf Ihren Prüfstand",
    contactSubtitle:
      "Erzählen Sie uns von Ihrem Setup und Ihren Testanforderungen — wir zeigen Ihnen EVSExplorer live und bringen Sie innerhalb weniger Tage an den Start.",
    contactCardTitle: "Kontaktieren Sie uns",
    contactCardText:
      "Sprechen Sie mit uns über Ihre OCPP-Testanforderungen und erfahren Sie, wie EVSExplorer in Ihren Workflow passt.",
    contactButton: "Kontakt aufnehmen",
    contactEmail: "hello@evsexplorer.com",
    mailSubject: "EVSExplorer Demo-Anfrage",
    contactPoints: [
      {
        title: "Expertenunterstützung",
        description: "Technische Beratung von OCPP-Spezialisten",
      },
      {
        title: "Schnelle Einrichtung",
        description: "Testen Sie Ihre Ladepunkte innerhalb weniger Stunden",
      },
      {
        title: "Individuelle Lösungen",
        description: "Maßgeschneiderte Implementierungen für Ihre Anforderungen",
      },
    ],

    footerClaim: "Professionelles OCPP-2.0.1-Testing & -Monitoring",
    copyright: "© 2026 EVSExplorer. Alle Rechte vorbehalten.",
  },
};

export type Translation = (typeof translations)["en"];
