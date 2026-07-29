import Link from "next/link";
import { SunIcon } from "@radix-ui/react-icons";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex items-center gap-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <SunIcon className="size-4" />
          </span>
          <span className="text-lg font-bold">날씨 좋다</span>
        </Link>
      </div>
    </header>
  );
}
