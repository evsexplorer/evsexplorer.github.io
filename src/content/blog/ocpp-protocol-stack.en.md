---
title: "The stack under OCPP: TCP, TLS, WebSocket and OCPP-J"
date: 2026-05-10
description: "OCPP messages do not travel over the wire by themselves. They ride a stack of well-known layers. A walk from TCP up to the application layer, and where the security profiles and TLS fit in."
tags: [ocpp, transport, security]
---

An OCPP message like a BootNotification does not travel over the wire on its
own. It rides a stack of well-established layers, each with a clear job. Knowing
that stack tells you where to look when something breaks, because a failed TLS
handshake, a rejected WebSocket upgrade and a malformed OCPP-J frame are three
very different problems.

Here is the whole stack for OCPP 2.0.1:

```
+--------------------------------------------------------+
|  OCPP application layer                        Part 2  |
+--------------------------------------------------------+
|  OCPP-J  JSON message framing                  Part 4  |
+--------------------------------------------------------+
|  WebSocket  (RFC 6455)                                 |
+--------------------------------------------------------+
|  TLS   (optional: security profiles 2 and 3)           |
+--------------------------------------------------------+
|  TCP  /  IP                                            |
+--------------------------------------------------------+
```

Let us walk it from the bottom up.

## TCP / IP

At the bottom is an ordinary TCP connection over IP. Notably, it is the
**charging station** that opens the connection to the CSMS, not the other way
around. That sidesteps NAT and firewalls on the station's side, since only an
outbound connection is needed, and the station keeps that connection open for
its whole session.

TCP gives OCPP a reliable, ordered byte stream. OCPP-J relies on this: for data
integrity it leans on the underlying TCP/IP transport rather than adding
checksums of its own.

## TLS (optional)

This is where security comes in, and it is optional. In two of the three
security profiles the raw TCP connection is wrapped in **TLS** before anything
else happens, which is exactly what turns a `ws://` URL into `wss://`. TLS
encrypts the channel and lets the station verify it is really talking to its
CSMS (via the CSMS's server certificate), and in the strictest profile the CSMS
verifies the station in return (via a client certificate).

One caveat worth flagging: a station whose clock is wrong cannot validate
the server certificate, because certificate validity is time-bounded. That is
one more reason the clock matters (see the note on `currentTime` in the
[BootNotification article](/blog/ocpp-boot-notification)).

## WebSocket

On top of TCP (or TLS) sits a **WebSocket** connection (RFC 6455). It begins
life as an HTTP request that is then upgraded to a persistent, full-duplex
channel, so both sides can send at any time. During that upgrade the two sides
agree on which OCPP version they will speak, using the registered subprotocol
name `ocpp2.0.1` in the `Sec-WebSocket-Protocol` header. Once the WebSocket
connection is established, periodic ping/pong messages will keep it alive and
allow each end to notice network interruptions or the other party going away.

The details of that handshake (the URL, the subprotocol negotiation and what a
rejection looks like) are a topic of their own and get their own article. For
the stack picture it is enough to know WebSocket provides a long-lived,
bidirectional message pipe.

## OCPP-J (Part 4)

WebSocket only carries opaque messages. **OCPP-J** (Part 4 of the spec) defines
what goes inside them. Every OCPP message is a JSON array with a leading number
that says what kind of message it is.
- A request (**Call**) looks like `[2, messageId, action, payload]`.
- A successful response (**CallResult**) looks like `[3, messageId, payload]`.
- An error (**CallError**) looks like `[4, messageId, errorCode, errorDescription, errorDetails]`.

The `messageId` is what ties a response (CallResult, CallError) back to its request
(Call), which is why a response echoes the id the Call chose.

## OCPP application layer (Part 2)

At the top is the protocol everyone means when they say "[OCPP](/blog/what-is-ocpp)". It defines the actual
messages and their rules according to Part 2 of the specification. BootNotification,
Authorize, TransactionEvent, MeterValues, Reset and the rest all live here, each with
its fields, enums and requirements. Most articles in this series are really about this
layer. Everything below it just gets the JSON safely from one side to the other.

## The three security profiles

OCPP 2.0.1 defines exactly three security profiles, and a station and CSMS use
one of them at a time. They differ in how each side is authenticated and whether
the channel is encrypted:

| Profile | Station authenticated by | CSMS authenticated by | Channel |
| --- | --- | --- | --- |
| 1. Unsecured Transport with Basic Authentication | HTTP Basic Auth | not authenticated | unencrypted (`ws://`) |
| 2. TLS with Basic Authentication | HTTP Basic Auth | server certificate | TLS (`wss://`) |
| 3. TLS with Client Side Certificates | client certificate | server certificate | TLS (`wss://`) |

So TLS comes into play with **profiles 2 and 3**. Profile 1 runs over plain
`ws://` with only HTTP Basic Authentication for the station, which means the
CSMS is not authenticated and the traffic is not encrypted. The spec is blunt
about this: profile 1 should only be used on trusted networks (for instance with
a VPN between station and CSMS), and for field operation a TLS profile is
strongly recommended. Running OCPP 2.0.1 with no security at all (sometimes referred to
as profil 0) is technically possible but is explicitly not a valid OCPP 2.0.1 implementation.

Which profile a station runs is not only a transport question. It also decides
how much work it takes to point that station at a different backend later, from
three text fields to a certificate signing ceremony. That is the subject of
[migrating a charge point to a new CSMS](/blog/csms-migration-security-profiles).

## Where this series goes next

Knowing the stack, now it's time to understand [how the WebSocket connection is actually
established, from the HTTP upgrade to the subprotocol negotiation](/blog/ocpp-websocket-connection).
That is the subject of the next article.
