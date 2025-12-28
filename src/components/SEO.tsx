import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  language: 'en' | 'de';
}

export function SEO({ language }: SEOProps) {
  const seoData = {
    en: {
      title: 'EVSExplorer - Professional OCPP Testing & Monitoring',
      description: 'EVSExplorer is a comprehensive OCPP 2.0.1 WebSocket server designed for monitoring and compliance testing of electric vehicle charge points. Use our REST API to create your individual testing scenarios.',
      keywords: 'OCPP, OCPP 2.0.1, ocpp compliant chargers, ocpp compliance test automation, automated charge point testing, automated EVSE testing, EVSE monitoring, charge point monitoring, OCPP compliance testing, electric vehicle charging, WebSocket server, charge point validation, EV charging infrastructure, OCPP protocol testing, charging station certification, electric vehicle supply equipment',
      canonicalUrl: 'https://evsexplorer.com',
      siteName: 'EVSExplorer',
      author: 'The EVSExplorer team',
      twitterCard: 'summary_large_image',
      ogType: 'website'
    },
    de: {
      title: 'EVSExplorer - Professionelles OCPP Testen & Überwachen',
      description: 'EVSExplorer ist ein umfangreicher OCPP 2.0.1 WebSocket-Server zur Überwachung und für Compliance-Tests von Elektrofahrzeug-Ladestationen. Nutzen Sie auch unsere REST-API um Ihre ganz speziellen Testszenarien zu erstellen',
      keywords: 'OCPP, OCPP 2.0.1, ocpp wallbox, automatisierte Ladepunkt Tests, automatisierte EVSE Tests, EVSE Überwachung, Ladepunkt Überwachung, OCPP Compliance Tests, Elektrofahrzeug Laden, WebSocket Server, Ladepunkt Validierung, E-Mobility Ladeinfrastruktur, OCPP Protokoll Tests, Ladepunkt Zertifizierung, EVSE Compliance, Elektrofahrzeug Ladestation',
      canonicalUrl: 'https://evsexplorer.com',
      siteName: 'EVSExplorer',
      author: 'Das Team von EVSExplorer',
      twitterCard: 'summary_large_image',
      ogType: 'website'
    }
  };

  const currentSEO = seoData[language];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "EVSExplorer",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web-based",
    "description": currentSEO.description,
    "url": currentSEO.canonicalUrl,
    "author": {
      "@type": "Organization",
      "name": currentSEO.author
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD",
      "description": language === 'en' ? "Contact us for pricing" : "Kontaktieren Sie und für Preisanfragen."
    },
    "featureList": [
      "OCPP 2.0.1 Protocol",
      "Multi Connection Support",
      "Message Validation",
      "Real-time Dashboard",
      "Auto-Response System",
      "Connection Stability Analysis",
      "WebSocket Control",
      "Message History",
      "Custom Alerts",
      "Transaction Visualization",
      "REST API Control",
      "Compliance Testing Tools"
    ],
    "applicationSubCategory": "OCPP Testing Software",
    "screenshot": currentSEO.canonicalUrl + "/screenshot.png",
    "downloadUrl": currentSEO.canonicalUrl,
    "supportingData": {
      "@type": "Dataset",
      "name": "OCPP 2.0.1 Compliance Data",
      "description": language === 'en' ? 
        "EVSExplorer is a comprehensive OCPP 2.0.1 WebSocket server designed for monitoring and compliance testing of electric vehicle charge points" :
        "EVSExplorer ist ein umfangreicher OCPP 2.0.1 WebSocket-Server zur Überwachung und für Compliance-Tests von Elektrofahrzeug-Ladestationen."
    }
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EVSExplorer",
    "url": currentSEO.canonicalUrl,
    "logo": currentSEO.canonicalUrl + "/assets/cb71f464b18f6d1a5ae5e91219f7311c3c3df3dc-DxQIuVWP.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "contactType": "sales",
      "email": "hello@evsexplorer.com"
    },
    "sameAs": [
      currentSEO.canonicalUrl
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={language} />
      <title>{currentSEO.title}</title>
      <meta name="description" content={currentSEO.description} />
      <meta name="keywords" content={currentSEO.keywords} />
      <meta name="author" content={currentSEO.author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentSEO.canonicalUrl} />
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" sizes="any" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en" href="https://evsexplorer.com?lang=en" />
      <link rel="alternate" hrefLang="de" href="https://evsexplorer.com?lang=de" />
      <link rel="alternate" hrefLang="x-default" href="https://evsexplorer.com" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={currentSEO.ogType} />
      <meta property="og:url" content={currentSEO.canonicalUrl} />
      <meta property="og:title" content={currentSEO.title} />
      <meta property="og:description" content={currentSEO.description} />
      <meta property="og:image" content={currentSEO.canonicalUrl + "/assets/cb71f464b18f6d1a5ae5e91219f7311c3c3df3dc-DxQIuVWP.png"} />
      <meta property="og:image:width" content="64" />
      <meta property="og:image:height" content="64" />
      <meta property="og:site_name" content={currentSEO.siteName} />
      <meta property="og:locale" content={language === 'en' ? 'en_US' : 'de_DE'} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={currentSEO.twitterCard} />
      <meta name="twitter:url" content={currentSEO.canonicalUrl} />
      <meta name="twitter:title" content={currentSEO.title} />
      <meta name="twitter:description" content={currentSEO.description} />
      <meta name="twitter:image" content={currentSEO.canonicalUrl + "/assets/cb71f464b18f6d1a5ae5e91219f7311c3c3df3dc-DxQIuVWP.png"} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#0E1E42" />
      <meta name="apple-mobile-web-app-title" content="EVSExplorer" />
      <meta name="application-name" content="EVSExplorer" />
      <meta name="msapplication-TileColor" content="#0E1E42" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
      
      {/* Additional Technical Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* Industry-Specific Meta Tags */}
      <meta name="classification" content="OCPP Testing Software" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="target" content="EVSE manufacturers, charge point operators, testing laboratories" />
      
      {/* Business Meta Tags */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="Worldwide" />
      <meta name="ICBM" content="40.7589, -73.9851" />
      
      {/* Additional Schema Markup for Technical Software */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": "OCPP 2.0.1 Testing and Charge Point Monitoring Solution",
          "description": currentSEO.description,
          "author": {
            "@type": "Organization",
            "name": "EVSExplorer"
          },
          "publisher": {
            "@type": "Organization",
            "name": "EVSExplorer",
            "logo": {
              "@type": "ImageObject",
              "url": currentSEO.canonicalUrl + + "/assets/cb71f464b18f6d1a5ae5e91219f7311c3c3df3dc-DxQIuVWP.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentSEO.canonicalUrl
          },
          "datePublished": "2025-01-01",
          "dateModified": new Date().toISOString().split('T')[0],
          "articleSection": "OCPP Testing",
          "keywords": currentSEO.keywords.split(', ')
        })}
      </script>
    </Helmet>
  );
}