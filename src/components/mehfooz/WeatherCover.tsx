import { useEffect, useRef, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Info,
  MapPin,
  Search,
  Settings,
  Sun,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { WEATHER, isRtl, type Lang } from "@/lib/mehfooz/i18n";

/**
 * ── DEMO CONFIG ────────────────────────────────────────────────────────────
 * Hidden entry is configurable here.
 *  - HOLD_MS: how long the temperature must be held to open the private flow.
 *  - ENTRY_PIN: PIN accepted in the settings sheet.
 * Ordinary taps never trigger entry: the press must last the full duration
 * and the pointer must not move.
 */
export const HIDDEN_ENTRY_HOLD_MS = 3000;
export const HIDDEN_ENTRY_PIN = "2580";
/** Innocuous storage key for the one-time entry hint. */
const HINT_KEY = "sw_tips_v1";

const HOURLY = [
  { t: "now", c: 34, i: Sun },
  { t: "3 PM", c: 36, i: Sun },
  { t: "4 PM", c: 36, i: CloudSun },
  { t: "5 PM", c: 35, i: CloudSun },
  { t: "6 PM", c: 33, i: Cloud },
  { t: "7 PM", c: 31, i: Cloud },
  { t: "8 PM", c: 30, i: CloudRain },
  { t: "9 PM", c: 29, i: CloudRain },
];

const DAILY = [
  { d: "Today", i: Sun, hi: 37, lo: 27, p: 10 },
  { d: "Tuesday", i: CloudSun, hi: 36, lo: 27, p: 20 },
  { d: "Wednesday", i: CloudRain, hi: 33, lo: 26, p: 60 },
  { d: "Thursday", i: CloudRain, hi: 31, lo: 25, p: 75 },
  { d: "Friday", i: Cloud, hi: 32, lo: 25, p: 35 },
  { d: "Saturday", i: CloudSun, hi: 34, lo: 26, p: 15 },
  { d: "Sunday", i: Sun, hi: 36, lo: 27, p: 5 },
];

export function WeatherCover({
  onHiddenEntry,
  lang = "en",
}: {
  onHiddenEntry: () => void;
  lang?: Lang;
}) {
  const w = WEATHER[lang];
  const rtl = isRtl(lang);
  const [city, setCity] = useState("Lahore");
  const [query, setQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  // First-run hint. Stored under an innocuous key so the cover stays believable.
  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(HINT_KEY)) setShowHint(true);
    } catch {
      /* storage unavailable — simply skip the hint */
    }
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const cancelHold = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    start.current = null;
    setHolding(false);
  };

  const beginHold = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
    setHolding(true);
    timer.current = setTimeout(() => {
      cancelHold();
      onHiddenEntry();
    }, HIDDEN_ENTRY_HOLD_MS);
  };

  const trackMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dx = Math.abs(e.clientX - start.current.x);
    const dy = Math.abs(e.clientY - start.current.y);
    if (dx > 12 || dy > 12) cancelHold();
  };

  const submitPin = () => {
    if (pin === HIDDEN_ENTRY_PIN) {
      setSettingsOpen(false);
      setPin("");
      setPinError(false);
      onHiddenEntry();
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="min-h-dvh bg-background pb-16" dir={rtl ? "rtl" : "ltr"} lang={lang}>
      <div className="mx-auto w-full max-w-md px-4 pt-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  setCity(query.trim());
                  setQuery("");
                }
              }}
              placeholder={w.searchCity}
              aria-label={w.searchCity}
              className="h-11 ps-9"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 shrink-0"
            aria-label={w.settings}
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="size-5" />
          </Button>
        </header>

        {showHint && (
          <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-lg border border-dashed bg-muted/40 p-3">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {w.hintTitle}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">{w.hintBody}</p>
              <Button size="sm" variant="secondary" onClick={dismissHint}>
                {w.hintDismiss}
              </Button>
            </div>
          </div>
        )}


        <Card className="mt-5 overflow-hidden">
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              <span className="truncate">{city}</span>
            </div>
            <div
              role="img"
              aria-label="Current temperature 34 degrees"
              onPointerDown={beginHold}
              onPointerUp={cancelHold}
              onPointerLeave={cancelHold}
              onPointerCancel={cancelHold}
              onPointerMove={trackMove}
              onContextMenu={(e) => e.preventDefault()}
              className={`mx-auto mt-2 inline-block select-none text-[76px] font-light leading-none tracking-tight transition-opacity ${
                holding ? "opacity-80" : "opacity-100"
              }`}
              style={{ touchAction: "none" }}
            >
              34°
            </div>
            <p className="mt-2 text-base font-medium leading-relaxed">{w.mostlySunny}</p>
            <p className="text-sm text-muted-foreground"><span dir="ltr">H:37° L:27°</span> · {w.feelsLike} <span dir="ltr">39°</span></p>

            <Separator className="my-5" />

            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat icon={Droplets} label={w.humidity} value="46%" />
              <Stat icon={Wind} label={w.wind} value="11 km/h" />
              <Stat icon={CloudRain} label={w.rain} value="10%" />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {w.hourly}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="-mx-2 flex gap-1 overflow-x-auto px-2 pb-1">
              {HOURLY.map((h) => (
                <div
                  key={h.t}
                  className="flex min-w-14 shrink-0 flex-col items-center gap-2 rounded-lg px-2 py-2"
                >
                  <span className="text-xs text-muted-foreground" dir="ltr">
                    {h.t === "now" ? w.now : h.t}
                  </span>
                  <h.i className="size-5 text-primary" />
                  <span className="text-sm font-medium">{h.c}°</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {w.daily}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="divide-y">
              {DAILY.map((d) => (
                <li
                  key={d.d}
                  className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 py-3"
                >
                  <span className="truncate text-sm">{d.d}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <d.i className="size-4 shrink-0 text-primary" />
                    {d.p}%
                  </span>
                  <span className="text-sm tabular-nums">
                    <span className="font-medium">{d.hi}°</span>{" "}
                    <span className="text-muted-foreground">{d.lo}°</span>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          {w.updated}
        </p>
      </div>

      <Dialog
        open={settingsOpen}
        onOpenChange={(o) => {
          setSettingsOpen(o);
          if (!o) {
            setPin("");
            setPinError(false);
          }
        }}
      >
        <DialogContent className="max-w-sm" dir={rtl ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="leading-relaxed">{w.settings}</DialogTitle>
            <DialogDescription className="leading-relaxed">{w.settingsDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Row label={w.temperature} value={w.celsius} />
            <Row label={w.windSpeed} value="km/h" />
            <Row label={w.timeFormat} value={w.hour12} />
            <Separator />
            <div className="space-y-2">
              <label htmlFor="access-code" className="text-sm font-medium">
                {w.accessCode}
              </label>
              <Input
                id="access-code"
                inputMode="numeric"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setPinError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && submitPin()}
                placeholder={w.optional}
              />
              {pinError && (
                <p className="text-xs text-muted-foreground">
                  {w.badCode}
                </p>
              )}
              <Button className="w-full" onClick={submitPin} disabled={!pin.trim()}>
                {w.apply}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="size-4 text-muted-foreground" />
      <span className="text-sm font-medium">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="min-w-0 truncate text-muted-foreground">{label}</span>
      <span className="shrink-0 font-medium">{value}</span>
    </div>
  );
}
