import { Icon } from "./Icon";
import { WHY_POINTS } from "./data";

export function WhyUs() {
  return (
    <section id="solutions" className="border-t border-white/7 bg-alt">
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
        <div
          className="flex aspect-4/3 items-center justify-center rounded-2xl border border-[rgba(96,165,250,0.22)]"
          style={{
            background:
              "radial-gradient(400px 300px at 70% 20%, rgba(59,130,246,0.35), transparent 70%), #0e1424",
          }}
        >
          <Icon name="insights" className="text-[64px] text-[rgba(124,176,255,0.5)]" />
        </div>
      </div>
    </section>
  );
}
