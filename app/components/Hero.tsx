import Link from "next/link";
import { Icon } from "./Icon";
import { ConsultTrigger } from "./ConsultTrigger";
import { STATS } from "./data";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(680px 420px at 50% -8%, rgba(59,130,246,0.28), transparent 70%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(560px 400px at 50% 20%, #000, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(560px 400px at 50% 20%, #000, transparent 75%)",
        }}
      />
      <div className="relative mx-auto max-w-[1320px] px-6 py-24 text-center md:px-12 md:pt-24 md:pb-[88px]">
        <div className="mb-5.5 font-mono text-[12.5px] tracking-[0.22em] text-brand-light">
          MANAGED IT · SECURITY · CLOUD · AI
        </div>
        <h1 className="mx-auto max-w-[820px] font-display text-[clamp(36px,6vw,58px)] leading-[1.05] font-extrabold tracking-[-0.02em] text-white">
          Your IT partner, now AI-powered.
        </h1>
        <p className="mx-auto mt-5.5 max-w-[620px] text-lg leading-[1.6] text-body-alt">
          Haley365 keeps your business secure, current, and moving —
          combining managed IT and security with custom applications and
          cloud built around how you actually work.
        </p>
        <div className="mt-8.5 flex flex-wrap justify-center gap-3.5">
          <ConsultTrigger className="rounded-[11px] bg-accent px-6.5 py-3.5 text-[15px] font-semibold text-white transition-[filter] hover:brightness-110">
            Book a consultation
          </ConsultTrigger>
          <Link
            href="#capabilities"
            className="inline-flex items-center gap-2 rounded-[11px] border border-white/22 px-6.5 py-3.5 text-[15px] font-semibold text-foreground no-underline transition-colors hover:bg-white/6"
          >
            Explore services <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
        </div>
        <div className="mt-14 flex flex-wrap justify-center gap-13">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="relative flex items-stretch">
              {i > 0 && (
                <div className="absolute top-0 -left-6.5 h-full w-px bg-white/10" />
              )}
              <div>
                <div className="font-display text-[26px] font-extrabold text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-[12.5px] text-muted">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
