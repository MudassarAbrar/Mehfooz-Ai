import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Info,
  MessageCircle,
  Phone,
  Send,
  ShieldAlert,
  WifiOff,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CONTACTS,
  DISCLAIMER,
  PRIVACY_TRUTH,
  SITUATION_LABEL,
  WEAK_RETRIEVAL_FALLBACK,
  type ContactRecord,
  type SourceRecord,
} from "@/lib/mehfooz/corpus";
import {
  analyzeSafely,
  DEMO_SCENARIOS,
  type NavigatorResult,
} from "@/lib/mehfooz/engine";
import {
  DISCLAIMER_UR,
  PRIVACY_TRUTH_UR,
  SAFETY_UR,
  SITUATION_LABEL_UR,
  SUGGESTED_PROMPTS,
  UI,
  isRtl,
  type Lang,
} from "@/lib/mehfooz/i18n";

type Origin = "input" | "chat";

type Screen =
  | { name: "welcome" }
  | { name: "input" }
  | { name: "chat" }
  | { name: "result"; result: NavigatorResult; from: Origin }
  | {
      name: "detail";
      contact: ContactRecord;
      source?: SourceRecord | undefined;
      from: Origin;
    };

/** Session-only chat turn. Never persisted, never sent anywhere. */
type ChatTurn =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "guide"; result: NavigatorResult };

export function Navigator({
  onExit,
  lang,
  onLangChange,
  qaMode = false,
}: {
  onExit: () => void;
  lang: Lang;
  onLangChange: (l: Lang) => void;
  qaMode?: boolean;
}) {
  const [screen, setScreen] = useState<Screen>({ name: "welcome" });
  const [text, setText] = useState("");
  const [gentleNudge, setGentleNudge] = useState(false);
  const [qaIndex, setQaIndex] = useState(0);
  const [forceOffline, setForceOffline] = useState(false);
  const [chat, setChat] = useState<ChatTurn[]>([]);

  const t = UI[lang];
  const rtl = isRtl(lang);

  const origin: Origin = screen.name === "chat" ? "chat" : "input";

  const openDetail = (contact: ContactRecord, source?: SourceRecord) =>
    setScreen({ name: "detail", contact, source, from: origin });

  const run = (input: string) =>
    setScreen({
      name: "result",
      result: analyzeSafely(input, { forceOffline }),
      from: "input",
    });

  const sendChat = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const stamp = `${Date.now()}-${chat.length}`;
    setChat((prev) => [
      ...prev,
      { id: `u-${stamp}`, role: "user", text: trimmed },
      {
        id: `g-${stamp}`,
        role: "guide",
        result: analyzeSafely(trimmed, { forceOffline }),
      },
    ]);
  };


  const cycleScenario = () => {
    const next = (qaIndex + 1) % DEMO_SCENARIOS.length;
    setQaIndex(next);
    const scenario = DEMO_SCENARIOS[next]!;
    setText(scenario.input);
    setGentleNudge(false);
    setScreen({ name: "input" });
  };

  return (
    <div
      className={`min-h-dvh bg-background pb-28 ${rtl ? "text-right" : ""}`}
      dir={rtl ? "rtl" : "ltr"}
      lang={lang}
    >
      <div className="mx-auto w-full max-w-md px-4 pt-6">
        {screen.name !== "welcome" && (
          <Button
            variant="ghost"
            size="sm"
            className="-ms-2 mb-2"
            onClick={() =>
              setScreen(
                screen.name === "detail" || screen.name === "result"
                  ? screen.from === "chat"
                    ? { name: "chat" }
                    : { name: "input" }
                  : { name: "welcome" },
              )
            }
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {t.back}
          </Button>
        )}

        {screen.name === "welcome" && (
          <WelcomeScreen
            lang={lang}
            onLangChange={onLangChange}
            onStart={() => setScreen({ name: "input" })}
            onChat={() => setScreen({ name: "chat" })}
          />
        )}

        {screen.name === "chat" && (
          <ChatScreen
            lang={lang}
            onLangChange={onLangChange}
            turns={chat}
            onSend={sendChat}
            onClear={() => setChat([])}
            onOpenResult={(result) => setScreen({ name: "result", result, from: "chat" })}
          />
        )}

        {screen.name === "input" && (
          <section className="space-y-4">
            <div>
              <h1 className="text-xl font-semibold leading-relaxed">{t.inputTitle}</h1>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t.inputHelp}
              </p>
            </div>

            <LangTabs lang={lang} onLangChange={onLangChange} />

            <Textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setGentleNudge(false);
              }}
              rows={7}
              dir={rtl ? "rtl" : "ltr"}
              aria-label={t.inputAria}
              placeholder={t.inputPlaceholder}
              className={`text-base leading-loose ${rtl ? "text-right" : ""}`}
            />

            {gentleNudge && (
              <p className="text-sm leading-relaxed text-muted-foreground">{t.nudge}</p>
            )}

            <SuggestedPrompts
              lang={lang}
              onPick={(v) => {
                setText(v);
                setGentleNudge(false);
              }}
            />


            <Button
              className="h-12 w-full text-base"
              onClick={() => {
                if (!text.trim()) {
                  setGentleNudge(true);
                  return;
                }
                run(text);
              }}
            >
              {t.continue}
            </Button>

            <Button
              variant="outline"
              className="h-11 w-full"
              onClick={() => setScreen({ name: "chat" })}
            >
              <MessageCircle className="size-4" />
              {t.chatOpen}
            </Button>

            <p className="text-xs leading-relaxed text-muted-foreground">{t.notSaved}</p>
          </section>
        )}

        {screen.name === "result" && screen.result.kind === "action" && (
          <ActionCard result={screen.result} lang={lang} onOpenDetail={openDetail} />
        )}

        {screen.name === "result" && screen.result.kind === "safety" && (
          <SafetyScreen result={screen.result} lang={lang} onOpenDetail={openDetail} />
        )}

        {screen.name === "detail" && (
          <DetailScreen contact={screen.contact} source={screen.source} lang={lang} />
        )}

        {qaMode && (
          <QaPanel
            lang={lang}
            index={qaIndex}
            forceOffline={forceOffline}
            onToggleOffline={() => setForceOffline((v) => !v)}
            onCycle={cycleScenario}
          />
        )}
      </div>

      <QuickExitBar onExit={onExit} label={t.quickExit} />
    </div>
  );
}

function LangTabs({
  lang,
  onLangChange,
}: {
  lang: Lang;
  onLangChange: (l: Lang) => void;
}) {
  return (
    <Tabs value={lang} onValueChange={(v) => onLangChange(v as Lang)} dir="ltr">
      <TabsList className="w-full">
        <TabsTrigger value="en" className="flex-1">
          English
        </TabsTrigger>
        <TabsTrigger value="ur" className="flex-1 leading-relaxed">
          اردو
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function QaPanel({
  lang,
  index,
  forceOffline,
  onCycle,
  onToggleOffline,
}: {
  lang: Lang;
  index: number;
  forceOffline: boolean;
  onCycle: () => void;
  onToggleOffline: () => void;
}) {
  const t = UI[lang];
  const scenario = DEMO_SCENARIOS[index]!;
  return (
    <div className="mt-6 rounded-lg border border-dashed p-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.qaTitle}
          </p>
          <p className="truncate text-sm">
            {index + 1}/{DEMO_SCENARIOS.length} · {scenario.label}
          </p>
        </div>
        <Button size="sm" variant="secondary" className="shrink-0" onClick={onCycle}>
          {t.qaNext}
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={forceOffline ? "default" : "outline"}
          onClick={onToggleOffline}
        >
          <WifiOff className="size-4" />
          {t.qaOffline}
        </Button>
        <span className="text-xs text-muted-foreground">{t.qaHint}</span>
      </div>
    </div>
  );
}

function QuickExitBar({ onExit, label }: { onExit: () => void; label: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur">
      <div className="mx-auto w-full max-w-md px-4 py-3">
        <Button
          variant="destructive"
          className="h-12 w-full text-base"
          onClick={onExit}
        >
          <X className="size-5" />
          {label}
        </Button>
      </div>
    </div>
  );
}

function WelcomeScreen({
  lang,
  onLangChange,
  onStart,
  onChat,
}: {
  lang: Lang;
  onLangChange: (l: Lang) => void;
  onStart: () => void;
  onChat: () => void;
}) {
  const t = UI[lang];
  const rtl = isRtl(lang);
  const labels = rtl ? SITUATION_LABEL_UR : SITUATION_LABEL;
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold leading-relaxed">{t.navigatorTitle}</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">{t.navigatorIntro}</p>

      <LangTabs lang={lang} onLangChange={onLangChange} />

      <Card>
        <CardContent className="space-y-3 pt-6 text-sm leading-relaxed">
          <div className="flex gap-3">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="min-w-0 text-muted-foreground">
              {rtl ? DISCLAIMER_UR : DISCLAIMER}
            </p>
          </div>
          <Separator />
          <div className="flex gap-3">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="min-w-0 text-muted-foreground">
              {rtl ? PRIVACY_TRUTH_UR : PRIVACY_TRUTH}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {Object.values(labels).map((l) => (
          <Badge key={l} variant="secondary" className="font-normal leading-relaxed">
            {l}
          </Badge>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm leading-relaxed">{t.onboardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <OnboardItem title={t.onboardHowTitle} body={t.onboardHow} />
          <Separator />
          <OnboardItem title={t.onboardInputsTitle} body={t.onboardInputs} />
          <Separator />
          <OnboardItem title={t.onboardPrivacyTitle} body={t.onboardPrivacy} />
        </CardContent>
      </Card>

      <Button className="h-12 w-full text-base" onClick={onStart}>
        {t.continue}
      </Button>
      <Button variant="outline" className="h-11 w-full" onClick={onChat}>
        <MessageCircle className="size-4" />
        {t.chatOpen}
      </Button>
      <p className="text-xs leading-relaxed text-muted-foreground">{t.quickExitHint}</p>
    </section>
  );
}

function OnboardItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-1">
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground">{body}</p>
    </div>
  );
}

function SuggestedPrompts({
  lang,
  onPick,
}: {
  lang: Lang;
  onPick: (value: string) => void;
}) {
  const t = UI[lang];
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t.suggestedTitle}
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS[lang].map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onPick(p.input)}
            className="min-h-9 rounded-full border px-3 py-1.5 text-sm leading-relaxed transition-colors hover:bg-accent"
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{t.suggestedHint}</p>
    </div>
  );
}

/**
 * Discreet in-app chat. Fully local: every reply is composed by the same
 * offline-safe engine from the approved corpus. No network call, no history.
 * (AI Elements are intentionally not used here — there is no model or stream;
 * replies are deterministic local lookups and nothing may leave the device.)
 */
function ChatScreen({
  lang,
  onLangChange,
  turns,
  onSend,
  onClear,
  onOpenResult,
}: {
  lang: Lang;
  onLangChange: (l: Lang) => void;
  turns: ChatTurn[];
  onSend: (text: string) => void;
  onClear: () => void;
  onOpenResult: (result: NavigatorResult) => void;
}) {
  const t = UI[lang];
  const rtl = isRtl(lang);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [turns.length]);

  const submit = () => {
    if (!draft.trim()) return;
    onSend(draft);
    setDraft("");
  };

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold leading-relaxed">{t.chatTitle}</h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {t.chatIntro}
          </p>
        </div>
        {turns.length > 0 && (
          <Button size="sm" variant="ghost" className="shrink-0" onClick={onClear}>
            {t.chatClear}
          </Button>
        )}
      </div>

      <LangTabs lang={lang} onLangChange={onLangChange} />

      <div className="space-y-3">
        {turns.length === 0 && (
          <p className="rounded-lg border border-dashed p-3 text-sm leading-relaxed text-muted-foreground">
            {t.chatEmpty}
          </p>
        )}
        {turns.map((turn) =>
          turn.role === "user" ? (
            <div key={turn.id} className="flex justify-end">
              <div dir="auto" className="max-w-[85%] rounded-2xl bg-primary px-3.5 py-2.5 text-start text-sm leading-relaxed text-primary-foreground">
                {turn.text}
              </div>
            </div>
          ) : (
            <ChatReply
              key={turn.id}
              lang={lang}
              result={turn.result}
              onOpen={() => onOpenResult(turn.result)}
            />
          ),
        )}
        <div ref={endRef} />
      </div>

      <SuggestedPrompts lang={lang} onPick={(v) => onSend(v)} />

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={2}
          dir={rtl ? "rtl" : "ltr"}
          aria-label={t.chatPlaceholder}
          placeholder={t.chatPlaceholder}
          className={`text-base leading-loose ${rtl ? "text-right" : ""}`}
        />
        <Button
          size="icon"
          className="size-11 shrink-0"
          aria-label={t.chatSend}
          onClick={submit}
        >
          <Send className="size-4 rtl:-scale-x-100" />
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{t.notSaved}</p>
    </section>
  );
}

function ChatReply({
  lang,
  result,
  onOpen,
}: {
  lang: Lang;
  result: NavigatorResult;
  onOpen: () => void;
}) {
  const t = UI[lang];
  const rtl = isRtl(lang);
  const contact = result.contacts[0];

  const title =
    result.kind === "safety"
      ? rtl
        ? SAFETY_UR[result.safetyKind].title
        : result.title
      : t.cardTitle;

  const body =
    result.kind === "safety"
      ? rtl
        ? SAFETY_UR[result.safetyKind].body
        : result.safetyKind === "weak_retrieval"
          ? WEAK_RETRIEVAL_FALLBACK
          : result.body
      : result.understood;

  return (
    <div className="max-w-[92%] space-y-2 text-sm leading-relaxed">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t.chatGuide}
      </p>
      <p className="font-medium">{title}</p>
      <p dir={result.kind === "action" ? "ltr" : undefined} className={rtl && result.kind === "action" ? "text-left" : ""}>
        {body}
      </p>
      {contact && (
        <p className="text-muted-foreground">
          {t.supportContact}: {contact.organization} <span dir="ltr">{contact.number}</span>
        </p>
      )}
      <Button size="sm" variant="secondary" onClick={onOpen}>
        {t.chatOpenCard}
      </Button>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function ContactRow({
  contact,
  lang,
  onOpen,
}: {
  contact: ContactRecord;
  lang: Lang;
  onOpen: () => void;
}) {
  const t = UI[lang];
  const verified = contact.review_status === "verified";
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid min-h-11 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border p-3 text-start transition-colors hover:bg-accent"
    >
      <Phone className="size-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{contact.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          <span dir="ltr">{contact.number}</span> ·{" "}
          {verified ? contact.coverage : t.coverageUnverified}
        </span>
      </span>
      <Badge variant={verified ? "default" : "outline"} className="shrink-0 text-[10px]">
        {verified ? t.verified : t.unverified}
      </Badge>
    </button>
  );
}

function ActionCard({
  result,
  lang,
  onOpenDetail,
}: {
  result: Extract<NavigatorResult, { kind: "action" }>;
  lang: Lang;
  onOpenDetail: (c: ContactRecord, s?: SourceRecord) => void;
}) {
  const t = UI[lang];
  const rtl = isRtl(lang);
  const primary = result.contacts[0];
  const label = rtl ? SITUATION_LABEL_UR[result.situation] : result.situationLabel;
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-normal leading-relaxed">
            {label}
          </Badge>
          {result.offline && (
            <Badge variant="outline" className="gap-1 font-normal">
              <WifiOff className="size-3" />
              {t.offlineBadge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg leading-relaxed">{t.cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {result.offline && (
          <p className="rounded-lg border border-dashed p-3 text-sm leading-relaxed text-muted-foreground">
            {t.offlineNote}
          </p>
        )}
        <Block title={t.understood}>
          <p dir="ltr" className={rtl ? "text-left" : ""}>
            {result.understood}
          </p>
        </Block>
        <Separator />
        <Block title={t.lawMay}>
          {rtl && (
            <p className="mb-1.5 text-xs text-muted-foreground">{t.englishOnlyLegal}</p>
          )}
          <p dir="ltr" className={rtl ? "text-left" : ""}>
            {result.lawMayRecognize}
          </p>
        </Block>
        <Separator />
        <Block title={t.nextSteps}>
          <ul className="list-disc space-y-1.5 ps-5" dir="ltr">
            {result.nextSteps.map((s) => (
              <li key={s} className={rtl ? "text-left" : ""}>
                {s}
              </li>
            ))}
          </ul>
        </Block>
        <Separator />
        <Block title={t.supportContact}>
          <div className="space-y-2">
            {primary && (
              <ContactRow
                contact={primary}
                lang={lang}
                onOpen={() => onOpenDetail(primary, result.source)}
              />
            )}
            {result.contacts.slice(1).map((c) => (
              <ContactRow
                key={c.id}
                contact={c}
                lang={lang}
                onOpen={() => onOpenDetail(c)}
              />
            ))}
          </div>
        </Block>
        <Separator />
        <Block title={t.sources}>
          <div className="space-y-1" dir="ltr">
            <p className={`font-medium ${rtl ? "text-left" : ""}`}>
              {result.source.document_title}
            </p>
            {result.source.review_status === "verified" && result.source.provision && (
              <p className={`text-muted-foreground ${rtl ? "text-left" : ""}`}>
                {result.source.provision}
              </p>
            )}
            <p className={`text-xs text-muted-foreground ${rtl ? "text-left" : ""}`}>
              {result.source.jurisdiction} · {result.source.version_status}
            </p>
            <a
              href={result.source.source_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm underline underline-offset-4"
            >
              {t.openSource}
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </Block>
        <Separator />
        <p className="text-xs leading-relaxed text-muted-foreground">
          {rtl ? DISCLAIMER_UR : DISCLAIMER}
        </p>
      </CardContent>
    </Card>
  );
}

function SafetyScreen({
  result,
  lang,
  onOpenDetail,
}: {
  result: Extract<NavigatorResult, { kind: "safety" }>;
  lang: Lang;
  onOpenDetail: (c: ContactRecord) => void;
}) {
  const t = UI[lang];
  const rtl = isRtl(lang);
  const enBody =
    result.safetyKind === "weak_retrieval" ? WEAK_RETRIEVAL_FALLBACK : result.body;
  const title = rtl ? SAFETY_UR[result.safetyKind].title : result.title;
  const body = rtl ? SAFETY_UR[result.safetyKind].body : enBody;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-relaxed">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-relaxed">{body}</p>
        <div className="space-y-2">
          {result.contacts.map((c) => (
            <ContactRow
              key={c.id}
              contact={c}
              lang={lang}
              onOpen={() => onOpenDetail(c)}
            />
          ))}
        </div>
        {result.showHumanVerification && (
          <div className="rounded-lg border border-dashed p-3 text-sm leading-relaxed text-muted-foreground">
            {t.humanCheck} <span dir="ltr">{CONTACTS.pcsw.number}</span>{" "}
            {t.humanCheckTail}
          </div>
        )}
        <Separator />
        <p className="text-xs leading-relaxed text-muted-foreground">
          {rtl ? DISCLAIMER_UR : DISCLAIMER}
        </p>
      </CardContent>
    </Card>
  );
}

function DetailScreen({
  contact,
  source,
  lang,
}: {
  contact: ContactRecord;
  source?: SourceRecord | undefined;
  lang: Lang;
}) {
  const t = UI[lang];
  const rtl = isRtl(lang);
  const verified = contact.review_status === "verified";
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-relaxed">{contact.organization}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <div className="space-y-1">
          <p className="font-medium">{contact.name}</p>
          <p className="text-muted-foreground" dir="ltr">
            <span className={rtl ? "block text-right" : ""}>{contact.number}</span>
          </p>
          <p className="text-muted-foreground">
            {verified && contact.coverage
              ? `Coverage: ${contact.coverage}`
              : t.coverageNote}
          </p>
          <p className="text-xs text-muted-foreground">
            {verified && contact.verified_on
              ? `Verified on ${contact.verified_on}`
              : t.notVerified}
          </p>
        </div>

        {source && (
          <>
            <Separator />
            <div className="space-y-1" dir="ltr">
              <p className={`font-medium ${rtl ? "text-left" : ""}`}>
                {source.document_title}
              </p>
              {source.review_status === "verified" && source.provision && (
                <p className={`text-muted-foreground ${rtl ? "text-left" : ""}`}>
                  {source.provision}
                </p>
              )}
              <p className={`text-xs text-muted-foreground ${rtl ? "text-left" : ""}`}>
                {source.jurisdiction} · {source.version_status}
              </p>
              <a
                href={source.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 underline underline-offset-4"
              >
                {t.openDocument}
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </>
        )}

        <Separator />
        <a
          href={`tel:${contact.number.replace(/\s/g, "")}`}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-base font-medium text-primary-foreground"
        >
          <Phone className="size-4" />
          {t.call} <span dir="ltr">{contact.number}</span>
        </a>
        <p className="text-xs leading-relaxed text-muted-foreground">{t.callNote}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {rtl ? PRIVACY_TRUTH_UR : PRIVACY_TRUTH}
        </p>
      </CardContent>
    </Card>
  );
}
