import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline">
      <svg
        width="34"
        height="34"
        viewBox="0 0 48 48"
        fill="none"
        className="shrink-0"
      >
        <g transform="rotate(-28 24 24)">
          <ellipse cx="24" cy="24" rx="18" ry="8.5" stroke="#3b82f6" strokeWidth="2.2" fill="none" />
          <circle cx="42" cy="24" r="3.2" fill="#3b82f6" />
        </g>
        <circle cx="24" cy="24" r="4.4" fill="#fff" />
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
