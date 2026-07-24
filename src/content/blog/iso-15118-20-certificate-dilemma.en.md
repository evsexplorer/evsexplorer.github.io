---
title: "The certificate dilemma: how we (have to) backport ISO 15118-20 support to OCPP 1.6 and 2.0.1"
date: 2026-06-02
description: "AFIR mandates ISO 15118-20 from 2027, but OCPP 1.6 and 2.0.1 have no standard way to manage its separate certificate chains. Three ways to backport it, and why the OCA needs to act."
tags: [afir, ocpp, iso-15118, certificates]
---

As a software developer for charging infrastructure, you look at the year 2027
with mixed feelings.

On one hand, the European AFIR regulation (Alternative Fuels Infrastructure
Regulation) brings the long-awaited push for modern protocols. From 1 January
2027, newly installed public and private charging points (Mode 3 AC and DC) must
support ISO 15118-20:2022. That means, among other things, TLS 1.3, new cipher
suites and new V2G certificate chains.

On the other hand, in development we face a real protocol gap. Vehicle
manufacturers are migrating only slowly, so charging stations in the field have
to operate dual-stack. They must serve both the old ISO 15118-2 (for existing
vehicles) and the new ISO 15118-20 in parallel.

The problem? The communication protocol to the backend (CSMS). Official support
for ISO 15118-20 certificate management arrives only with OCPP 2.1. In the
field, however, OCPP 1.6J dominates, and increasingly OCPP 2.0.1. Neither knows
anything about the new, separate certificate chains of ISO 15118-20.

How do we solve this for existing wallboxes and current product lines, without
being able to wait for OCPP 2.1? A look at the technical reality.

## The starting point: why today's OCPP standards are not ready yet

To run Plug & Charge securely, the charging station (EVSE) needs a valid V2G
root certificate (or chain) to verify the TLS connection with the vehicle.
Because ISO 15118-2 and ISO 15118-20 are not cryptographically or structurally
backward compatible, we need two parallel V2G certificate chains in the
wallbox's memory.

This is where the established OCPP versions hit their limits.

### OCPP 1.6J: no native certificate management

OCPP 1.6 has no certificate handling at all in the core standard. The industry
has been getting by for years with two well-known extensions:

- The official OCA Application Note "Using ISO 15118 Plug & Charge with OCPP 1.6"
- The widely used has-to-be extension (v1.4)

Both use the DataTransfer.req mechanism to mirror OCPP 2.0.1 messages such as
SignCertificate.req or CertificateSigned.req. The problem: this extension was
written exclusively for ISO 15118-2. Structurally it only allows storing a
single V2G certificate.

### OCPP 2.0.1: the standardization dead end

OCPP 2.0.1 did bring native ISO 15118-2 certificate management, but it
explicitly locks out the future. In the datatypes (for example in
SignCertificateRequest), the `certificateType` field is defined as an
enumeration:

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

This is exactly where the newest standard (OCPP 2.1) steps in and extends the
enum with a new value, `V2G20Certificate`.

On OCPP 2.0.1 we are left with the two enum values it lists. The
`"additionalProperties": false` in the snippet only forbids extra properties on
JSON objects, but it is the `enum` keyword that makes a strict validator accept
only the strings listed there.

Nothing therefore stops the sender from putting `V2G20Certificate` on the wire,
but a standard-conformant CSMS (or Charging Station) that validates against the
official schema will most likely reject the message with a
`PropertyConstraintViolation` or `FormatViolation` (and extending an enumeration
may also jeopardize OCA certification via the OCTT test tool). So there is no
uniform, standard-compliant way to tell the counterparty: this is a V2G
certificate specifically for ISO 15118-20.

## Looming sprawl: the nightmare scenario for CPOs

If the Open Charge Alliance (OCA) does not react quickly now and publish a
uniform Application Note, exactly what its open standard is meant to prevent will
happen:

Charging station manufacturers will again go their own way to push the "-20"
certificates onto the box. For Charge Point Operators (CPOs) that means
unnecessarily high integration effort when their backend has to speak different
dialects for one and the same use case, providing an ISO 15118-20 certificate.

## Technical options for developers

As long as there is no official OCA guideline, we firmware developers
essentially have three paths to make older OCPP versions AFIR-ready.

### Solution A (OCPP 1.6J): extend the existing DataTransfer message

Because OCPP 1.6J allows free-form JSON via DataTransfer.req, we can extend the
existing OCA / has-to-be specification. Instead of a new message, we extend the
payload of TriggerMessage, SignCertificate or CertificateSigned with an optional
discriminator.

```json
[2, "123456", "DataTransfer", {
  "vendorId": "com.example.ocpp",
  "messageId": "SignCertificate",
  "data": "{ \"csr\": \"<certificate signing request>\", \"certificateType\": \"V2G20Certificate\" }"
}]
```

- Advantage: full flexibility, no violation of the OCPP 1.6J schema.
- Disadvantage: a proprietary interface between charging station and CSMS.

### Solution B (OCPP 2.0.1): the all-purpose customData

Because OCPP 2.0.1 provides a vendor-specific extension object called
`customData` on every JSON class (that is, every message), we can use it to add
a "-20" indicator to the existing messages. `customData` is of type
`CustomDataType` which, unlike every other standard datatype, allows arbitrary
extensions. The spec even calls it out as the only class in the JSON schema
files that allows additional properties.

So we can extend TriggerMessageRequest, SignCertificateRequest or
CertificateSignedRequest with a suitable indicator, without having to define
special DataTransferRequest messages.

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

- Advantage: full flexibility, no violation of the OCPP schema.
- Disadvantage: a proprietary interface between charging station and CSMS.

### Solution C (OCPP 1.6J / 2.0.1): the multi-format certificate container

The CSMS sends both certificate chains as a `V2GCertificate`. In the
`certificateChain` field the charging station accepts a combined PEM file or a
custom string container (for example a base64-encoded JSON) that holds both
chains (ISO 15118-2 and ISO 15118-20) one after another. When parsing, the
firmware separates them by their crypto algorithms (for example ECDSA versus the
newer curves in -20) or by their root CNs, and stores them separately.

- Advantage: OCPP 2.0.1 schema validation passes without errors.
- Disadvantage: added complexity from parsing at the embedded level, and it
  contradicts the idea of clean interface separation.

## Conclusion: an appeal to the Open Charge Alliance

The technical workarounds show that we can provide ISO 15118-20 certificates on
older systems. But every one of these paths hurts from a software architecture
point of view. They are crutches to meet a regulatory deadline while
standardization lags behind.

To prevent compatibility chaos in 2027, the Open Charge Alliance (OCA) is
urgently needed. What we need is a standardized transitional Application Note for
OCPP 1.6J and OCPP 2.0.1 that, just like the old 15118-2 extensions, gives clear
rules for ISO 15118-20. Only then is interoperability preserved and the
integration effort for CPOs kept affordable.

The spec itself already hints at this. It calls customData and DataTransfer
escape hatches to use with extreme caution, since they impact compatibility with
systems that do not implement them, and it recommends consulting the OCA before
reaching for them. A transition that stays inside one shared Application Note is
exactly how we avoid every vendor inventing its own.
