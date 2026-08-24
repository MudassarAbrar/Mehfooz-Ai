import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { WeatherCover } from "@/components/mehfooz/WeatherCover";
import { Navigator } from "@/components/mehfooz/Navigator";
import type { Lang } from "@/lib/mehfooz/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skyline Weather — Local Forecast & 7-Day Outlook" },
      {
        name: "description",
        content:
          "Check current conditions, an hourly strip, and a 7-day forecast for your city with a clean, fast mobile weather view.",
      },
      { property: "og:title", content: "Skyline Weather — Local Forecast" },
      {
        property: "og:description",
        content: "Current conditions, hourly and 7-day forecast in a clean mobile view.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  // Session-only state. Nothing is persisted; Quick Exit resets everything.
  const [inPrivate, setInPrivate] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  if (inPrivate) {
    // Remounts fresh each time, so no private text survives a Quick Exit.
    return (
      <Navigator
        onExit={() => setInPrivate(false)}
        lang={lang}
        onLangChange={setLang}
        qaMode={import.meta.env.DEV}
      />
    );
  }

  return <WeatherCover onHiddenEntry={() => setInPrivate(true)} lang={lang} />;
}
