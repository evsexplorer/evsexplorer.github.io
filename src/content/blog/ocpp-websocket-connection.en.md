---
title: "How a charging station opens its OCPP-J WebSocket connection"
date: 2026-05-17
description: "The connection URL, the HTTP upgrade and subprotocol negotiation, HTTP Basic Auth and TLS across the three security profiles, and how the connection is kept alive and re-established."
tags: [ocpp, websocket, transport]
---

Before a single OCPP message flows, the charging station has to open the
WebSocket connection to the CSMS. In the [protocol stack](/blog/ocpp-protocol-stack)
we saw where the WebSocket layer sits (on TCP, optionally wrapped in TLS). This
article walks through actually establishing that connection, with and without
TLS.

## Who connects to whom

The roles are fixed: the **CSMS is the WebSocket server** and the **charging
station is the client**. The station always initiates the connection, and it
opens an *outbound* TCP connection to the CSMS. That is deliberate, because an
outbound connection sidesteps NAT and firewalls on the station's side, and once
it is open the CSMS sends its own requests back over the very same socket. The
station keeps this one connection open for its whole session.

## The connection URL

The CSMS publishes an **OCPP-J endpoint URL**, which may be any `ws://` or
`wss://` URL. Its host and path are chosen by the CSMS: the path is typically
something like `/ocpp`, but it is not fixed, and the two examples below use
`/ocpp` and `/ocppj`. The station derives its own **connection URL** by
appending to that endpoint URL a `/` followed by its percent-encoded identity:

```
ws://csms.example.com/ocpp/CS001
wss://csms.example.com/ocppj/RDAM%20123
```

The identity in the path tells the CSMS which station is connecting. A few rules
apply to it: it is an `identifierString` of at most 48 characters, and it may
not contain a colon (`:`), because the same identity doubles as the HTTP Basic
Auth username and a colon separates username from password. The spec also
recommends that the CSMS not trust the URL alone, but cross-check the identity
against the station's credentials.

## The opening handshake

A WebSocket connection starts life as an ordinary HTTP `GET` that asks to be
upgraded (RFC 6455). A station's opening request looks like this:

```
GET /webServices/ocpp/CS3211 HTTP/1.1
Host: some.server.com:33033
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: ocpp2.0.1, ocpp1.6
Sec-WebSocket-Version: 13
```

The header that matters for OCPP is `Sec-WebSocket-Protocol`. It lists the OCPP
versions the station can speak, most preferred first, using the official
IANA-registered subprotocol names (`ocpp2.0.1` for 2.0.1, `ocpp1.6` for 1.6).
The example above offers 2.0.1 and falls back to 1.6.

If the CSMS accepts, it answers with `101 Switching Protocols` and echoes back
the single subprotocol it picked:

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
Sec-WebSocket-Protocol: ocpp2.0.1
```

Two failure cases are worth recognizing on the bench:

- If the CSMS does not recognize the station identity in the URL path, it should
  respond with **HTTP 404** and abort.
- If the CSMS does not agree to any offered subprotocol, it must finish the
  handshake **without** a `Sec-WebSocket-Protocol` header and then immediately
  close the connection. In other words, a `101` with no agreed subprotocol is
  really a rejection, not a success.

## Authentication and TLS: the three security profiles

Where authentication and encryption enter depends on the
[security profile](/blog/ocpp-protocol-stack) in use. The three profiles set up
the connection differently.

### Profile 1: plain ws:// with HTTP Basic Auth

No TLS. The station authenticates with **HTTP Basic Authentication** carried in
the `Authorization` header of the upgrade request. The username is the station
identity (the same string as in the URL), and the password is the
`BasicAuthPassword` configuration variable, a randomly chosen string of 16 to 40
characters. Because there is no TLS, those credentials are only base64-encoded,
which is effectively clear text, so profile 1 belongs on trusted networks (for
instance behind a VPN).

### Profile 2: wss:// (TLS) with HTTP Basic Auth

The station first completes a **TLS** handshake and validates the CSMS's server
certificate, and only then runs the same HTTP Basic Auth, now inside the
encrypted channel. So the CSMS is authenticated by its server certificate, the
station by Basic Auth, and the password is no longer exposed.

### Profile 3: wss:// (TLS) with a client certificate

Mutual TLS. During the TLS handshake the CSMS also asks for a client
certificate, and the station presents its own certificate to authenticate
itself. No Basic Auth is needed here, the client certificate takes its place.
Both ends are certificate-authenticated.

For the two TLS profiles the order is: open TCP, run the TLS handshake (with the
certificate checks), then do the HTTP upgrade with `Sec-WebSocket-Protocol`
(plus Basic Auth for profile 2), and only then is the WebSocket open. One
familiar caveat resurfaces here: a station whose clock is wrong cannot validate
the server certificate, because certificate validity is time-bounded.

## Keeping the connection alive

Once open, the socket stays open. WebSocket **Ping and Pong** frames keep it
that way: they let each side notice a dead peer or a network operator silently
dropping an idle connection. The station sends pings on the interval configured
in `WebSocketPingInterval`. Ping/Pong can stand in for most OCPP Heartbeats, but
it cannot carry the time synchronization a HeartbeatResponse does, so at least
one real Heartbeat a day is still recommended to keep the clock correct.

## When the connection drops: reconnect with back-off

When the connection is lost, the station must reconnect, and it must do so with
an **increasing back-off time plus randomization**. The randomization matters:
it stops a whole fleet from stampeding the CSMS the instant it comes back after
a restart.

The first retry waits `RetryBackOffWaitMinimum` seconds plus a random value up
to `RetryBackOffRandomRange`. Each failed attempt doubles the back-off (adding a
fresh random value each time) up to `RetryBackOffRepeatTimes` doublings, after
which the station keeps retrying at that last interval without increasing it
further.

There is a nice consequence for the next message in line. On reconnect the
station should **not** resend a
[BootNotification](/blog/ocpp-boot-notification) unless something in it has
actually changed, because the CSMS already matched the identity to the channel
the moment the connection was established.

## Watching this on your own bench

Everything above is observable from the CSMS side, but only if the CSMS keeps
the raw connection events and not just the OCPP messages that follow them. Two
things from this article are awkward to verify by hand.

**Was the attempt refused, and why?** A `101` with no agreed subprotocol looks
like a successful connection in most logs, and a station that vanishes three
seconds after connecting looks much like one that never arrived. What you want
is the refusal recorded as its own event, with a reason on it.

**Does the back-off actually back off?** `RetryBackOffWaitMinimum`, the doubling
and the random range are easy to implement slightly wrong and nearly impossible
to eyeball. Checking it means refusing the station while it retries, then
measuring the gaps between its attempts.

[EVSExplorer](/) records every connect, disconnect and refusal as a
[connection event you can read back](/#connection-stability), carrying the reason
(`unsupported_subprotocol`, `missing_auth`, `invalid_auth`,
`invalid_client_cert`, `profile_mismatch`), which end caused it, the security
profile the session negotiated, and even the `Sec-WebSocket-Key` from the
handshake above, so a session can be correlated against the station's own logs.
When the handshake does succeed, the negotiated sub-protocol ends up on the
station's [dashboard card](/#feature-live-dashboard), so you can check which
OCPP version it actually uses.

Blocking a station [closes its socket and refuses what follows](/#feature-websocket-control),
which is the back-off test:

```bash
# Close the current session and refuse every attempt that follows
curl -s -X POST $BASE/api/charge-points/CS001/block

# ...let it retry for a few minutes, then read the attempts back, newest first
curl -s "$BASE/api/charge-points/CS001/connection-events?limit=20" \
  | jq '.[] | {recordedAt, event, reason, originator, securityProfile}'

curl -s -X POST $BASE/api/charge-points/CS001/unblock
```

Each retry comes back as a `rejected` event with reason `blocked`, so the gaps
between their `recordedAt` timestamps show the back-off curve the station really
implements. Assert on those and you have a test that fails the day someone changes
the retry logic.

## Where this series goes next

With the socket open and authenticated, the station is finally ready to speak
OCPP. The very first application message it sends is the
[BootNotification](/blog/ocpp-boot-notification), and that is where the next
article picks up.
