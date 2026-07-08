import { Icon } from "./Icon";
import { ABOUT_STATS, ABOUT_VALUES, ABOUT_CERTS } from "./data";

export function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1320px] border-t border-white/7 px-6 py-[84px] md:px-12"
    >
      <div className="mb-12 grid grid-cols-1 items-start gap-14 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="mb-4 font-mono text-[12.5px] tracking-[0.2em] text-brand-light">
            ABOUT HALEY365
          </div>
          <h2 className="font-display text-[36px] leading-[1.12] font-extrabold text-white">
            Two decades of IT, security, and custom software.
          </h2>
        </div>
        <div>
          <p className="mb-4.5 text-base leading-[1.75] text-body">
            For over 20 years, Haley365 has been the technology partner small
            and mid-sized businesses rely on. Our team brings more than 30
            years of combined IT experience across networking, cloud, and
            security — and a security-first mindset shapes everything we do.
          </p>
          <p className="text-base leading-[1.75] text-body">
            We&apos;re also a company that specializes in custom solutions.
            For over 15 years we&apos;ve built custom applications tailored to
            how our clients actually work — not off-the-shelf software bent
            to fit. When you work with Haley365, you work with senior
            engineers who know your environment.
          </p>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4.5 sm:grid-cols-3">
        {ABOUT_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[14px] border border-[rgba(96,165,250,0.16)] bg-alt px-6 py-6.5"
          >
            <div className="font-display text-[38px] leading-none font-extrabold text-white">
              {stat.value}
            </div>
            <div className="mt-2 text-[13.5px] text-body">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4.5 sm:grid-cols-3">
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

      <div className="flex flex-wrap items-center gap-6.5 rounded-[14px] border border-white/7 bg-alt px-6.5 py-6">
        <div className="flex-none font-mono text-[11.5px] tracking-[0.2em] text-brand-light">
          CERTIFICATIONS & EXPERTISE
        </div>
        <div className="flex flex-1 flex-wrap gap-2.5">
          {ABOUT_CERTS.map((cert) => (
            <span
              key={cert.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(96,165,250,0.2)] bg-[rgba(96,165,250,0.1)] px-3.5 py-2 text-[13px] font-medium text-heading-alt"
            >
              <Icon name={cert.icon} className="text-base text-icon-blue" />
              {cert.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
