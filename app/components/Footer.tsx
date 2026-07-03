import { Icon } from "./Icon";

export function Footer() {
  return (
    <footer className="border-t border-white/7">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-6.5 text-[13px] text-muted-dark md:px-12">
        <span>© 2026 Haley365 Information Security</span>
        <div className="flex gap-4 text-muted-dark">
          <Icon name="public" className="text-[19px]" />
          <Icon name="mail" className="text-[19px]" />
          <Icon name="call" className="text-[19px]" />
        </div>
      </div>
    </footer>
  );
}
