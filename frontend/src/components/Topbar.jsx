import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import { AppLogo } from "./brand/AppLogo";
import { GlobalSearch } from "./layout/GlobalSearch";
import { MobileNav } from "./layout/MobileNav";
import { ProfileMenu } from "./layout/ProfileMenu";
import { NotificationPanel } from "./notifications/NotificationPanel";

export function Topbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/75 shadow-sm shadow-slate-200/30 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/75 dark:shadow-slate-950/40">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 lg:gap-4 lg:px-6">
        <MobileNav />
        <div className="shrink-0 lg:hidden">
          <AppLogo size="sm" showText={false} />
        </div>
        <GlobalSearch />
        <NotificationPanel />
        <button
          type="button"
          className="btn btn-ghost shrink-0 transition-shadow hover:shadow-sm"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
        </button>
        <ProfileMenu />
      </div>
    </header>
  );
}
