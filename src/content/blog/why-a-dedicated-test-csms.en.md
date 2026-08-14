---
title: "Why testing a charge point needs a different CSMS than operating one"
date: 2026-08-22
description: "A CPO can prepare for the charge points it integrates. A manufacturer cannot prepare for the CSMS it will be connected to. This asymmetry decides what a test CSMS needs to support."
tags: [ocpp, testing, csms]
---

Many teams testing an EV charging station start with a CSMS they already have. This may
be a development or staging instance of the production backend, an open source CSMS
or whatever the integration team happens to run. That works for a while, but it
reaches its limits when it comes to finding root causes for defects deeper inside the
charger, or to setting up specific test conditions.

The reason is not that production CSMS are designed badly. Testing and operating a charger
are different jobs, and the two backends are optimized for different things.

## The asymmetry that decides the CSMS

The two sides of an OCPP connection do not face the same problem.

A charge point operator (CPO) knows what it is dealing with, or will be. It selects the
charging stations it integrates, or has a sample available in advance for integration
tests. It also knows its own certificate authority, the certificate chain it issues,
and it decides which security profile(s) its CSMS offers. It can prepare for vendor
specific extensions (e.g. custom DataTransfer messages) and the OCPP device model the
station offers.

A charging station manufacturer does not know which CSMS its product will be
operated at, so it cannot prepare for a specific backend. It has to accept
certificate chains from operators it has never seen, and it has to support all
three security profiles, because it cannot know which one a customer will
use. Granted, it has some freedom in the implementation too, because the OCPP
certification profiles do not require every defined function and the hardware
also decides what can be implemented and what cannot. But a gap in the supported
OCPP feature set often means a competitive disadvantage for the manufacturer.

In short, the CPO can often narrow the problem space. The manufacturer
usually has to cover it completely. The
[migration of a station to a new CSMS](/blog/csms-migration-security-profiles) is
the same asymmetry, seen from the other end. There, the new CSMS operator has to
accept whatever security profile and certificate chain the station already
carries. That is the position the manufacturer is always in.

That is why the tooling differs depending on its use case. A CSMS that operates a
known device fleet may deliberately implement a selective set of functions. A CSMS
that has to test a station against unknown backends may not.

## What a production CSMS is optimized for

A production CSMS is a system with paying customers behind it. That is what it
is optimized for.

1. It implements the use cases the operator actually uses, usually a subset of
   OCPP. That ranges from the security profile in use, through the station's
   configured authorization and transaction behaviour, to charging profiles for
   smart charging.
2. It deliberately blocks, for example, the interfaces that could disturb live
   communication, because an unexpected or outright wrong command to a station
   with a vehicle currently charging has real consequences. Deliberately
   refusing a station's connection attempt contradicts the intent of a
   production CSMS just as much as challenging the station with corrupted or
   incorrectly signed software packages.
3. If a software fix in the station takes a long time, or is not possible at
   all, workarounds in the production CSMS are accepted quickly. As mentioned,
   the customer experience and the billing of charging sessions are what
   matter. Over time, a production CSMS accumulates tolerance for station
   specific behaviour that is not correct, or was never precisely specified in
   the first place, but is already in the field. The alternative would be to
   degrade the charging experience.

Each of those decisions is right for day to day operation. They make it a poor
instrument for testing a charging station, though.

In fairness, a production CSMS also takes on work a test CSMS can ignore
completely, such as roaming over OCPI, Hubject connections, or payment and
billing for charging transactions. That is additional complexity the production
CSMS implements, which likewise does not contribute to testing a charging
station.

## What a test CSMS has to do instead

Now reverse each of those points.

**Coverage.** A station has to be tested against the full range of use cases it
claims to support. Not just the subset one operator happens to use. That includes
messages a production backend may never send, messages that got lost in the
network, or corrupted software packages that the station is supposed to detect
and refuse to install.

**Insight below the messages.** Reading OCPP frames is not enough. When a station
does not connect at all there are no OCPP frames, and the answer is one or two
layers further down, in the TLS handshake, in the
[WebSocket upgrade or in the subprotocol that was never agreed](/blog/ocpp-websocket-connection).

**Control.** This is the part a production CSMS deliberately does not offer. To
find out how a station reacts, you have to be able to misbehave towards it on
purpose:

- answer a request with a wrong value, or with a payload that violates the schema
- not answer at all, and let the station's timeout expire
- delay an answer until the station moves on by itself, or resends the message
- send the same message twice
- close the connection at the most inconvenient moment and refuse the reconnect

None of that is acceptable in a production CSMS. All of it is required on a test
bench.

## Testing a charging station is more than OCPP

Everything so far is still OCPP. The larger point is that OCPP is only one axis
of the problem.

A modern charging station is not an OCPP client with a contactor attached. It has
an ISO 15118 stack talking to the vehicle, an RFID reader, a Bluetooth interface
for commissioning, a local web UI or API, and often EEBus or Modbus toward an
energy management system. Every interface pulled into the object under test
increases the test surface, and with it the complexity, considerably.

Hardware belongs in the test as well. Does a fault in the ground monitoring, or
an undervoltage on a single phase, turn into an OCPP StatusNotification or a
SecurityEventNotification? That can be verified in the CSMS, but it cannot be
triggered over OCPP.

Then comes orchestration. Some use cases collide, and which one wins sometimes
depends on the capabilities of the hardware and the firmware. Can the station
install a firmware update while a vehicle is charging, for example? If not, what
does it do with the request? Does it defer the work until charging has ended, or
does it refuse it? Both answers are defensible. The expected answer can again be
verified in the CSMS, but the CSMS cannot start the charging session.

Other test cases cannot be triggered over OCPP either:

- Does a certificate update survive a power cut halfway through, or does the
  station come back with no usable certificate and no way to obtain one?
- Does a local reboot, triggered from the web UI, a Bluetooth app or a button on
  the device, report the correct
  [boot reason](/blog/ocpp-boot-notification) after it comes back up?
- Does that reboot end a running charging session with the correct stop reason,
  or with a default value?

The trigger for the test conditions sits outside OCPP here as well. The evidence
arrives over OCPP in all three cases.

## A test CSMS is one building block, not the whole bench

That leads to a clear conclusion. If testing a charging station spans OCPP,
hardware, several further interfaces and triggers that a person applies by
holding up an RFID chip, plugging in the connector or pressing a switch in a
smartphone app, then no single tool covers it. A test CSMS serves one axis of it.
Another instance has to coordinate the rest.

That also affects how a test CSMS should be built. It has to pass its data and
its events to the layer above, so a bench can correlate an OCPP event with a
power supply that a different tool switched off seconds earlier. A test CSMS that
can only be operated through its own interface is a dead end in that
architecture, however good that interface may be.

The requirement list is therefore short:
- Cover the whole protocol instead of a subset.
- Show the layers below the messages.
- Allow deliberate misbehaviour.
- Be readable by something else.

## Where OCTT belongs

One tool has to be named at this point, because it appears to bring test CSMS
capabilities with it. The Open Charge Alliance publishes the
[OCPP Compliance Test Tool (OCTT)](https://openchargealliance.org/test-tool/).
It runs the official test cases against a charging station and acts as the CSMS
while it does that. It is **the** reference for protocol conformance, and an
official OCPP certificate is ultimately issued on the basis of a run at an OCA
approved test lab.

On coverage, the first point of the list above, nothing comes close to OCTT. It
implements every normatively required test case, structured along the
certification profiles. Conformance to the standard is measured against them.

On control, the third point, the OCA states the scope itself, on the
[page of the tool](https://openchargealliance.org/test-tool/): "OCTT is capable
of executing predefined scenarios only. It is not a CS/CSSS or CSMS simulator."
The list of deliberate misbehaviour above therefore sits outside what the tool
is for. Sending a wrong value to the station, a response you hold back, a socket
you close at a moment of your choosing. None of that is a predefined scenario.

That is not a defect in OCTT. It follows from the job the tool was created for.
A conformance verdict has to be reproducible and comparable between vendors. An
issued certificate has to be defensible. All three require a fixed set of
scenarios and an (almost) binary result. Conforming to the standard or not, per
test case. But that is not what a developer needs to know.

Developing an OCPP capable charging station is a different situation. When the
station does not meet the conformance conditions, the question is not "pass or
fail" but why the station behaves the way it does. A tool built to produce a
final attestation cannot answer that, and it is not supposed to.

The difference also shows in how and when the two are used. A conformance run is
an event, close to the end of the development cycle. It is prepared, booked,
executed and reported. A development bench ideally runs permanently. Several
people work on it every day, at the same time, on several connected stations. A
tool licensed and sized around one system under test does not fit that. What is
needed here is a CSMS that a whole team can use without anyone waiting for a
slot, and that runs where the bench stands. Behind a company firewall if need
be, or in a lab with no path to the internet.

One point from the
[architecture description the OCA published for OCTT](https://openchargealliance.org/wp-content/uploads/2024/03/Presentation-OCTT-Update-February-2024.pdf)
supports the claim from the previous section. A single OCPP test tool cannot
drive everything its test cases need. It needs further ways to interact with
something that can plug in a connector, hold up an RFID token or change the
state of the vehicle. The OCA arrives at the same conclusion: the CSMS side is
only one part of the bench.

So OCTT and a dedicated test CSMS do not replace each other. OCTT answers
whether an implementation conforms to the standard. A test CSMS you control
yourself is what you need for everything before that, and for everything the
predefined test cases do not cover.

## What that looks like in practice

In [EVSExplorer](/), misbehaviour can be configured deliberately. Per request auto
responses
[answer a station's request with a payload you define, or leave it unanswered](/#feature-auto-responses).
An OCPP request can be sent with schema validation switched off, so a payload
that violates the OCPP schema goes on the wire unchanged.
[Closing the socket and refusing what follows](/#feature-websocket-control) are
two API calls that target specific failure scenarios such as a CSMS outage or a
misconfigured firewall. Configure the EVSExplorer OCPP server deliberately to
present the station with unexpected server certificates or an outdated TLS
version, and check whether the station rejects the connection as expected and
later sends a matching SecurityEvent.

The connection events record what happened below the messages: which security
profile a session negotiated, which side ended it and why, and the reason an
attempt was refused before it ever became a session. Sequence numbers of
transaction events are surfaced as gaps, so a change of network interface, or a
connection interruption that causes OCPP messages to be lost, is easy to spot.

Everything the interface can do is
[also available over the documented REST API](/#feature-rest-api), so a bench
that coordinates several test systems can drive EVSExplorer automatically and
read back the recorded messages and events. That answers the last item on the
requirement list.

A test CSMS like EVSExplorer should integrate into as many test benches as
possible. It
[handles many charge points at the same time](/#feature-ocpp-csms), several
people work on it in parallel, and it runs either in the cloud or on your own
hardware inside your own network.

A test CSMS is a specialist towards the charging station (the protocol here is
OCPP 2.0.1) and open towards the systems above it. The vehicle interface, the
local API and the hardware each need their own instrumentation.
