import { Icon } from "./Icon";
import { CAPABILITIES } from "./data";

export function Capabilities() {
  return (
    <section id="capabilities" className="mx-auto max-w-[1320px] px-6 pt-4 pb-20 md:px-12">
      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
        {CAPABILITIES.map((capability) => (
          <div
            key={capability.title}
            className="rounded-[14px] border border-[rgba(96,165,250,0.22)] bg-[rgba(59,130,246,0.09)] px-5.5 py-6.5 transition-colors hover:border-[rgba(96,165,250,0.4)]"
          >
            <span className="mb-4.5 inline-flex h-11.5 w-11.5 items-center justify-center rounded-[11px] bg-[rgba(96,165,250,0.16)]">
              <Icon name={capability.icon} className="text-2xl text-icon-blue" />
            </span>
            <div className="font-display text-lg font-bold text-white">
              {capability.title}
            </div>
            <p className="mt-2.5 text-[13.5px] leading-[1.6] text-body">
              {capability.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
