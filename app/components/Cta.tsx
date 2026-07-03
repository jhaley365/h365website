import Link from "next/link";

export function Cta() {
  return (
    <section
      id="contact"
      style={{
        background:
          "radial-gradient(600px 300px at 50% 120%, rgba(59,130,246,0.25), transparent 70%), #0c111e",
      }}
    >
      <div className="mx-auto max-w-[1320px] px-6 py-20 text-center md:px-12">
        <h2 className="mx-auto max-w-[640px] font-display text-[38px] leading-[1.12] font-extrabold text-white">
          Ready to modernize your IT?
        </h2>
        <p className="mx-auto mt-4 mb-7.5 max-w-[520px] text-base text-body">
          Let&apos;s talk about where AI, security, and cloud can take your
          business.
        </p>
        <Link
          href="mailto:hello@haley365.com"
          className="inline-block rounded-xl bg-accent px-7.5 py-4 text-[15.5px] font-semibold text-white no-underline transition-[filter] hover:brightness-110"
        >
          Book a consultation
        </Link>
      </div>
    </section>
  );
}
