import {
  CONTACTS,
  CONTACT_FOR_SITUATION,
  SOURCES,
  SITUATION_LABEL,
  type ContactRecord,
  type SituationId,
  type SourceRecord,
} from "./corpus";

/** Minimum keyword score required before any legal explanation is composed. */
export const MIN_RETRIEVAL_SCORE = 2;

export type SafetyKind =
  | "immediate_danger"
  | "minor"
  | "self_harm"
  | "weak_retrieval"
  | "out_of_scope";

export interface SafetyResult {
  kind: "safety";
  safetyKind: SafetyKind;
  title: string;
  body: string;
  contacts: ContactRecord[];
  showHumanVerification: boolean;
}

export interface ActionResult {
  kind: "action";
  situation: SituationId;
  situationLabel: string;
  understood: string;
  lawMayRecognize: string;
  nextSteps: string[];
  contacts: ContactRecord[];
  source: SourceRecord;
  /** True when this card came from the stored offline copy, not live composition. */
  offline?: boolean;
}

export type NavigatorResult = SafetyResult | ActionResult;

/**
 * Test-visible counters. They prove the safety pre-check short-circuits before
 * any corpus retrieval or legal composition happens.
 */
export const PIPELINE_TELEMETRY = {
  retrievalCalls: 0,
  compositionCalls: 0,
  reset() {
    PIPELINE_TELEMETRY.retrievalCalls = 0;
    PIPELINE_TELEMETRY.compositionCalls = 0;
  },
};


const DANGER_PATTERNS = [
  "right now",
  "happening now",
  "he is here",
  "they are here",
  "outside my door",
  "breaking the door",
  "with a knife",
  "knife",
  "gun",
  "pistol",
  "weapon",
  "bleeding",
  "choking",
  "strangl",
  "he will kill",
  "they will kill",
  "kill me",
  "going to kill",
  "help me now",
  "trying to kill",
];

const MINOR_PATTERNS = [
  "i am 1",
  "i'm 1",
  "im 1",
  "i am under 18",
  "under 18",
  "underage",
  "minor",
  "school student",
  "class 9",
  "class 10",
  "years old",
];

const SELF_HARM_PATTERNS = [
  "kill myself",
  "end my life",
  "suicide",
  "suicidal",
  "hurt myself",
  "harm myself",
  "overdose",
  "took pills",
  "cut myself",
  "not want to live",
  "don't want to live",
  "dont want to live",
];

const MINOR_AGE_RE = /\b(?:i am|i'm|im|age|aged)\s*(\d{1,2})\b/;

function normalize(input: string) {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

function statedMinorAge(text: string): boolean {
  const m = MINOR_AGE_RE.exec(text);
  if (!m) return false;
  const age = Number(m[1]);
  return age > 0 && age < 18;
}

/** Runs BEFORE any generation. Returns a fixed message result, or null. */
export function safetyPreCheck(rawInput: string): SafetyResult | null {
  const text = normalize(rawInput);

  if (SELF_HARM_PATTERNS.some((p) => text.includes(p))) {
    return {
      kind: "safety",
      safetyKind: "self_harm",
      title: "You deserve support right now",
      body: "This screen does not offer legal information. If you are thinking about harming yourself, or if there is a medical emergency, trained people can talk with you. Emergency medical services and a helpline are listed below as options. You decide whether and when to use them.",
      contacts: [CONTACTS.rescue, CONTACTS.pcsw],
      showHumanVerification: true,
    };
  }

  if (statedMinorAge(text) || MINOR_PATTERNS.some((p) => text.includes(p))) {
    return {
      kind: "safety",
      safetyKind: "minor",
      title: "This part of the app is for adults",
      body: "It looks like this may involve someone under 18. This tool is built for adults, so it will not continue with the adult flow, and it will not ask for any further private details. Services that work specifically with young people are listed below.",
      contacts: [CONTACTS.child, CONTACTS.police, CONTACTS.rescue],
      showHumanVerification: true,
    };
  }

  if (DANGER_PATTERNS.some((p) => text.includes(p))) {
    return {
      kind: "safety",
      safetyKind: "immediate_danger",
      title: "If you are in immediate danger",
      body: "This screen shows options only. It cannot send help, and no one is contacted unless you choose to contact them. If it is safe for you to make a call, these emergency numbers are available. If calling is not safe, nothing here requires you to call.",
      contacts: [CONTACTS.police, CONTACTS.rescue],
      showHumanVerification: false,
    };
  }

  return null;
}

interface Scored {
  source: SourceRecord;
  score: number;
}

function retrieve(text: string): Scored[] {
  PIPELINE_TELEMETRY.retrievalCalls += 1;
  if (!Array.isArray(SOURCES) || SOURCES.length === 0) {
    throw new Error("corpus unavailable");
  }
  return SOURCES.map((source) => {
    const score = source.keywords.reduce(
      (acc, kw) => (text.includes(kw) ? acc + 1 : acc),
      0,
    );
    return { source, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
}

function summarize(situation: SituationId): string {
  switch (situation) {
    case "domestic_violence":
      return "You described harm or mistreatment happening within your household.";
    case "movement_restriction":
      return "You described limits being placed on your ability to move freely or leave.";
    case "threats":
      return "You described threats or words used to frighten or pressure you.";
    case "workplace_harassment":
      return "You described unwelcome behaviour connected to your workplace.";
    case "cyber_harassment":
      return "You described harassment, pressure, or misuse of material happening online.";
  }
}

const OUT_OF_SCOPE: SafetyResult = {
  kind: "safety",
  safetyKind: "out_of_scope",
  title: "This is outside what this tool covers",
  body: "This tool only covers five situations in Punjab: violence at home, movement restriction or confinement, threats or intimidation, workplace harassment, and online harassment or blackmail. What you described does not clearly fall into one of them, and it will not be forced into a category. A general support line can help point you elsewhere.",
  contacts: [CONTACTS.pcsw],
  showHumanVerification: true,
};

export const WEAK_RETRIEVAL: SafetyResult = {
  kind: "safety",
  safetyKind: "weak_retrieval",
  title: "Not enough reliable information",
  body: "", // filled from corpus constant at render time
  contacts: [CONTACTS.pcsw],
  showHumanVerification: true,
};

/**
 * Fully static, dependency-free Action Card. Used when composition fails but a
 * situation was still identified, so the reader always lands on something
 * usable instead of a blank or broken screen.
 */
export function offlineActionCard(situation: SituationId): ActionResult {
  const source = SOURCES.find((s) => s.topic === situation);
  const fallbackSource: SourceRecord = source ?? {
    id: "src_offline",
    document_title: "Stored offline reference (demo record)",
    jurisdiction: "Punjab, Pakistan",
    provision: null,
    topic: situation,
    source_url: "https://punjablaws.gov.pk/",
    version_status: "Offline copy — text not reviewed",
    verified_on: null,
    review_status: "demo",
    organization: "Offline reference",
    plain_language:
      "A stored, general description of this kind of situation is shown because live information could not be prepared. It may be incomplete, and a qualified person would need to review the specific facts.",
    options: [],
    keywords: [],
  };

  return {
    kind: "action",
    situation,
    situationLabel: SITUATION_LABEL[situation],
    understood: summarize(situation),
    lawMayRecognize: fallbackSource.plain_language,
    nextSteps:
      fallbackSource.options.length > 0
        ? fallbackSource.options
        : [
            "Some people call a women's helpline to ask what their options generally are.",
            "Some people wait until they can speak with a qualified legal professional.",
          ],
    contacts: (CONTACT_FOR_SITUATION[situation] ?? ["pcsw"]).map((id) => CONTACTS[id]),
    source: fallbackSource,
    offline: true,
  };
}

function compose(best: Scored): ActionResult {
  PIPELINE_TELEMETRY.compositionCalls += 1;
  const situation = best.source.topic;
  return {
    kind: "action",
    situation,
    situationLabel: SITUATION_LABEL[situation],
    understood: summarize(situation),
    lawMayRecognize: best.source.plain_language,
    nextSteps: best.source.options,
    contacts: CONTACT_FOR_SITUATION[situation].map((id) => CONTACTS[id]),
    source: best.source,
  };
}

export function analyze(rawInput: string): NavigatorResult {
  const pre = safetyPreCheck(rawInput);
  if (pre) return pre;

  const text = normalize(rawInput);
  const hits = retrieve(text);

  if (hits.length === 0) return OUT_OF_SCOPE;

  const best = hits[0];
  if (!best) return OUT_OF_SCOPE;
  const second = hits[1];
  const contradictory = second ? best.score - second.score === 0 : false;

  if (best.score < MIN_RETRIEVAL_SCORE || contradictory) {
    return WEAK_RETRIEVAL;
  }

  return compose(best);
}

/**
 * Navigation-safe entry point used by the UI.
 *
 * Guarantees a renderable result:
 *  - safety pre-check results pass through untouched;
 *  - if retrieval throws, the weak-retrieval message is shown;
 *  - if composition throws after a situation was identified, the stored
 *    offline Action Card is shown.
 * It never throws, so navigation can never break on a failure.
 */
export function analyzeSafely(
  rawInput: string,
  opts?: { forceOffline?: boolean },
): NavigatorResult {
  let pre: SafetyResult | null = null;
  try {
    pre = safetyPreCheck(rawInput);
  } catch {
    // Fail closed: never compose legal content when the pre-check is unusable.
    return WEAK_RETRIEVAL;
  }
  if (pre) return pre;

  const text = normalize(rawInput);

  let hits: Scored[];
  try {
    hits = retrieve(text);
  } catch {
    return WEAK_RETRIEVAL;
  }

  const best = hits[0];
  if (!best) return OUT_OF_SCOPE;
  const second = hits[1];
  if (best.score < MIN_RETRIEVAL_SCORE || (second && best.score === second.score)) {
    return WEAK_RETRIEVAL;
  }

  if (opts?.forceOffline) return offlineActionCard(best.source.topic);

  try {
    return compose(best);
  } catch {
    return offlineActionCard(best.source.topic);
  }
}

/** Seeded demo inputs — one per approved corpus topic. */
export const DEMO_SCENARIOS: { id: SituationId; label: string; input: string }[] = [
  {
    id: "domestic_violence",
    label: "Violence at home",
    input: "My husband hits me at home and my in-laws say nothing about the abuse.",
  },
  {
    id: "movement_restriction",
    label: "Movement restriction",
    input:
      "They locked the door and took my phone, I am not allowed to leave the house.",
  },
  {
    id: "threats",
    label: "Threats",
    input: "He threatened me and warned me that he will take revenge.",
  },
  {
    id: "workplace_harassment",
    label: "Workplace harassment",
    input: "My manager at the office keeps making comments and HR ignores it at work.",
  },
  {
    id: "cyber_harassment",
    label: "Online harassment",
    input:
      "Someone online is blackmailing me and says they will leak my photos on facebook.",
  },
];

