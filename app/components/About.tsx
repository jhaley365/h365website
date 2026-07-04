import { Icon } from "./Icon";
import { ABOUT_VALUES } from "./data";

export function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1320px] border-t border-white/7 px-6 py-[84px] md:px-12"
    >
      <div className="mb-13 grid grid-cols-1 items-start gap-14 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="mb-4 font-mono text-[12.5px] tracking-[0.2em] text-brand-light">
            ABOUT HALEY365
          </div>
          <h2 className="font-display text-[36px] leading-[1.12] font-extrabold text-white">
            Security-first IT, built around people.
          </h2>
        </div>
        <div>
          <p className="mb-4.5 text-base leading-[1.75] text-body">
            Haley365 began as an information-security practice and grew into a
            full technology partner for small and mid-sized businesses. That
            security-first origin still shapes everything we do — from the way
            we architect cloud environments to the custom software we build.
          </p>
          <p className="text-base leading-[1.75] text-body">
            We believe SMBs deserve the same caliber of engineering,
            protection, and responsiveness as the enterprise. So we keep teams
            small, senior, and accountable — the person who answers your call
            is the person who knows your systems.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-3">
        {ABOUT_VALUES.map((value) => (
          <div
            key={value.title}
            className="rounded-[14px] border border-[rgba(96,165,250,0.16)] bg-panel px-6 py-6.5"
          >
            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-[11px] bg-[rgba(96,165,250,0.16)]">
              <Icon name={value.icon} className="text-[22px] text-icon-blue" />
            </span>
            <div className="font-display text-[17px] font-bold text-white">
              {value.title}
            </div>
            <p className="mt-2 text-[13.5px] leading-[1.6] text-body">
              {value.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
