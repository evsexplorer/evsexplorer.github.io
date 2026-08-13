export type Language = "en" | "de";

export const translations = {
  en: {
    // Header
    nav: {
      product: "Product",
      features: "Features",
      api: "REST API",
      ai: "AI",
      articles: "Articles",
      contact: "Contact",
    },
    requestDemo: "Request a demo",

    // Hero
    tagline: "OCPP 2.0.1 test CSMS for charge point and wallbox developers",
    heroTitle: "See what your charge point is really saying",
    heroDescription:
      "EVSExplorer is an OCPP 2.0.1 test CSMS for charge point and wallbox development. Point a real station at it, inspect every message against the official schemas, analyze connection stability, fire any request and automate all of it through a REST API. Run it in our cloud or on your own hardware.",
    heroCtaPrimary: "Request a demo",
    heroCtaSecondary: "See it in action",
    heroHighlights: [
      "Cloud or self-hosted: your choice, same product",
      "OCPP 2.0.1 WebSocket server for real charge points",
      "Every message validated against the official JSON schemas",
      "Full REST API for CI and scripted tests",
      "AI agent ready (skill file included)",
    ],
    heroImageAlt:
      "EVSExplorer dashboard showing seven charge points with live connection and charging status",

    // Personas
    personasTitle: "Built for the whole charging station team",
    personasSubtitle:
      "From the first BootNotification of a new prototype to the release test report. One tool for the bench.",
    personas: [
      {
        title: "Developers",
        description:
          "Follow every frame while you code. Watch your station's OCPP-J traffic live, inspect schema-validated payloads and answer “what did we actually send?” in seconds. No more digging through serial logs.",
      },
      {
        title: "Testers",
        description:
          "Make the flaky stuff reproducible. Close WebSocket connections, block reconnects, auto-respond with custom or deliberately broken payloads, then watch exactly how the station recovers.",
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
      "Real screenshots, real bench traffic. This is what your day-to-day with EVSExplorer looks like.",
    tour: [
      {
        kicker: "Message log",
        title: "Every OCPP message, validated and searchable",
        description:
          "Raw OCPP-J traffic in both directions, checked against the official OCPP 2.0.1 JSON schemas. Filter by action, direction or payload content, hide heartbeat noise, and expand any frame to see exactly what went over the wire.",
        bullets: [
          "Request / response / error pairing with anomaly detection (late, duplicate and unmatched responses are flagged)",
          "Full-text search inside payloads",
          "Rolling time windows or custom historical ranges",
        ],
        alt: "OCPP message log with an expanded StatusNotification request showing its raw JSON payload",
      },
      {
        kicker: "Connection stability",
        title: "Find flaky connections before your customers do",
        description:
          "Sessions, offline gaps and rejected attempts are derived from raw WebSocket connect and disconnect events, including who closed the connection and why.",
        bullets: [
          "Uptime, connect/disconnect counts and longest offline gap per time window",
          "Close codes and originator: did the station close the socket, or did the CSMS?",
          "Session timeline down to the second",
        ],
        alt: "Connection stability view with uptime statistics and a timeline of sessions and offline gaps",
      },
      {
        kicker: "Transactions",
        title: "From the first TransactionEvent to the last meter value",
        description:
          "Charging sessions with a full event timeline and charts for every reported measurand (power, energy, state of charge, voltage, current, per phase where available).",
        bullets: [
          "Sequence numbers made visible (gaps reveal lost events)",
          "Offline-recorded meter values are flagged",
          "Stop reasons, ID tokens and remote/local context per transaction",
        ],
        alt: "Transaction detail with an 11 kW charging power curve over almost four hours",
      },
      {
        kicker: "Command console",
        title: "Send any request, even the broken ones",
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
      "No mock data, no magic. Every feature works on the real traffic of your charging stations.",
    features: [
      {
        title: "OCPP 2.0.1 CSMS",
        description:
          "A WebSocket server speaking OCPP-J 2.0.1, handling many charge points concurrently, with optional HTTP Basic Auth per station.",
      },
      {
        title: "Schema validation",
        description:
          "Every incoming and outgoing message is validated against the official OCPP 2.0.1 JSON schemas, so compliance issues surface immediately.",
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
          "Uptime, sessions, offline gaps, close codes and rejected connection attempts, derived from every single WebSocket event.",
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
          "Every CSMS-initiated action with editable payloads, including intentionally invalid ones for negative tests.",
      },
      {
        title: "Message history",
        description:
          "Browse, filter and search all OCPP traffic in rolling or custom time windows.",
      },
      {
        title: "REST API",
        description:
          "Everything the UI does is available as a documented REST API, the foundation for scripted and CI-driven testing.",
      },
    ],

    // API section
    apiTitle: "Automate it all through the REST API",
    apiSubtitle:
      "The UI is just one client. Register stations, send commands, read logs and assert on results from your test scripts or CI pipeline. The OpenAPI specification documents every endpoint.",
    apiBullets: [
      "Send any OCPP action and poll its result (202, then completed, failed or timed out)",
      "Query message logs, connection events, transactions and meter values with time filters",
      "Configure auto-responses and connection blocking on the fly",
    ],
    apiFootnote:
      "Also runs on your own hardware (a Raspberry Pi is enough). Your OCPP traffic never leaves the lab.",

    // AI section
    aiKicker: "AI-ready",
    aiTitle: "Let your AI agent drive the test bench",
    aiSubtitle:
      "The REST API is designed for efficient use by LLM-based agents, and EVSExplorer ships with a skill file that teaches your AI assistant the domain model, the interaction patterns and the common workflows, so it can operate the bench for you.",
    aiBullets: [
      "Self-teaching: the instance serves its skill file at /api/skill.md. Point Claude Code or any agentic tool at it and the agent learns the domain model and workflows on the spot",
      "Token-efficient by design: server-side limits, time-range filters, action exclusion and sparse field selection keep responses small enough for models with a limited context window",
      "Machine-readable error codes and an asynchronous command pattern that agents can poll deterministically",
      "The OpenAPI spec is served by the instance too, so agents can discover every endpoint at runtime",
    ],
    aiTranscriptCaption:
      "From a real agent session (Claude CLI) against a bench instance.",

    // Contact
    contactTitle: "Put EVSExplorer on your bench",
    contactSubtitle:
      "Tell us about your setup and testing requirements. We'll show you EVSExplorer live and get you started within days.",
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

    // Blog / articles
    blog: {
      navLabel: "Articles",
      title: "Technical articles",
      subtitle: "Deep dives on OCPP 2.0.1 (messages, transport and the bench).",
      readArticle: "Read article",
      updatedLabel: "Updated",
      publishedLabel: "Published",
      backToList: "All articles",
      empty: "No articles yet, check back soon.",
      notFoundTitle: "Article not found",
      notFoundText: "This article does not exist or has been moved.",
      translationNote: "Also available in",
    },

    // Footer
    footerClaim: "OCPP 2.0.1 test CSMS, cloud or self-hosted",
    copyright: "© 2026 EVSExplorer. All rights reserved.",

    // Impressum (legal notice)
    impressumLink: "Legal notice",
    impressum: {
      title: "Legal notice",
      subtitle: "Information pursuant to § 5 DDG",
      providerHeading: "Provider",
      contactHeading: "Contact",
      emailLabel: "Email",
      phoneLabel: "Phone",
      vatHeading: "VAT identification number",
      vatText:
        "VAT identification number pursuant to § 27a of the German VAT Act (UStG):",
      registerHeading: "Register entry",
      registerCourtLabel: "Registering court",
      registerNumberLabel: "Register number",
      responsibleHeading: "Responsible for the content pursuant to § 18 (2) MStV",
      disputeHeading: "Consumer dispute resolution",
      disputeText:
        "We are neither obliged nor willing to participate in dispute resolution proceedings before a consumer arbitration board.",
      backToHome: "Back to home",
    },

    // Privacy policy
    datenschutzLink: "Privacy",
    datenschutz: {
      title: "Privacy policy",
      subtitle: "How personal data is processed on this website",
      updated: "Last updated: July 2026",

      introHeading: "Overview",
      introText:
        "This privacy policy explains which personal data is processed when you visit this website. The site works entirely without cookies, without tracking and without analytics or advertising services. In essence, only the technically necessary access data that arises when the pages are delivered is processed.",

      controllerHeading: "Controller",
      controllerIntro:
        "The controller responsible for data processing on this website is:",

      hostingHeading: "Hosting (GitHub Pages)",
      hostingText:
        "This website is hosted by GitHub, Inc. and delivered through their GitHub Pages service. When you access the website, GitHub, acting as our host, processes technical access data. This includes in particular your IP address, which counts as personal data and is required so that the requested pages can be delivered to your device.",
      hostingPurpose:
        "As the operator of the website we have no direct access to this data ourselves and cannot state in detail which data GitHub stores or for how long. For those details please refer to GitHub's privacy statement (linked below). The processing serves the delivery, stability and security of the website.",
      hostingLegalBasis:
        "The legal basis is Art. 6 (1) (f) GDPR. Our legitimate interest lies in the reliable and secure presentation of the website.",
      hostingTransfer:
        "GitHub is a company based in the USA. Your data may therefore be processed in the United States. GitHub is certified under the EU-US Data Privacy Framework, which ensures an adequate level of data protection within the meaning of Art. 45 GDPR.",
      hostingProviderLabel: "Host:",
      hostingProvider: [
        "GitHub, Inc.",
        "88 Colin P. Kelly Jr. Street",
        "San Francisco, CA 94107",
        "USA",
      ],
      hostingPrivacyLinkLabel: "GitHub privacy statement",
      hostingPrivacyLinkUrl:
        "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement",

      tlsHeading: "Encryption (TLS)",
      tlsText:
        "The website is delivered exclusively over an encrypted HTTPS (TLS) connection. This protects the data transferred between your browser and the server from being read by third parties.",

      contactHeading: "Contact by email",
      contactText:
        "If you contact us by email (hello@evsexplorer.com), we process the details you provide (your email address and the content of your message) in order to handle your request. The legal basis is Art. 6 (1) (b) GDPR where your request relates to entering into or performing a contract, otherwise Art. 6 (1) (f) GDPR (interest in dealing with your request). This data is not passed on to third parties without your explicit consent. We delete this data once it is no longer needed for that purpose and no statutory retention obligations apply.",

      noTrackingHeading: "No cookies, no tracking",
      noTrackingText:
        "This website sets no cookies and uses no analytics or tracking services, no advertising and no social media plugins. It also loads no external resources (such as fonts or scripts) from third-party servers. For this reason no consent under Section 25 TDDDG (the German Telecommunications and Digital Services Data Protection Act) is required and no cookie banner is shown.",

      rightsHeading: "Your rights",
      rightsIntro:
        "With regard to your personal data you have the following rights:",
      rightsItems: [
        "Right of access (Art. 15 GDPR)",
        "Right to rectification (Art. 16 GDPR)",
        "Right to erasure (Art. 17 GDPR)",
        "Right to restriction of processing (Art. 18 GDPR)",
        "Right to data portability (Art. 20 GDPR)",
        "Right to object to processing (Art. 21 GDPR)",
      ],
      rightsOutro:
        "To exercise any of these rights, an informal message to the contact details above is sufficient.",

      complaintHeading: "Right to lodge a complaint",
      complaintText:
        "You have the right to lodge a complaint with a data protection supervisory authority, in particular in the member state of your residence or the place of the alleged infringement. The authority responsible for us is:",
      complaintAuthority: [
        "Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg",
        "Lautenschlagerstraße 20",
        "70173 Stuttgart",
        "Germany",
      ],
      complaintLinkLabel: "baden-wuerttemberg.datenschutz.de",
      complaintLinkUrl: "https://www.baden-wuerttemberg.datenschutz.de",

      backToHome: "Back to home",
    },
  },

  de: {
    nav: {
      product: "Produkt",
      features: "Funktionen",
      api: "REST-API",
      ai: "KI",
      articles: "Artikel",
      contact: "Kontakt",
    },
    requestDemo: "Demo anfragen",

    tagline: "OCPP-2.0.1-Testtool für Ladestations- und Wallbox-Entwickler",
    heroTitle: "Sehen Sie, was Ihre Ladestation wirklich sendet",
    heroDescription:
      "EVSExplorer ist ein OCPP-2.0.1-Test-CSMS für die Entwicklung von Ladestationen und Wallboxen. Verbinden Sie eine echte Station, prüfen Sie jede Nachricht gegen die offiziellen Schemata, analysieren Sie die Verbindungsstabilität, senden Sie beliebige Requests und automatisieren Sie alles über die REST-API. In unserer Cloud oder auf Ihrer eigenen Hardware.",
    heroCtaPrimary: "Demo anfragen",
    heroCtaSecondary: "Produkt ansehen",
    heroHighlights: [
      "Cloud oder eigene Hardware: Ihre Wahl, gleiches Produkt",
      "OCPP-2.0.1-WebSocket-Server für echte Ladestationen",
      "Jede Nachricht gegen die offiziellen JSON-Schemata validiert",
      "Vollständige REST-API für CI und Testskripte",
      "Bereit für KI-Agenten (Skill-Datei inklusive)",
    ],
    heroImageAlt:
      "EVSExplorer-Dashboard mit sieben Ladepunkten samt Verbindungs- und Ladestatus",

    personasTitle: "Für das ganze Ladestations-Team",
    personasSubtitle:
      "Von der ersten BootNotification eines neuen Prototyps bis zum Release-Testbericht. Ein Werkzeug für den Prüfstand.",
    personas: [
      {
        title: "Entwickler",
        description:
          "Jede Nachricht live verfolgen, während Sie entwickeln. Beobachten Sie die OCPP-J-Nachrichten Ihrer Station in Echtzeit, prüfen Sie schema-validierte Payloads und beantworten Sie „Was haben wir eigentlich gesendet?“ in Sekunden, ohne serielle Logs zu durchsuchen.",
      },
      {
        title: "Tester",
        description:
          "Machen Sie Wackelkandidaten reproduzierbar. Schließen Sie WebSocket-Verbindungen, blockieren Sie Reconnects, antworten Sie automatisch mit eigenen oder absichtlich fehlerhaften Payloads und beobachten Sie genau, wie sich die Station erholt.",
      },
      {
        title: "Projektleiter",
        description:
          "Wissen, wo jeder Prototyp steht. Ein Live-Dashboard über alle Geräte auf dem Prüfstand, Uptime-Zahlen und Ladehistorien, die Sie direkt in den Statusbericht übernehmen können.",
      },
    ],

    tourTitle: "Ein genauerer Blick",
    tourSubtitle:
      "Echte Screenshots, echte Datenflüsse! So sieht der Alltag mit EVSExplorer aus.",
    tour: [
      {
        kicker: "Nachrichten-Log",
        title: "Jede OCPP-Nachricht, validiert und durchsuchbar",
        description:
          "Rohe OCPP-J-Nachrichten in beide Richtungen, geprüft gegen die offiziellen OCPP-2.0.1-JSON-Schemata. Filtern Sie nach Aktion, Richtung oder Payload-Inhalt, blenden Sie Heartbeats aus und öffnen Sie jede Nachricht, um zu sehen, was tatsächlich übertragen wurde.",
        bullets: [
          "Request-/Response-/Error-Zuordnung mit Anomalie-Erkennung (verspätete, doppelte und unzuordenbare Antworten werden markiert)",
          "Volltextsuche in Payloads",
          "Rollierende Zeitfenster oder historische Zeiträume",
        ],
        alt: "OCPP-Nachrichten-Log mit geöffnetem StatusNotification-Request samt JSON-Payload",
      },
      {
        kicker: "Verbindungsstabilität",
        title: "Finden Sie instabile Verbindungen vor Ihren Kunden",
        description:
          "Sitzungen, Offline-Lücken und abgewiesene Verbindungsversuche werden aus den rohen WebSocket-Ereignissen abgeleitet, inklusive der Frage, wer die Verbindung beendet hat und warum.",
        bullets: [
          "Uptime, Verbindungszähler und längste Offline-Lücke je Zeitfenster",
          "Close-Codes und Verursacher: Hat die Station den Socket geschlossen oder das CSMS?",
          "Sitzungsverlauf sekundengenau",
        ],
        alt: "Verbindungsstabilität mit Uptime-Statistik und Zeitleiste aus Sitzungen und Offline-Lücken",
      },
      {
        kicker: "Ladevorgänge",
        title: "Vom ersten TransactionEvent bis zum letzten Messwert",
        description:
          "Ladevorgänge mit vollständiger Ereignis-Zeitleiste und Diagrammen für jeden gemeldeten Messwert (Leistung, Energie, Ladezustand, Spannung, Strom, je Phase, sofern verfügbar).",
        bullets: [
          "Sequenznummern sichtbar gemacht (Lücken zeigen verlorene Ereignisse)",
          "Offline aufgezeichnete Messwerte werden gekennzeichnet",
          "Stop-Grund, ID-Token und Remote-/Lokal-Kontext je Ladevorgang",
        ],
        alt: "Ladevorgang-Detailansicht mit 11-kW-Ladekurve über fast vier Stunden",
      },
      {
        kicker: "Kommando-Konsole",
        title: "Senden Sie jeden Request, auch absichtlich nicht OCPP-konforme",
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
      "Keine Mock-Daten, keine Magie. Jede Funktion arbeitet auf Basis der echten Nachrichten Ihrer Ladestationen.",
    features: [
      {
        title: "OCPP-2.0.1-CSMS",
        description:
          "Ein WebSocket-Server für OCPP-J 2.0.1 mit vielen Ladepunkten gleichzeitig, optional mit HTTP Basic Auth je Station.",
      },
      {
        title: "Schema-Validierung",
        description:
          "Jede ein- und ausgehende Nachricht wird gegen die offiziellen OCPP-2.0.1-JSON-Schemata geprüft, sodass Compliance-Probleme sofort auffallen.",
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
          "Uptime, Sitzungen, Offline-Lücken, Close-Codes und abgewiesene Verbindungsversuche, abgeleitet aus jedem einzelnen WebSocket-Ereignis.",
      },
      {
        title: "WebSocket-Kontrolle",
        description:
          "Trennen Sie die Verbindung einer Station oder blockieren Sie Reconnects für definierte Zeiträume, um das Offline-Verhalten Ihrer Ladestation zu testen.",
      },
      {
        title: "Ladevorgänge & Messwerte",
        description:
          "Ereignis-Zeitleisten mit Erkennung verlorener Ereignisse und Diagramme je Messgröße für die detaillierte Analyse.",
      },
      {
        title: "Security-Ereignisse",
        description:
          "Sicherheitsmeldungen und zertifikatsbezogene Ereignisse jeder Ladestation an einem Ort.",
      },
      {
        title: "Device-Model-Browser",
        description:
          "Fordern Sie einen Base Report an und navigieren Sie durch den EVSE-/Komponenten-/Variablen-Baum der Station.",
      },
      {
        title: "Kommando-Konsole",
        description:
          "Jede CSMS-initiierte Aktion mit editierbaren Payloads, auch absichtlich ungültige für Negativtests.",
      },
      {
        title: "Nachrichten-Historie",
        description:
          "Durchsuchen und filtern Sie sämtliche OCPP-Nachrichten in rollierenden oder historischen Zeitfenstern.",
      },
      {
        title: "REST-API",
        description:
          "Alles, was die Oberfläche kann, gibt es als dokumentierte REST-API, die Basis für skriptgesteuerte Tests und CI.",
      },
    ],

    apiTitle: "Automatisieren Sie alles über die REST-API",
    apiSubtitle:
      "Die Oberfläche ist nur ein Client. Registrieren Sie Stationen, senden Sie Kommandos, lesen Sie Logs und prüfen Sie Ergebnisse aus Ihren Testskripten oder der CI-Pipeline. Die OpenAPI-Spezifikation dokumentiert jeden Endpunkt.",
    apiBullets: [
      "Beliebige OCPP-Aktionen senden und das Ergebnis abfragen (202, dann completed, failed oder timed out)",
      "Nachrichten-Logs, Verbindungsereignisse, Ladevorgänge und Messwerte mit Zeitfiltern abfragen",
      "Automatische Antworten und Verbindungsblockaden zur Laufzeit konfigurieren",
    ],
    apiFootnote:
      "Läuft auch auf Ihrer eigenen Hardware (ein Raspberry Pi genügt). Ihre OCPP-Nachrichten verlassen niemals Ihr Labor.",

    aiKicker: "Bereit für KI",
    aiTitle: "Lassen Sie Ihren KI-Agenten den Prüfstand bedienen",
    aiSubtitle:
      "Die REST-API ist auf die effiziente Nutzung durch LLM-basierte Agenten ausgelegt, und EVSExplorer liefert eine Skill-Datei mit, die Ihrem KI-Assistenten das Domänenmodell, die Interaktionsmuster und die typischen Arbeitsabläufe beibringt, damit er den Prüfstand für Sie bedient.",
    aiBullets: [
      "Selbsterklärend: die Instanz liefert ihre Skill-Datei unter /api/skill.md aus. Verweisen Sie Claude Code oder ein anderes agentisches Tool darauf und der Agent lernt Domänenmodell und Workflows an Ort und Stelle",
      "Token-effizient von Haus aus: serverseitige Limits, Zeitfilter, Aktions-Ausschluss und schlanke Feldauswahl halten Antworten klein genug für Modelle mit begrenztem LLM-Kontextfenster",
      "Maschinenlesbare Fehlercodes und ein asynchrones Kommando-Muster, das Agenten deterministisch abfragen können",
      "Auch die OpenAPI-Spezifikation wird von der Instanz ausgeliefert, sodass Agenten jeden Endpunkt zur Laufzeit entdecken können",
    ],
    aiTranscriptCaption:
      "Aus einer echten Agenten-Session (Claude CLI) gegen eine Prüfstand-Instanz.",

    contactTitle: "Holen Sie EVSExplorer auf Ihren Prüfstand",
    contactSubtitle:
      "Erzählen Sie uns von Ihrem Setup und Ihren Testanforderungen. Wir zeigen Ihnen EVSExplorer live und bringen Sie innerhalb weniger Tage an den Start.",
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

    // Blog / Artikel
    blog: {
      navLabel: "Artikel",
      title: "Technische Artikel",
      subtitle:
        "Tiefgehende Einblicke in OCPP 2.0.1 (Nachrichten, Transport und Prüfstand).",
      readArticle: "Artikel lesen",
      updatedLabel: "Aktualisiert",
      publishedLabel: "Veröffentlicht",
      backToList: "Alle Artikel",
      empty: "Noch keine Artikel, schauen Sie bald wieder vorbei.",
      notFoundTitle: "Artikel nicht gefunden",
      notFoundText: "Dieser Artikel existiert nicht oder wurde verschoben.",
      translationNote: "Auch verfügbar auf",
    },

    footerClaim: "OCPP-2.0.1-Test-CSMS, Cloud oder eigene Hardware",
    copyright: "© 2026 EVSExplorer. Alle Rechte vorbehalten.",

    // Impressum
    impressumLink: "Impressum",
    impressum: {
      title: "Impressum",
      subtitle: "Angaben gemäß § 5 DDG",
      providerHeading: "Anbieter",
      contactHeading: "Kontakt",
      emailLabel: "E-Mail",
      phoneLabel: "Telefon",
      vatHeading: "Umsatzsteuer-Identifikationsnummer",
      vatText:
        "Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:",
      registerHeading: "Registereintrag",
      registerCourtLabel: "Registergericht",
      registerNumberLabel: "Registernummer",
      responsibleHeading: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
      disputeHeading: "Verbraucherstreitbeilegung",
      disputeText:
        "Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
      backToHome: "Zurück zur Startseite",
    },

    // Datenschutzerklärung
    datenschutzLink: "Datenschutz",
    datenschutz: {
      title: "Datenschutzerklärung",
      subtitle: "Informationen zur Verarbeitung personenbezogener Daten",
      updated: "Stand: Juli 2026",

      introHeading: "Überblick",
      introText:
        "Diese Datenschutzerklärung informiert Sie darüber, welche personenbezogenen Daten beim Besuch dieser Website verarbeitet werden. Die Website kommt vollständig ohne Cookies, ohne Tracking und ohne Analyse- oder Werbedienste aus. Verarbeitet werden im Wesentlichen nur die technisch notwendigen Zugriffsdaten, die beim Ausliefern der Seiten anfallen.",

      controllerHeading: "Verantwortlicher",
      controllerIntro:
        "Verantwortlich für die Datenverarbeitung auf dieser Website ist:",

      hostingHeading: "Hosting (GitHub Pages)",
      hostingText:
        "Diese Website wird bei GitHub, Inc. gehostet und über deren Dienst GitHub Pages ausgeliefert. Wenn Sie die Website aufrufen, verarbeitet GitHub als unser Hoster technische Zugriffsdaten. Dazu gehört insbesondere Ihre IP-Adresse, die als personenbezogenes Datum gilt und erforderlich ist, damit die aufgerufenen Seiten an Ihr Gerät ausgeliefert werden können.",
      hostingPurpose:
        "Als Betreiber der Website haben wir dabei keinen unmittelbaren Zugriff auf diese Daten und können nicht im Einzelnen angeben, welche Daten GitHub speichert und wie lange. Für diese Details verweisen wir auf die Datenschutzerklärung von GitHub (siehe unten). Die Verarbeitung dient der Auslieferung, Stabilität und Sicherheit der Website.",
      hostingLegalBasis:
        "Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der zuverlässigen und sicheren Bereitstellung der Website.",
      hostingTransfer:
        "GitHub ist ein Unternehmen mit Sitz in den USA. Ihre Daten können daher in den USA verarbeitet werden. GitHub ist unter dem EU-US Data Privacy Framework zertifiziert, wodurch ein angemessenes Datenschutzniveau im Sinne von Art. 45 DSGVO gewährleistet wird.",
      hostingProviderLabel: "Hoster:",
      hostingProvider: [
        "GitHub, Inc.",
        "88 Colin P. Kelly Jr. Street",
        "San Francisco, CA 94107",
        "USA",
      ],
      hostingPrivacyLinkLabel: "Datenschutzerklärung von GitHub",
      hostingPrivacyLinkUrl:
        "https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement",

      tlsHeading: "Verschlüsselung (TLS)",
      tlsText:
        "Die Website wird ausschließlich verschlüsselt über HTTPS (TLS) ausgeliefert. Dadurch werden die zwischen Ihrem Browser und dem Server übertragenen Daten gegen das Mitlesen durch Dritte geschützt.",

      contactHeading: "Kontaktaufnahme per E-Mail",
      contactText:
        "Wenn Sie uns per E-Mail (hello@evsexplorer.com) kontaktieren, verarbeiten wir die von Ihnen übermittelten Angaben (Ihre E-Mail-Adresse sowie den Inhalt Ihrer Nachricht), um Ihre Anfrage zu bearbeiten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage auf den Abschluss oder die Durchführung eines Vertrags gerichtet ist, andernfalls Art. 6 Abs. 1 lit. f DSGVO (Interesse an der Bearbeitung Ihrer Anfrage). Eine Weitergabe dieser Daten an Dritte erfolgt ohne Ihre ausdrückliche Einwilligung nicht. Wir löschen diese Daten, sobald sie für den Zweck nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",

      noTrackingHeading: "Keine Cookies, kein Tracking",
      noTrackingText:
        "Diese Website setzt keine Cookies und verwendet keine Analyse- oder Trackingdienste, keine Werbung und keine Social-Media-Plugins. Es werden auch keine externen Ressourcen (etwa Schriftarten oder Skripte) von Servern Dritter nachgeladen. Aus diesem Grund ist keine Einwilligung nach § 25 TDDDG erforderlich und es wird kein Cookie-Banner angezeigt.",

      rightsHeading: "Ihre Rechte",
      rightsIntro:
        "Im Hinblick auf Ihre personenbezogenen Daten stehen Ihnen die folgenden Rechte zu:",
      rightsItems: [
        "Recht auf Auskunft (Art. 15 DSGVO)",
        "Recht auf Berichtigung (Art. 16 DSGVO)",
        "Recht auf Löschung (Art. 17 DSGVO)",
        "Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)",
        "Recht auf Datenübertragbarkeit (Art. 20 DSGVO)",
        "Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)",
      ],
      rightsOutro:
        "Zur Ausübung dieser Rechte genügt eine formlose Mitteilung an die oben genannten Kontaktdaten.",

      complaintHeading: "Beschwerderecht bei der Aufsichtsbehörde",
      complaintText:
        "Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren, insbesondere in dem Mitgliedstaat Ihres Aufenthaltsorts oder des Orts des mutmaßlichen Verstoßes. Die für uns zuständige Aufsichtsbehörde ist:",
      complaintAuthority: [
        "Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg",
        "Lautenschlagerstraße 20",
        "70173 Stuttgart",
        "Deutschland",
      ],
      complaintLinkLabel: "baden-wuerttemberg.datenschutz.de",
      complaintLinkUrl: "https://www.baden-wuerttemberg.datenschutz.de",

      backToHome: "Zurück zur Startseite",
    },
  },
};

export type Translation = (typeof translations)["en"];
