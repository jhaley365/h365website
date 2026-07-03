import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline">
      <svg
        width="38"
        height="30"
        viewBox="0 0 48 38"
        fill="none"
        className="shrink-0"
      >
        <g stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round">
          <line x1="6" y1="19" x2="20" y2="8" />
          <line x1="6" y1="19" x2="20" y2="30" />
          <line x1="20" y1="8" x2="38" y2="14" />
          <line x1="20" y1="30" x2="38" y2="24" />
          <line x1="38" y1="14" x2="38" y2="24" />
        </g>
        <g fill="#fff">
          <circle cx="6" cy="19" r="3.4" />
          <circle cx="20" cy="8" r="3.4" />
          <circle cx="20" cy="30" r="3.4" />
        </g>
        <g fill="#3b82f6">
          <circle cx="38" cy="14" r="3.4" />
          <circle cx="38" cy="24" r="3.4" />
        </g>
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-extrabold tracking-[0.16em] text-white">
          HALEY365
        </span>
        <span className="mt-1 text-[8.5px] tracking-[0.26em] text-muted-dark">
          INFORMATION SECURITY
        </span>
      </span>
    </Link>
  );
}
