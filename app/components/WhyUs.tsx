import Image from "next/image";
import { Icon } from "./Icon";
import { WHY_POINTS } from "./data";

export function WhyUs() {
  return (
    <section className="border-t border-white/7 bg-alt">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-14 px-6 py-[70px] md:grid-cols-2 md:px-12">
        <div>
          <div className="mb-4 font-mono text-[12.5px] tracking-[0.2em] text-brand-light">
            WHY HALEY365
          </div>
          <h2 className="font-display text-[34px] leading-[1.15] font-extrabold text-white">
            More than a service provider — a technology partner.
          </h2>
          <p className="mt-4.5 mb-6 text-[15px] leading-[1.7] text-body">
            We pair the reliability of managed IT with the ambition of a
            modern software team. That means your security, your cloud, and
            the custom tools you run every day all come from one partner who
            knows your business.
          </p>
          <div className="flex flex-col gap-3.5">
            {WHY_POINTS.map((point) => (
              <div
                key={point}
                className="flex items-center gap-2.5 text-[14.5px] text-heading-alt"
              >
                <Icon name="check_circle" className="text-xl text-check-green" />
                {point}
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div
            className="pointer-events-none absolute -inset-x-[30px] -inset-y-10 blur-[8px]"
            style={{
              background:
                "radial-gradient(360px 260px at 65% 30%, rgba(59,130,246,0.4), transparent 70%)",
            }}
          />
          <div className="relative overflow-hidden rounded-[14px] border border-[rgba(96,165,250,0.28)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7),0_0_0_1px_rgba(96,165,250,0.08)]">
            <div className="flex items-center gap-1.5 border-b border-white/7 bg-alt px-3.5 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2.5 font-mono text-[11px] text-muted-dark">
                portal.haley365.com
              </span>
            </div>
            <Image
              src="/assets/portal-preview.png"
              alt="Haley365 client portal dashboard"
              width={1902}
              height={944}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
