---
title: "What is OCPP, and where do you get it?"
date: 2026-05-03
description: "A short introduction to the Open Charge Point Protocol: what it does, who maintains it, how to obtain the open specification, and what each of its seven parts contains."
tags: [ocpp, introduction]
---

Before we start reading individual OCPP messages, it is worth a paragraph on
what OCPP actually is, who stands behind it, and how to get your own copy of the
specification.

## What OCPP is

**OCPP** stands for **Open Charge Point Protocol**. It is the open application
protocol that lets an EV charging station talk to a central backend, called
the **CSMS** (Charging Station Management System) in the 2.x line and the
"Central System" in older versions.

OCPP standardizes the conversation between the two sides: a station registering
itself, authorizing a driver, starting and stopping transactions, reporting
meter values, accepting remote commands, updating its firmware, following smart
charging limits and more. Because the protocol is vendor-neutral, one backend
can operate charging stations from many different manufacturers, which
is the whole point.

## Who maintains it

OCPP is developed and maintained by the **Open Charge Alliance (OCA)**, a global
industry consortium whose members include charging hardware and software
vendors, network operators and utilities.

The specification is copyrighted and "Open" means it is openly published and free
to implement, not that it is public domain. You may build products from it, but you
may not redistribute the documents yourself.

A quick note on versions: the most widely deployed releases today are **1.6**
and **2.0.1**, with **2.1** the newest. One practical difference worth knowing:
2.0.1 drops the older SOAP transport that 1.6 still offered and standardizes on
JSON over WebSocket.

## Where to get the specification

You download it from the Open Charge Alliance at **openchargealliance.org**,
free of charge and, at the time of writing, without registration. That is also
the right place to check which edition and errata are current, since the spec
is corrected over time.

## The seven parts

OCPP 2.0.1 is split into seven parts. Knowing which part answers which question
saves a lot of scrolling:

- **Part 0, Introduction.** The overview, terminology and the list of functional
  blocks. Start here if you are new.
- **Part 1, Architecture & Topology.** The actors (Charging Station, EVSE,
  connector, CSMS) and the device model that describes a station as a tree of
  components and variables.
- **Part 2, Specification.** The heart of it. Use cases and requirements grouped
  into functional blocks (A Security through P Data Transfer), plus every
  message, data type and the referenced components and variables. A companion
  **Part 2 Appendices** lists the security events, standardized units of measure
  and the standardized components and variables.
- **Part 3, Schemas.** The JSON Schema files for every message, so you can
  validate payloads against the spec instead of eyeballing them.
- **Part 4, Implementation Guide JSON.** This is OCPP-J: how the messages are
  carried as JSON over WebSocket, including the Call, CallResult and CallError
  framing, the message ids and the reconnect rules.
- **Part 5, Certification Profiles.** Which sets of use cases a product must
  implement to call itself OCPP 2.0.1 certified.
- **Part 6, Test Cases.** The OCA's test cases with the expected message
  sequences, used for conformance testing.

For day-to-day bench work you will live mostly in Part 2 (what a message means),
Part 3 (is my payload valid) and Part 4 (how it goes over the wire).

## Where this series goes next

With this basic introduction in hand, the rest of the series builds up from the
bottom:
- [the protocol stack OCPP sits on](/blog/ocpp-protocol-stack)
- [how a charging station opens and keeps its connection to the CSMS](/blog/ocpp-websocket-connection)
- and then the individual application messages that travel across it once it is
  online.
