import { ConsultTrigger } from "./ConsultTrigger";

export function Cta() {
  return (
    <section
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
        <ConsultTrigger className="inline-block rounded-xl bg-accent px-7.5 py-4 text-[15.5px] font-semibold text-white transition-[filter] hover:brightness-110">
          Book a consultation
        </ConsultTrigger>
      </div>
    </section>
  );
}
