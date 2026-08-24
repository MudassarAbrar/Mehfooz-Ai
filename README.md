# Mehfooz
*(محفوظ‎ — "protected / safe")*

### Safe Reporting & Legal Aid Assistant for Gender-Based Violence

**Product Requirements Document**
Hackathon Build — MVP Scope: Punjab, Pakistan
Version 1.0

> ⚠ **Content Notice**
> This document describes a product concept for a hackathon. Legal content described here is illustrative and has not been vetted by a licensed Pakistani lawyer or legal aid organization. No real legal advice should be given to a real user until that vetting occurs.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Empathy & Voice Guidelines](#4-empathy--voice-guidelines)
5. [Core Features](#5-core-features)
6. [AI & RAG Design](#6-ai--rag-design)
7. [Technical Architecture](#7-technical-architecture)
8. [Security & Safety Design](#8-security--safety-design)
9. [Risks & Mitigations](#9-risks--mitigations)
10. [Roadmap](#10-roadmap)
11. [Appendix](#11-appendix)

---

## 1. Executive Summary

Mehfooz is a mobile app, disguised as an ordinary weather app, that gives survivors of domestic violence and harassment in Punjab, Pakistan a private, judgment-free way to understand their legal rights, document evidence safely, and find real help — without ever having to say the words "abuse" or "domestic violence" out loud, type them where someone might see, or open an app that visibly identifies what it is.

A user describes what is happening to them, in their own words, by text or voice, in English or Urdu. An AI assistant grounded on actual Punjab law (primarily the Punjab Protection of Women Against Violence Act, 2016) explains — in plain, non-legal language — what their rights are and what steps they can realistically take. The same app lets them log incidents (photos, notes, timestamps) into an encrypted, on-device vault that never leaves their phone, and connects them to real legal aid organizations and helplines near them.

The hackathon MVP proves three things end-to-end: (1) the disguise and panic-exit UX genuinely feels safe to use, (2) the AI's legal answers are accurate and grounded — not hallucinated — for a narrow, well-defined slice of Punjab law, and (3) the whole experience can be built for $0 in infrastructure cost using free-tier tools, which matters both for the demo budget and for future sustainability as a nonprofit-adjacent product.

---

## 2. Problem Statement

### 2.1 The Problem

Survivors of domestic violence, harassment, and abuse in Pakistan face compounding barriers before they ever reach a lawyer or a police station:

- **Fear of retaliation** — from an abuser, from family, or from community, if it becomes known that they are seeking help.
- **Legal illiteracy** — most survivors do not know that protections like the Punjab Protection of Women Against Violence Act, 2016 exist, what a protection order is, or how to start the process.
- **No judgment-free first point of contact** — the first conversation about abuse is often the hardest, and it usually has to happen with a stranger (a police officer, a helpline operator) before any legal reasoning even begins.
- **Provincial fragmentation** — the relevant law, procedure, and even the responsible authority differ by province, which a generic FAQ page or search engine cannot resolve for an individual's specific situation.
- **Surveillance risk** — for many survivors, an abuser has access to their phone. An app that visibly says "domestic violence helpline" on the home screen can itself be dangerous to have installed.

### 2.2 Why AI Is Necessary, Not Optional

A static FAQ or a helpline phone number cannot translate a person's messy, emotional, non-legal description of their situation ("he took my phone and won't let me leave the house when his family visits") into a specific, grounded answer ("this may qualify as domestic violence under Section X; you may be eligible to apply for a protection order or residence order"). That translation requires reasoning over legal text conditioned on the specifics of a real, individual account — which is exactly what a retrieval-augmented LLM is suited for, and a rules-based chatbot or keyword search is not.

### 2.3 Target Users

| User | Need |
|---|---|
| **Primary:** women and vulnerable individuals experiencing abuse or harassment in Punjab | A private, safe first step — understanding rights and options without exposure or judgment |
| **Secondary:** legal aid NGOs (e.g. Digital Rights Foundation, War Against Rape, Bedari) | A qualified, pre-informed referral — someone who already understands their basic options before contact |
| **Tertiary:** hackathon judges (for this build) | Evidence of technical execution, sensitivity of framing, and real-world viability |

---

## 3. Goals & Success Metrics

### 3.1 Hackathon Goals

- Demonstrate a working disguised-app interface with a credible, convincing weather-app cover and a discoverable-only-if-you-know exit into the real app.
- Demonstrate a RAG pipeline grounded on real Punjab legal text that gives accurate, specific, non-hallucinated answers to a small set of realistic test scenarios.
- Demonstrate encrypted, on-device evidence logging with a working panic/quick-exit gesture.
- Demonstrate a legal aid matching flow using a mock directory, in both English and Urdu.
- Present the above with a tone and framing that lands as respectful and serious to judges, not exploitative or sensationalized.

### 3.2 Success Metrics (Post-Hackathon / Roadmap)

| Metric | MVP Target (demo) | Phase 2 Target (post-hackathon) |
|---|---|---|
| Legal answer accuracy (spot-checked against source law) | 100% on demo scenario set (small, curated) | >95% on an expanded, NGO-vetted test set |
| Time from app open to first useful answer | < 60 seconds in demo | < 30 seconds in production, incl. voice |
| Disguise credibility | Passes a "shoulder surf" test with judges | User-tested with real target-population feedback |
| Legal aid referral completion | N/A (mock data) | Tracked opt-in handoffs to partner NGOs |

### 3.3 Non-Goals (Explicitly Out of Scope for MVP)

- Real, production legal advice to real users — legal content is illustrative only until vetted by a licensed lawyer or partner NGO.
- Coverage of provinces other than Punjab.
- Direct emergency/police dispatch integration.
- Account systems, cloud user profiles, or any server-side storage of personal/incident data.
- Production-grade uptime, scale, or security certification (e.g. no formal penetration testing at MVP stage).

---

## 4. Empathy & Voice Guidelines

How the app talks to someone is as important as what it tells them. A user opening this app is very likely frightened, ashamed, exhausted, or in active danger. Every screen, prompt, and AI response must be designed around that reality.

### 4.1 Tone Principles

- Never assume or name the user's emotional state ("you must be so scared") — instead, create space for them to say what they feel, and reflect back only what they actually say.
- Never use clinical, bureaucratic, or procedural language as a first response ("please file form X") — lead with orientation and reassurance, then information.
- Never minimize ("that doesn't sound too serious") and never catastrophize ("you are in extreme danger") — let the user's own words set the frame, and let the law, not the AI's judgment, characterize severity.
- Always give the user control: every screen offers a clear way to stop, exit, or go back — the app should never make someone feel trapped in a flow.
- Always disclose the AI's limits in plain language at the first legal answer: this is general information grounded in the law, not a lawyer's advice, and a human lawyer or NGO can help further.
- Default to calm, unhurried pacing — short paragraphs, no exclamation marks, no urgency-manufacturing design patterns (no countdown timers, no "act now" language).

### 4.2 Sample Interaction Shape

**User** (typed, English): *"he took my phone and says I can't leave the house when his family is visiting, this has been going on for months"*

**Assistant** (illustrative shape, not final copy): Acknowledges what was shared in the user's own terms → names, in plain language, that this pattern is recognized under Punjab law (which section, in one sentence) → offers 2–3 concrete next-step options (e.g., protection order, residence order, contacting a specific NGO) → offers to log this as a timestamped entry → reminds the user they are in control of what happens next and that this is general information, not a replacement for a lawyer.

### 4.3 Safety-by-Design UX Requirements

- Quick-exit gesture (e.g., shake, or tap a specific corner) instantly returns to the fake weather-app view from anywhere in the real app.
- The app icon, name, and app-switcher preview all show the weather-app cover at all times — the real app is never visible in a recent-apps screenshot.
- No push notifications reveal real app content — if notifications are used at all, they are disguised as weather alerts.
- A PIN/biometric or a specific gesture sequence is required to reach the real app from the weather-app cover — not a visible button.

---

## 5. Core Features

Features are prioritized **P0** (must exist for the hackathon demo to work), **P1** (strengthens the demo and pitch if time allows), **P2** (roadmap, not attempted at the hackathon).

| Priority | Feature | Description |
|---|---|---|
| P0 | Disguised weather-app cover | Real, functional-looking weather UI (can use a free weather API or static mock data) with a hidden gesture-based entry point into the real app. |
| P0 | Text-based legal rights chat | User describes their situation in free text (English or Urdu); AI responds with grounded, plain-language rights and options via RAG over Punjab law. |
| P0 | Encrypted on-device evidence log | User can attach a note, photo, and timestamp to a logged incident; entries are encrypted at rest and never transmitted off-device. |
| P0 | Quick-exit gesture | One motion/tap instantly returns to the weather-app cover from any screen in the real app. |
| P0 | Mock legal aid directory | A small, hardcoded list of legal aid contacts/helplines for Punjab, filterable by category (legal, shelter, counselling, police). |
| P1 | Voice input (Speech-to-Text) | User can speak their situation instead of typing, using the device's built-in STT — important for users who cannot safely type or have low literacy. |
| P1 | Urdu language support (full) | Both the chat interface and AI responses fully support Urdu, not just English, given the target population. |
| P1 | PIN / biometric lock on real app | An additional layer beyond the gesture, so a glance at an unlocked phone doesn't reveal the real app either. |
| P2 | Real legal aid NGO integration | Live handoff (with consent) to a partner NGO's actual intake system, not a static contact list. |
| P2 | Multi-province legal coverage | Expand the RAG corpus to cover Sindh, KP, Balochistan, and Islamabad Capital Territory law. |
| P2 | Offline-first mode | Cached responses and offline evidence logging for low-connectivity areas. |
| P2 | Secure cloud backup (opt-in, user-controlled key) | Optional encrypted backup of the evidence vault so evidence survives a lost or confiscated phone. |

---

## 6. AI & RAG Design

### 6.1 Why RAG, Specifically

The core AI risk in this product is hallucination — an LLM confidently inventing a legal right or procedure that does not exist. Because the answers here can shape a real decision someone makes about their safety, the assistant is not allowed to answer from general knowledge alone. Every legal claim it makes must be traceable to a specific passage in the retrieved source law.

### 6.2 MVP Legal Corpus (Punjab)

- Punjab Protection of Women Against Violence Act, 2016 (primary source — defines domestic violence, protection orders, residence orders, and the role of the Violence Against Women Centres).
- Protection Against Harassment of Women at the Workplace Act, 2010 (as amended) — for harassment scenarios outside the home.
- A curated, plain-language summary sheet of relevant Pakistan Penal Code sections (e.g. those covering assault, criminal intimidation, stalking) — used only to point the user toward the concept, always with a disclaimer that a lawyer should confirm applicability.

These are the 2–3 source documents referenced in the original project brief; all three are short enough to be used as the full RAG corpus for a hackathon MVP.

### 6.3 Pipeline (MVP)

1. **Ingest:** the 2–3 source legal documents are cleaned and chunked (by section/clause, not fixed character count, so legal structure is preserved).
2. **Retrieve:** given the user's free-text account, the system retrieves the most relevant clauses (embedding similarity search).
3. **Ground & generate:** the LLM is prompted to answer using only the retrieved clauses, explicitly instructed to say "I'm not sure" rather than infer beyond the provided text, and to cite which clause each claim is based on internally (for later human review, not necessarily shown to the user verbatim).
4. **Disclaim:** every response is appended with a short, consistent reminder that this is general information, not legal advice, and names a way to reach a real lawyer or NGO.

### 6.4 Guardrails

- System prompt explicitly forbids the model from inventing procedures, deadlines, fees, or outcomes not present in the retrieved text.
- Responses are scoped to information and options — the assistant does not tell the user what decision to make (e.g., "you should leave him"), only what their legal options are.
- A fixed, tested set of crisis-language triggers (e.g. explicit statements of suicidal intent or immediate physical danger) routes the user to an immediate, hardcoded safety message and emergency contacts, bypassing the LLM entirely for that turn — this must never depend solely on model judgment.
- All demo scenarios used in front of judges are pre-tested end-to-end so the live legal answers shown are verified accurate, not improvised on the spot.

---

## 7. Technical Architecture

### 7.1 Architecture Overview

The system is split into two independent halves on purpose: a cloud-connected reasoning path (legal Q&A) and a fully offline, on-device path (evidence vault). This split means the most sensitive data a user can generate — photographic evidence of abuse — never has to touch a network at all, while the legal-reasoning half stays simple enough to build inside a hackathon window.

**System Diagram (component flow)**

```
[ Weather-App Cover UI ]
        │  (gesture / PIN)
        ▼
[ Mehfooz Real App — Expo / React Native ]
        │
        ├── Legal Assistant Flow ──────────────────────────────┐
        │    (text or voice input)                             │
        │         ▼                                             │
        │    Device STT (native / Web Speech API) → transcript  │
        │         ▼                                             │
        │    Serverless backend (Vercel / Supabase Edge Fn)      │
        │         ▼                                             │
        │    RAG retrieval (Supabase pgvector, or in-context     │
        │    stuffing of the 2–3 short legal source docs)        │
        │         ▼                                             │
        │    LLM API call (grounded prompt + retrieved clauses)  │
        │         ▼                                             │
        │    Response + disclaimer → rendered in chat UI         │
        └─────────────────────────────────────────────────────┘
        │
        ├── Evidence Vault Flow (fully on-device, no network) ──┐
        │    Photo / note / timestamp → local encryption         │
        │    (expo-secure-store + expo-file-system, AES)          │
        │         ▼                                             │
        │    Encrypted local vault (device storage only)         │
        └─────────────────────────────────────────────────────┘
        │
        └── Legal Aid Directory Flow ────────────────────────┐
             Local JSON directory (MVP) → filter → display     │
             (Phase 2: live NGO intake API integration)         │
             ──────────────────────────────────────────────────┘
```

**Separate marketing website**

A static informational website (not the disguised app) explains what Mehfooz is, who it's for, and how to get the real app — this is the only place the product's real purpose is stated openly, aimed at NGOs, press, and people researching the app in a safe context (e.g. a library computer), not at survivors browsing on a monitored device.

### 7.2 Component & Stack Summary

| Layer | Choice (hackathon, free tier) | Why |
|---|---|---|
| Mobile app | Expo (React Native) | Cross-platform from one codebase; free; instant QR-code demo for judges without an app-store build |
| Legal LLM | Sponsor-provided API credits, or a free-tier model (e.g. Gemini free tier) | Zero cost; sufficient quality for grounded, narrow-domain Q&A |
| RAG retrieval | In-context stuffing of the 2–3 short legal docs, or Supabase pgvector if time allows | The MVP corpus is small enough that a vector DB is optional, not required |
| Backend | Vercel serverless function / Supabase Edge Function | Free tier, no server to manage, fast to deploy |
| Speech-to-Text | Native OS STT / Web Speech API | Free, zero integration cost, no API key needed |
| Evidence vault | expo-secure-store + expo-file-system (local AES encryption) | No backend at all; strongest privacy story; free |
| Legal aid directory | Static local JSON | Zero cost; sufficient for a demo; trivial to replace with a live API in Phase 2 |
| Marketing website | Static site on Vercel/Netlify free tier | Free, fast, no maintenance burden |

### 7.3 Data Flow & Privacy Boundaries

- Chat text sent to the LLM API is used only for that single request/response — no server-side conversation history is persisted by the app backend.
- Evidence (photos, notes) never leaves the device under any MVP flow — there is no upload endpoint for it at all in this version.
- The legal aid directory is static, local data — no query the user makes is transmitted to any third party.
- No analytics SDK is used in the MVP that would create a record of app usage tied to a device or user identity.

---

## 8. Security & Safety Design

### 8.1 Threat Model (MVP-level)

| Threat | Mitigation |
|---|---|
| Abuser physically inspects the phone / app list | Weather-app cover; disguised icon and name; no visible "real" app anywhere in the OS |
| Abuser looks at app while it's open ("shoulder surfing") | Quick-exit gesture returns instantly to the cover from any screen |
| Abuser checks the app-switcher / recent-apps screen | Real app view is excluded from screenshots/previews (native OS privacy flag) |
| Phone is confiscated or searched later | Evidence vault is encrypted at rest; PIN/biometric gate on the real app |
| Network interception of legal chat traffic | HTTPS/TLS for all API calls (standard, non-optional) |
| AI gives a wrong or invented legal answer | RAG grounding, explicit "I don't know" instruction, pre-tested demo scenarios, human legal review before any real deployment |
| User is in active, immediate danger | Fixed keyword-triggered safety message + emergency contacts, bypassing the LLM |

### 8.2 What This MVP Explicitly Does Not Cover

- No formal security audit or penetration test — required before any real deployment.
- No protection against a sophisticated, technically capable abuser (e.g. spyware already installed on the device) — out of scope for a hackathon build.
- No legal liability review — the disclaimers in this document are a design placeholder, not a substitute for actual legal sign-off on the product's liability posture.

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| LLM hallucinates a legal claim during the live demo | High — undermines credibility and could misinform in production | Pre-test and lock the exact demo scenarios; RAG grounding; explicit "I don't know" instruction |
| Demo framing reads as exploitative or sensationalized to judges | High — damages reception despite strong technical execution | Lead with respect and restraint in the pitch; use a fictional, clearly-labeled scenario; avoid graphic detail |
| Disguise mechanism is unconvincing or easily discovered | Medium — core safety premise weakened | User-test the cover with people unfamiliar with the app before the demo |
| Free-tier API limits are hit during judging (many demo runs) | Medium — demo could fail live | Cache/pre-record a fallback response set; test rate limits in advance |
| Legal content is inaccurate or incomplete | High in production, lower for a labeled hackathon demo | Explicit disclaimers; narrow, curated scenario set; roadmap requires NGO/lawyer vetting before real use |
| Team builds a feature that isn't achievable in the hackathon window | Medium — wasted time | Strict P0/P1/P2 prioritization (Section 5); cut P1/P2 first if behind schedule |

---

## 10. Roadmap

### 10.1 Phase 1 — Hackathon MVP (this document)

Scope as described in Sections 5–8: Punjab-only, English + Urdu, disguised weather-app cover, RAG over 2–3 laws, on-device evidence vault, mock legal aid directory, $0 infrastructure.

### 10.2 Phase 2 — Pilot-Ready (0–6 months post-hackathon)

- Legal content vetted and signed off by a licensed Pakistani lawyer and/or a partner NGO (Digital Rights Foundation, War Against Rape, or Bedari).
- Replace the mock legal aid directory with a real, maintained partner network, with consent-based warm handoff.
- Formal security review, including a third-party assessment of the disguise mechanism and encryption implementation.
- User research with real members of the target population (via an NGO partner, never direct recruitment of survivors by the product team) to validate the disguise, tone, and flow.
- Optional, user-controlled encrypted cloud backup for the evidence vault, so evidence isn't lost if the phone is destroyed or confiscated.

### 10.3 Phase 3 — Scale (6–18 months)

- Expand legal coverage to Sindh, Khyber Pakhtunkhwa, Balochistan, and Islamabad Capital Territory.
- Offline-first support for low-connectivity areas.
- Explore funding from UN Women, international development grants, or NGO partnership funding, given the clear social mandate and non-commercial nature of the product.
- Formal impact evaluation in partnership with an academic or NGO research partner.

### 10.4 Explicit Guardrail for All Future Phases

No phase of this roadmap involves the product team independently recruiting, interviewing, or collecting data from real abuse survivors outside of a properly consented, NGO-supervised research process. This is a firm constraint, not a nice-to-have.

---

## 11. Appendix

### 11.1 Demo Script Outline (for judges)

1. Open on the marketing website — 30 seconds explaining the problem and who Mehfooz is for.
2. Show the phone with only the weather-app icon visible — emphasize that this is what an abuser would see.
3. Perform the entry gesture live — reveal the real app.
4. Walk through one fictional, clearly-labeled scenario: type or speak a situation → show the grounded legal response → show the citation/disclaimer → log it as evidence.
5. Demonstrate the quick-exit gesture live, mid-flow, to show the safety mechanism under simulated pressure.
6. Show the legal aid directory with mock Punjab contacts, filtered by category.
7. Close by explicitly naming what is NOT yet real: legal content is unvetted, directory is mock data, and both require NGO/legal partnership before any real deployment.

### 11.2 Suggested Pitch Framing

Lead with the barrier, not the technology: most teams will pitch their AI stack first. This pitch should lead with why reporting is so hard today in Punjab, then show how each design decision — the disguise, the grounded legal answers, the on-device-only evidence — responds directly to a specific, named barrier from Section 2.

### 11.3 Key Disclaimers (to state explicitly to judges)

- Legal content shown in the demo is illustrative and has not been reviewed by a licensed lawyer.
- The legal aid directory uses mock/placeholder contact data for the demo, not real, verified NGO contacts.
- This is a hackathon prototype, not a deployed product; real deployment requires the Phase 2 vetting described in Section 10.2 before any real user relies on it.

### 11.4 Glossary

| Term | Meaning |
|---|---|
| RAG (Retrieval-Augmented Generation) | An AI technique where the model's answer is grounded in specific retrieved documents (here, real law text) rather than generated purely from its own training. |
| Protection order | A court order under the Punjab Protection of Women Against Violence Act, 2016 restricting an abuser's contact with or proximity to a survivor. |
| Residence order | A court order under the same Act addressing who may remain in or must leave a shared residence. |
| Panic / quick-exit gesture | A UX pattern that instantly hides a sensitive app behind an innocuous cover, used across safety-focused apps for survivors of abuse. |
