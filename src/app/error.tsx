"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep internals out of the UI; the digest remains available for support.
    console.error("[uuu] render error", error.digest || error.message);
  }, [error]);

  return (
    <main className="min-h-dvh grid place-items-center bg-[#f7f5f0] px-6 text-[#24231f]">
      <section className="w-full max-w-md rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,.35)] text-center">
        <div className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl bg-[#fff0e9] text-[#d65f35]">
          <AlertCircle aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Не удалось показать страницу</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          Данные не потеряны. Повторите загрузку — если ошибка останется, попробуйте обновить страницу позже.
        </p>
        {error.digest && <p className="mt-2 text-xs text-neutral-400">Код: {error.digest}</p>}
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#24231f] px-6 text-sm font-semibold text-white transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <RotateCcw className="size-4" aria-hidden="true" /> Повторить
        </button>
      </section>
    </main>
  );
}
