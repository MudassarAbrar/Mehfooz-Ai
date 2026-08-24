import type { SituationId } from "./corpus";
import type { SafetyKind } from "./engine";

export type Lang = "en" | "ur";

export const isRtl = (lang: Lang) => lang === "ur";

/** UI chrome strings. Urdu copy is written for RTL reading order. */
export const UI = {
  en: {
    back: "Back",
    quickExit: "Quick Exit",
    continue: "Continue",
    navigatorTitle: "Rights Navigator",
    navigatorIntro:
      "A quiet place to read general information about your rights in Punjab, Pakistan, and about organisations that support adult women. It does not act on your behalf and it does not contact anyone.",
    quickExitHint:
      "Quick Exit is always at the bottom of the screen. One tap returns to the weather view.",
    inputTitle: "Describe the situation",
    inputHelp:
      "Share only what's needed — no names, addresses, or identifying details. Please avoid graphic detail.",
    inputPlaceholder: "In a few words, what is happening?",
    inputAria: "Situation description",
    nudge: "Whenever you're ready, add a few words above and we can look together.",
    notSaved: "Nothing you type is saved or sent anywhere. Closing this screen clears it.",
    cardTitle: "Information for you to read",
    understood: "What I understood",
    lawMay: "What the law may recognize",
    nextSteps: "Possible next steps",
    supportContact: "Support contact",
    sources: "Sources",
    openSource: "Open source",
    openDocument: "Open document",
    verified: "Verified",
    unverified: "Unverified",
    coverageUnverified: "Coverage unverified",
    coverageNote: "Coverage and hours are not verified in this demo build.",
    notVerified: "Not verified",
    call: "Call",
    callNote:
      "Nothing is dialled until you tap. No message, report, or location is ever sent automatically.",
    humanCheck: "A person can help confirm this.",
    humanCheckTail:
      "can talk through options with you, or a qualified legal professional can review the details.",
    offlineBadge: "Offline copy",
    offlineNote:
      "Live information could not be prepared, so a stored offline version is shown. It may be incomplete.",
    englishOnlyLegal:
      "The legal summary below is available in English only in this demo build.",
    qaTitle: "Demo QA",
    qaHint: "Cycle seeded demo scenarios. Flows are unchanged.",
    qaNext: "Next scenario",
    qaOffline: "Force offline fallback",
    language: "Language",
    onboardTitle: "Before you start",
    onboardHowTitle: "How to start",
    onboardHow:
      "Tap Continue, then describe the situation in a few words — or tap one of the suggested questions. You can also open the private chat and ask in your own words.",
    onboardInputsTitle: "What you can write",
    onboardInputs:
      "General descriptions of what is happening. Please leave out names, addresses, ID numbers and graphic detail. Five situations are covered: violence at home, restricted movement, threats, workplace harassment, and online harassment.",
    onboardPrivacyTitle: "How privacy works here",
    onboardPrivacy:
      "Nothing is saved, sent, or reported. Everything stays in this screen and is cleared on Quick Exit. The cover screen reduces accidental discovery, but it cannot hide the app from someone monitoring the device.",
    suggestedTitle: "Common questions",
    suggestedHint: "Tap one to fill the box. You can edit it before continuing.",
    chatOpen: "Ask in a chat instead",
    chatTitle: "Private chat",
    chatIntro:
      "Ask a question in your own words. Answers come from the stored local sources only — nothing leaves this device.",
    chatPlaceholder: "Type your question…",
    chatSend: "Send",
    chatYou: "You",
    chatGuide: "Navigator",
    chatOpenCard: "Open full card",
    chatEmpty: "No messages yet. Tap a suggested question or type below.",
    chatClear: "Clear chat",
  },
  ur: {
    back: "واپس",
    quickExit: "فوری اخراج",
    continue: "جاری رکھیں",
    navigatorTitle: "حقوق گائیڈ",
    navigatorIntro:
      "یہ ایک پُرسکون جگہ ہے جہاں آپ پنجاب، پاکستان میں اپنے حقوق اور بالغ خواتین کی مدد کرنے والے اداروں کے بارے میں عام معلومات پڑھ سکتی ہیں۔ یہ آپ کی جانب سے کوئی کارروائی نہیں کرتا اور نہ ہی کسی سے رابطہ کرتا ہے۔",
    quickExitHint:
      "فوری اخراج کا بٹن ہمیشہ اسکرین کے نیچے موجود ہے۔ ایک ٹیپ سے موسم کی اسکرین واپس آ جاتی ہے۔",
    inputTitle: "صورتحال بیان کریں",
    inputHelp:
      "صرف ضروری بات لکھیں — نام، پتہ یا شناختی تفصیلات نہ لکھیں۔ تکلیف دہ تفصیل سے گریز کریں۔",
    inputPlaceholder: "جو ہو رہا ہے مختصراً لکھیں…",
    inputAria: "صورتحال کی تفصیل",
    nudge: "جب آپ تیار ہوں، اوپر چند الفاظ لکھیں اور ہم مل کر دیکھتے ہیں۔",
    notSaved:
      "آپ جو لکھتی ہیں وہ محفوظ یا کہیں ارسال نہیں ہوتا۔ اسکرین بند کرنے پر مٹ جاتا ہے۔",
    cardTitle: "آپ کے پڑھنے کے لیے معلومات",
    understood: "میں نے کیا سمجھا",
    lawMay: "قانون کیا تسلیم کر سکتا ہے",
    nextSteps: "ممکنہ اگلے اقدامات",
    supportContact: "مدد کے لیے رابطہ",
    sources: "حوالہ جات",
    openSource: "ماخذ کھولیں",
    openDocument: "دستاویز کھولیں",
    verified: "تصدیق شدہ",
    unverified: "غیر تصدیق شدہ",
    coverageUnverified: "دائرہ کار غیر تصدیق شدہ",
    coverageNote: "اس ڈیمو میں اوقات اور دائرہ کار کی تصدیق نہیں کی گئی۔",
    notVerified: "تصدیق نہیں ہوئی",
    call: "کال کریں",
    callNote:
      "جب تک آپ ٹیپ نہ کریں کوئی نمبر نہیں ملایا جاتا۔ کوئی پیغام، رپورٹ یا مقام خودبخود نہیں بھیجا جاتا۔",
    humanCheck: "ایک انسان اس کی تصدیق میں مدد کر سکتا ہے۔",
    humanCheckTail:
      "آپ سے اختیارات پر بات کر سکتی ہے، یا کوئی مستند قانونی ماہر تفصیلات دیکھ سکتا ہے۔",
    offlineBadge: "آف لائن نقل",
    offlineNote:
      "تازہ معلومات تیار نہیں ہو سکیں، اس لیے محفوظ شدہ آف لائن نسخہ دکھایا جا رہا ہے۔ یہ نامکمل ہو سکتا ہے۔",
    englishOnlyLegal: "نیچے دیا گیا قانونی خلاصہ اس ڈیمو میں صرف انگریزی میں دستیاب ہے۔",
    qaTitle: "ڈیمو کیو اے",
    qaHint: "ڈیمو منظرنامے تبدیل کریں۔ بہاؤ میں کوئی تبدیلی نہیں۔",
    qaNext: "اگلا منظرنامہ",
    qaOffline: "آف لائن متبادل آزمائیں",
    language: "زبان",
    onboardTitle: "شروع کرنے سے پہلے",
    onboardHowTitle: "کیسے شروع کریں",
    onboardHow:
      "”جاری رکھیں“ دبائیں، پھر چند الفاظ میں صورتحال لکھیں — یا تجویز کردہ سوالات میں سے کوئی ایک منتخب کریں۔ آپ نجی چیٹ کھول کر اپنے الفاظ میں بھی پوچھ سکتی ہیں۔",
    onboardInputsTitle: "آپ کیا لکھ سکتی ہیں",
    onboardInputs:
      "جو ہو رہا ہے اس کی عام تفصیل۔ نام، پتہ، شناختی نمبر اور تکلیف دہ تفصیل نہ لکھیں۔ پانچ صورتحال شامل ہیں: گھر میں تشدد، نقل و حرکت پر پابندی، دھمکیاں، کام کی جگہ ہراسانی، اور آن لائن ہراسانی۔",
    onboardPrivacyTitle: "یہاں رازداری کیسے کام کرتی ہے",
    onboardPrivacy:
      "کچھ محفوظ، ارسال یا رپورٹ نہیں ہوتا۔ سب کچھ اسی اسکرین میں رہتا ہے اور فوری اخراج پر مٹ جاتا ہے۔ کور اسکرین اتفاقی دریافت کم کرتی ہے، مگر ڈیوائس کی نگرانی کرنے والے سے ایپ نہیں چھپا سکتی۔",
    suggestedTitle: "عام سوالات",
    suggestedHint: "کسی ایک کو ٹیپ کریں، متن خانے میں آ جائے گا۔ آپ اسے تبدیل بھی کر سکتی ہیں۔",
    chatOpen: "چیٹ میں پوچھیں",
    chatTitle: "نجی چیٹ",
    chatIntro:
      "اپنے الفاظ میں سوال پوچھیں۔ جواب صرف محفوظ شدہ مقامی ماخذ سے آتے ہیں — کچھ بھی ڈیوائس سے باہر نہیں جاتا۔",
    chatPlaceholder: "اپنا سوال لکھیں…",
    chatSend: "بھیجیں",
    chatYou: "آپ",
    chatGuide: "گائیڈ",
    chatOpenCard: "مکمل کارڈ کھولیں",
    chatEmpty: "ابھی کوئی پیغام نہیں۔ تجویز کردہ سوال منتخب کریں یا نیچے لکھیں۔",
    chatClear: "چیٹ صاف کریں",
  },
} as const satisfies Record<Lang, Record<string, string>>;

export const SITUATION_LABEL_UR: Record<SituationId, string> = {
  domestic_violence: "گھریلو تشدد",
  movement_restriction: "نقل و حرکت پر پابندی یا قید",
  threats: "دھمکیاں یا خوف زدہ کرنا",
  workplace_harassment: "کام کی جگہ ہراسانی",
  cyber_harassment: "آن لائن ہراسانی یا بلیک میلنگ",
};

export const SAFETY_UR: Record<SafetyKind, { title: string; body: string }> = {
  immediate_danger: {
    title: "اگر آپ فوری خطرے میں ہیں",
    body: "یہ اسکرین صرف اختیارات دکھاتی ہے۔ یہ مدد نہیں بھیج سکتی، اور جب تک آپ خود رابطہ نہ کریں کسی سے رابطہ نہیں کیا جاتا۔ اگر کال کرنا آپ کے لیے محفوظ ہے تو یہ ہنگامی نمبر موجود ہیں۔ اگر کال کرنا محفوظ نہیں تو یہاں کچھ بھی لازمی نہیں۔",
  },
  minor: {
    title: "ایپ کا یہ حصہ بالغ افراد کے لیے ہے",
    body: "ایسا لگتا ہے کہ اس میں کوئی اٹھارہ سال سے کم عمر شامل ہو سکتا ہے۔ یہ ٹول بالغ افراد کے لیے بنایا گیا ہے، اس لیے یہ آگے نہیں بڑھے گا اور مزید نجی تفصیلات نہیں پوچھے گا۔ نوجوانوں کے ساتھ کام کرنے والے ادارے نیچے دیے گئے ہیں۔",
  },
  self_harm: {
    title: "اس وقت آپ کو مدد ملنی چاہیے",
    body: "یہ اسکرین قانونی معلومات نہیں دیتی۔ اگر آپ خود کو نقصان پہنچانے کا سوچ رہی ہیں، یا کوئی طبی ہنگامی صورتحال ہے، تو تربیت یافتہ افراد آپ سے بات کر سکتے ہیں۔ نیچے ہنگامی طبی سروس اور ہیلپ لائن اختیار کے طور پر دی گئی ہیں۔ استعمال کرنا یا نہ کرنا آپ کا فیصلہ ہے۔",
  },
  weak_retrieval: {
    title: "کافی قابلِ اعتماد معلومات موجود نہیں",
    body: "دستیاب ماخذ میں اتنی قابلِ اعتماد معلومات نہیں ملیں کہ اسے درست طور پر بیان کیا جا سکے۔ کوئی مستند قانونی ماہر یا معاون ادارہ آپ کے اختیارات کی تصدیق میں مدد کر سکتا ہے۔",
  },
  out_of_scope: {
    title: "یہ اس ٹول کے دائرے سے باہر ہے",
    body: "یہ ٹول پنجاب میں صرف پانچ صورتحال پر معلومات دیتا ہے: گھر میں تشدد، نقل و حرکت پر پابندی یا قید، دھمکیاں، کام کی جگہ ہراسانی، اور آن لائن ہراسانی یا بلیک میلنگ۔ آپ نے جو بیان کیا وہ واضح طور پر ان میں سے کسی ایک میں نہیں آتا، اور اسے زبردستی کسی زمرے میں نہیں ڈالا جائے گا۔ ایک عمومی مدد لائن آپ کو درست جگہ بتانے میں مدد کر سکتی ہے۔",
  },
};

export const DISCLAIMER_UR =
  "یہ عام قانونی معلومات ہیں، قانونی مشورہ نہیں۔ حقائق، عمر، رشتہ اور مقام آپ کی قانونی حیثیت بدل سکتے ہیں۔";

export const PRIVACY_TRUTH_UR =
  "کور اسکرین اور فوری اخراج اتفاقی دریافت کم کرتے ہیں؛ یہ رازداری کی ضمانت نہیں دیتے۔ ایپ سوئچر، اسکرین شاٹ، نوٹیفیکیشن، براؤزر ہسٹری، کلپ بورڈ، کال لاگ اور ڈیوائس مانیٹرنگ سے سرگرمی ظاہر ہو سکتی ہے۔";

/** Weather cover strings so the public face is believable in both languages. */
export const WEATHER = {
  en: {
    searchCity: "Search city",
    hourly: "Hourly forecast",
    daily: "7-day forecast",
    humidity: "Humidity",
    wind: "Wind",
    rain: "Rain",
    mostlySunny: "Mostly sunny",
    feelsLike: "Feels like",
    settings: "Settings",
    settingsDesc: "Units and display preferences.",
    temperature: "Temperature",
    celsius: "Celsius",
    windSpeed: "Wind speed",
    timeFormat: "Time format",
    hour12: "12-hour",
    accessCode: "Advanced access code",
    optional: "Optional",
    apply: "Apply",
    badCode: "That code isn't recognised.",
    updated: "Updated just now · Demo forecast data",
    now: "Now",
    hintTitle: "Tip",
    hintBody:
      "Press and hold the temperature for 3 seconds to open the advanced view, or enter your access code in Settings.",
    hintDismiss: "Got it",
  },
  ur: {
    searchCity: "شہر تلاش کریں",
    hourly: "گھنٹہ وار پیش گوئی",
    daily: "سات دن کی پیش گوئی",
    humidity: "نمی",
    wind: "ہوا",
    rain: "بارش",
    mostlySunny: "زیادہ تر دھوپ",
    feelsLike: "محسوس ہوتا ہے",
    settings: "ترتیبات",
    settingsDesc: "اکائیاں اور ڈسپلے کی ترجیحات۔",
    temperature: "درجہ حرارت",
    celsius: "سیلسیس",
    windSpeed: "ہوا کی رفتار",
    timeFormat: "وقت کی شکل",
    hour12: "12 گھنٹے",
    accessCode: "ایڈوانسڈ رسائی کوڈ",
    optional: "اختیاری",
    apply: "لاگو کریں",
    badCode: "یہ کوڈ درست نہیں ہے۔",
    updated: "ابھی اپ ڈیٹ ہوا · ڈیمو موسمی ڈیٹا",
    now: "ابھی",
    hintTitle: "اشارہ",
    hintBody:
      "ایڈوانسڈ ویو کھولنے کے لیے درجہ حرارت کو تین سیکنڈ دبائے رکھیں، یا ترتیبات میں اپنا رسائی کوڈ درج کریں۔",
    hintDismiss: "سمجھ گئی",
  },
} as const satisfies Record<Lang, Record<string, string>>;

/** Tappable starter questions per language. Text stays inside the app. */
export const SUGGESTED_PROMPTS: Record<Lang, { label: string; input: string }[]> = {
  en: [
    {
      label: "Violence at home",
      input: "Someone in my house hits me and I want to know what the law says.",
    },
    {
      label: "Not allowed to leave",
      input: "I am not allowed to leave the house or meet anyone.",
    },
    { label: "Being threatened", input: "I am being threatened and I feel afraid." },
    {
      label: "Harassment at work",
      input: "A colleague at work keeps harassing me and I want to complain.",
    },
    {
      label: "Online harassment",
      input: "Someone is blackmailing me online with my photos.",
    },
  ],
  ur: [
    {
      label: "گھر میں تشدد",
      input: "گھر میں کوئی مجھے مارتا ہے اور میں جاننا چاہتی ہوں قانون کیا کہتا ہے۔",
    },
    {
      label: "باہر جانے کی اجازت نہیں",
      input: "مجھے گھر سے باہر جانے یا کسی سے ملنے کی اجازت نہیں۔",
    },
    { label: "دھمکیاں", input: "مجھے دھمکیاں دی جا رہی ہیں اور میں خوفزدہ ہوں۔" },
    {
      label: "کام کی جگہ ہراسانی",
      input: "دفتر میں ایک ساتھی مجھے مسلسل ہراساں کرتا ہے، میں شکایت کرنا چاہتی ہوں۔",
    },
    {
      label: "آن لائن ہراسانی",
      input: "کوئی میری تصاویر کے ذریعے آن لائن بلیک میل کر رہا ہے۔",
    },
  ],
};
