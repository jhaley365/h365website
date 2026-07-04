"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { useConsult } from "./ConsultContext";
import { CONSULT_EMAIL, CONSULT_INTERESTS } from "./data";

const inputClass =
  "w-full rounded-[9px] border border-white/14 bg-alt px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent";
const labelClass = "mb-1.5 block text-xs font-semibold text-nav-link";

export function ConsultModal() {
  const { isOpen, close } = useConsult();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    close();
    setSubmitted(false);
    setError(null);
  }, [close]);

  useEffect(() => {
    if (isOpen) firstFieldRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          company: fd.get("company"),
          phone: fd.get("phone"),
          interest: fd.get("interest"),
          message: fd.get("message"),
          website: fd.get("website"),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(5,8,15,0.74)] p-6 backdrop-blur-sm"
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consult-modal-title"
        className="max-h-[90vh] w-full max-w-[520px] overflow-auto rounded-2xl border border-[rgba(96,165,250,0.28)] bg-panel shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]"
      >
        <div className="flex items-start justify-between gap-4 px-6.5 pt-6">
          <div>
            <div className="mb-2 font-mono text-[11px] tracking-[0.2em] text-brand-light">
              GET IN TOUCH
            </div>
            <h3 id="consult-modal-title" className="font-display text-[22px] font-extrabold text-white">
              Book a consultation
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-[9px] border border-white/14 bg-white/4 text-nav-link"
          >
            <Icon name="close" className="text-xl" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="px-6.5 pt-4 pb-6.5">
            <p className="mb-4.5 text-[13.5px] leading-[1.6] text-body">
              Tell us a bit about your business and we&apos;ll be in touch within one business day.
            </p>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full name</label>
                <input ref={firstFieldRef} name="name" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Work email</label>
                <input name="email" type="email" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Company</label>
                <input name="company" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>
                  Phone <span className="font-normal text-muted-dark">(optional)</span>
                </label>
                <input name="phone" className={inputClass} />
              </div>
            </div>
            <div className="mt-3.5">
              <label className={labelClass}>What can we help with?</label>
              <select name="interest" className={inputClass} defaultValue={CONSULT_INTERESTS[0]}>
                {CONSULT_INTERESTS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3.5">
              <label className={labelClass}>Message</label>
              <textarea name="message" rows={3} className={`${inputClass} resize-y`} />
            </div>

            {/* Honeypot — hidden from real users, catches simple bots */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            {error && (
              <div className="mt-3.5 rounded-[9px] border border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.14)] px-3.5 py-2.5 text-sm text-[#f87171]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full rounded-[10px] bg-accent py-3.5 text-[14.5px] font-semibold text-white transition-[filter] hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send request"}
            </button>
            <div className="mt-3 text-center text-xs text-muted-dark">
              Or email us directly at <span className="text-icon-blue">{CONSULT_EMAIL}</span>
            </div>
          </form>
        ) : (
          <div className="px-6.5 pt-8.5 pb-10 text-center">
            <span className="mx-auto mb-4.5 flex h-15 w-15 items-center justify-center rounded-full bg-[rgba(74,222,128,0.14)] text-check-green">
              <Icon name="check" className="text-3xl" />
            </span>
            <h3 className="font-display text-xl font-extrabold text-white">
              Your request is ready to send
            </h3>
            <p className="mx-auto mt-3 max-w-[360px] text-sm leading-[1.6] text-body">
              Thanks for reaching out — we&apos;ll reply within one business day.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-5.5 rounded-[10px] bg-accent px-6 py-3 text-sm font-semibold text-white transition-[filter] hover:brightness-110"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
