---
title: "The OCPP 2.0.1 BootNotification"
date: 2026-05-24
description: "The very first message a charging station sends after it connects: the boot reason, the hardware it reveals, and the clock sync hiding in the response."
tags: [ocpp, boot, websocket]
---

When a charging station opens its [OCPP-J WebSocket](/blog/ocpp-protocol-stack) to the CSMS, the first
application message it sends is almost always a **BootNotification**. It is the
station introducing itself, and it is the single richest message for figuring
out *what* just connected to your bench.

## The request

A BootNotification request carries a `reason` and a `chargingStation` object:

```json
[2, "9f1c2d3e-4b5a-4c6d-8e7f-0a1b2c3d4e5f", "BootNotification", {
  "reason": "PowerUp",
  "chargingStation": {
    "model": "CBOX 01",
    "vendorName": "MyBox",
    "serialNumber": "SN-000123",
    "firmwareVersion": "1.4.2",
    "modem": { "iccid": "…", "imsi": "…" }
  }
}]
```

### What the reason tells you

The `reason` is a `BootReasonEnumType`, and it is the station telling you *why*
it just booted. The values you will actually care about on the bench:

- **PowerUp**: a cold start (e.g. mains power returned).
- **RemoteReset**: the station rebooted after a `Reset` command from the CSMS.
- **FirmwareUpdate**: it just came back from flashing new firmware.
- **ScheduledReset**: a `Reset` with type `OnIdle` that the station deferred
  while a transaction was still running, then carried out once the connector
  went idle.
- **ApplicationReset**: the OCPP application itself crashed and restarted.
- **Watchdog**: the application hung, the watchdog timer elapsed, and the OS
  killed and restarted it.

Those last two are the interesting ones. A station that reports `Watchdog` or
`ApplicationReset` every few hours is not having a good time, and the boot
reason is often the only breadcrumb you get. If you are chasing a reconnect
loop, this field is the first thing to read.

## The response

The CSMS answers with a CallResult carrying `status`, `currentTime` and
`interval`:

```json
[3, "9f1c2d3e-4b5a-4c6d-8e7f-0a1b2c3d4e5f", {
  "status": "Accepted",
  "currentTime": "2026-07-15T09:00:00Z",
  "interval": 300
}]
```

### currentTime: the station's first clock sync

It is easy to skim past `currentTime`, but it is doing real work. It is the
CSMS's current wall-clock time, and for many stations it is the *first*
accurate time they have after booting.

A charge point without a battery-backed RTC has no idea what time it is when it
comes up from a power cycle (its clock starts from some firmware default).
Until it learns the real time, every timestamp it produces (transaction
start/stop, meter values, log entries) is wrong. The `currentTime` in the
BootNotificationResponse is where it fixes that: when the station is configured
to take its time from the CSMS, it synchronizes its internal clock to this
value (OCPP 2.0.1 B01.FR.06) and then keeps it in sync through the
`currentTime` in every subsequent HeartbeatResponse.

So a BootNotification is not just a "hello!". For an RTC-less station it is also
the moment its clock becomes trustworthy. If transaction timestamps on the
bench look decades off, check that the station is actually applying this value.

### What interval means (it depends on status)

The meaning of `interval` changes with `status`:

- **Accepted**: the station is registered. `interval` is the heartbeat period
  in seconds.
- **Pending**: the CSMS wants to configure the station before accepting it.
  `interval` is how long to wait before sending the next BootNotification.
- **Rejected**: the station must wait `interval` seconds and try again.

## Why it matters on the bench

Because the BootNotification is where firmware bugs surface first. A model name
that does not match the label, a serial number that changes across reboots, a
firmware string that never updates after a flash, a clock that never gets set.
All of it shows up here, before a single transaction has run. Watch this
message to identify incorrect charge point behavior early.
