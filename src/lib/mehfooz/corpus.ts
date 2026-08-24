/**
 * Mehfooz approved local corpus.
 *
 * DEMO DATA — all records below are fictional demo scenarios seeded for the MVP.
 * Nothing here is verified legal content. `review_status` and `verified_on`
 * gate whether the UI is allowed to show a "verified" badge.
 */

export type SituationId =
  | "domestic_violence"
  | "movement_restriction"
  | "threats"
  | "workplace_harassment"
  | "cyber_harassment";

export interface SourceRecord {
  id: string;
  document_title: string;
  jurisdiction: string;
  /** Provision/section — only rendered when review_status === "verified". */
  provision: string | null;
  topic: SituationId;
  source_url: string;
  version_status: string;
  verified_on: string | null;
  review_status: "verified" | "unverified" | "demo";
  organization: string;
  /** Plain-language, cautious summary used for the "law may recognize" block. */
  plain_language: string;
  /** Non-directive options presented to the reader. */
  options: string[];
  keywords: string[];
}

export interface ContactRecord {
  id: string;
  name: string;
  number: string;
  organization: string;
  /** Coverage/hours are rendered ONLY when review_status === "verified". */
  coverage: string | null;
  review_status: "verified" | "unverified";
  verified_on: string | null;
}

export const CONTACTS = {
  pcsw: {
    id: "pcsw",
    name: "PCSW Helpline",
    number: "1043",
    organization: "Punjab Commission on the Status of Women",
    coverage: null,
    review_status: "unverified",
    verified_on: null,
  },
  pwpa: {
    id: "pwpa",
    name: "Protection Centre Referral (PWPA)",
    number: "1737",
    organization: "Punjab Women Protection Authority",
    coverage: null,
    review_status: "unverified",
    verified_on: null,
  },
  ombudsperson: {
    id: "ombudsperson",
    name: "Ombudsperson Punjab (Workplace Harassment)",
    number: "042-99233348-50",
    organization: "Office of the Ombudsperson Punjab",
    coverage: null,
    review_status: "unverified",
    verified_on: null,
  },
  nccia: {
    id: "nccia",
    name: "NCCIA Helpline",
    number: "1799",
    organization: "National Cyber Crime Investigation Agency",
    coverage: null,
    review_status: "unverified",
    verified_on: null,
  },
  police: {
    id: "police",
    name: "Police",
    number: "15",
    organization: "Punjab Police",
    coverage: null,
    review_status: "unverified",
    verified_on: null,
  },
  rescue: {
    id: "rescue",
    name: "Rescue",
    number: "1122",
    organization: "Punjab Emergency Service",
    coverage: null,
    review_status: "unverified",
    verified_on: null,
  },
  child: {
    id: "child",
    name: "Child Protection Helpline",
    number: "1121",
    organization: "Punjab Child Protection & Welfare Bureau",
    coverage: null,
    review_status: "unverified",
    verified_on: null,
  },
} satisfies Record<string, ContactRecord>;

export const SITUATION_LABEL: Record<SituationId, string> = {
  domestic_violence: "Violence at home",
  movement_restriction: "Movement restriction or confinement",
  threats: "Threats or intimidation",
  workplace_harassment: "Workplace harassment",
  cyber_harassment: "Online harassment or blackmail",
};

export const SOURCES: SourceRecord[] = [
  {
    id: "src_dv_demo",
    document_title: "Punjab Protection of Women against Violence Act (demo record)",
    jurisdiction: "Punjab, Pakistan",
    provision: null,
    topic: "domestic_violence",
    source_url: "https://punjablaws.gov.pk/",
    version_status: "Demo scenario — text not reviewed",
    verified_on: null,
    review_status: "demo",
    organization: "Punjab Code (demo reference)",
    plain_language:
      "Punjab has a dedicated law on violence against women that, in general terms, may recognise physical, emotional, economic and psychological harm within a household, and may allow a court to make protection orders. Whether it applies to a particular situation depends on facts a qualified person would need to review.",
    options: [
      "Some people first speak to a women's helpline to understand what a protection order involves.",
      "Some people ask a protection centre what a referral would mean in their circumstances.",
      "Some people prefer to only read about their options for now and decide later.",
    ],
    keywords: [
      "hit",
      "beat",
      "beats",
      "beating",
      "husband",
      "in-law",
      "inlaws",
      "in-laws",
      "domestic",
      "home",
      "slap",
      "abuse",
      "violence",
      "family",
      "hurt me",
      "hurts me",
    ],
  },
  {
    id: "src_conf_demo",
    document_title: "Pakistan Penal Code — restraint and confinement provisions (demo record)",
    jurisdiction: "Pakistan",
    provision: null,
    topic: "movement_restriction",
    source_url: "https://pakistancode.gov.pk/",
    version_status: "Demo scenario — text not reviewed",
    verified_on: null,
    review_status: "demo",
    organization: "Pakistan Code (demo reference)",
    plain_language:
      "The criminal law contains general provisions about wrongfully restraining or confining a person against their will. Whether a specific arrangement at home is treated this way depends heavily on the facts, and a qualified person would need to assess it.",
    options: [
      "Some people call a women's helpline to ask how confinement is understood in practice.",
      "Some people ask a protection centre what support exists in situations like theirs.",
      "Some people note down their questions and seek legal information later.",
    ],
    keywords: [
      "locked",
      "lock",
      "not allowed to leave",
      "cannot leave",
      "can't leave",
      "confine",
      "confined",
      "keep me inside",
      "won't let me",
      "wont let me",
      "stop me from going",
      "took my phone",
      "took my documents",
      "passport",
      "restrict",
    ],
  },
  {
    id: "src_threat_demo",
    document_title: "Pakistan Penal Code — criminal intimidation provisions (demo record)",
    jurisdiction: "Pakistan",
    provision: null,
    topic: "threats",
    source_url: "https://pakistancode.gov.pk/",
    version_status: "Demo scenario — text not reviewed",
    verified_on: null,
    review_status: "demo",
    organization: "Pakistan Code (demo reference)",
    plain_language:
      "The criminal law generally recognises threats intended to cause alarm or to make someone act against their will. Whether particular words or messages meet that description is a fact-specific question for a qualified person.",
    options: [
      "Some people ask a helpline what information is usually discussed in threat-related matters.",
      "Some people seek legal information about how intimidation complaints are generally handled.",
      "Some people choose to wait and read more before deciding anything.",
    ],
    keywords: [
      "threat",
      "threats",
      "threatened",
      "threatening",
      "intimidate",
      "warned me",
      "scare",
      "scared me",
      "he said he will",
      "they said they will",
      "revenge",
    ],
  },
  {
    id: "src_wh_demo",
    document_title: "Punjab workplace harassment legislation (demo record)",
    jurisdiction: "Punjab, Pakistan",
    provision: null,
    topic: "workplace_harassment",
    source_url: "https://punjablaws.gov.pk/",
    version_status: "Demo scenario — text not reviewed",
    verified_on: null,
    review_status: "demo",
    organization: "Punjab Code (demo reference)",
    plain_language:
      "Workplace harassment legislation generally recognises unwelcome conduct of a sexual nature, or conduct that creates an intimidating work environment, and generally provides for an inquiry route including an ombudsperson. Whether a particular workplace and role are covered depends on the facts.",
    options: [
      "Some people first ask the ombudsperson's office what its process generally involves.",
      "Some people read their organisation's internal policy before deciding anything.",
      "Some people only want to understand the landscape for now.",
    ],
    keywords: [
      "office",
      "boss",
      "manager",
      "colleague",
      "coworker",
      "co-worker",
      "workplace",
      "work",
      "job",
      "supervisor",
      "employer",
      "harass at work",
      "hr",
    ],
  },
  {
    id: "src_cyber_demo",
    document_title: "Prevention of Electronic Crimes Act and amendments (demo record)",
    jurisdiction: "Pakistan",
    provision: null,
    topic: "cyber_harassment",
    source_url: "https://pakistancode.gov.pk/",
    version_status: "Demo scenario — text not reviewed",
    verified_on: null,
    review_status: "demo",
    organization: "Pakistan Code (demo reference)",
    plain_language:
      "Electronic crimes legislation generally addresses online harassment, unauthorised use of personal images or data, and threats made through electronic means. Whether a specific online incident falls within it is a fact-specific question.",
    options: [
      "Some people contact the cyber crime helpline to ask what a complaint generally involves.",
      "Some people read about platform-level reporting options before deciding.",
      "Some people prefer to understand the process first and decide later.",
    ],
    keywords: [
      "online",
      "whatsapp",
      "facebook",
      "instagram",
      "photo",
      "photos",
      "picture",
      "pictures",
      "blackmail",
      "blackmailing",
      "leak",
      "post my",
      "share my photos",
      "hacked",
      "fake account",
      "messages",
      "cyber",
      "video",
    ],
  },
];

export const CONTACT_FOR_SITUATION: Record<SituationId, (keyof typeof CONTACTS)[]> = {
  domestic_violence: ["pcsw", "pwpa"],
  movement_restriction: ["pcsw", "pwpa"],
  threats: ["pcsw"],
  workplace_harassment: ["ombudsperson"],
  cyber_harassment: ["nccia"],
};

export const DISCLAIMER =
  "This is general legal information, not legal advice. Facts, age, relationship, and location may change your legal position.";

export const PRIVACY_TRUTH =
  "The cover screen and Quick Exit reduce casual discovery; they do not guarantee secrecy. App switchers, screenshots, notifications, browser history, clipboard, call logs, and device monitoring may still expose activity.";

export const WEAK_RETRIEVAL_FALLBACK =
  "I could not find enough reliable information in the available sources to explain this accurately. A qualified legal professional or support organization can help confirm your options.";
