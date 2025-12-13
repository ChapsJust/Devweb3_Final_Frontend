import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, User, LogOut, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { FormattedMessage } from "react-intl";
import { useLocale } from "@/context/LocaleContextType";

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const { locale, changeLocale } = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b bg-background shadow-sm">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 sm:gap-2 shrink-0">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-base sm:text-xl font-bold hidden xs:inline">StockManager</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-4 md:gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              <FormattedMessage id="header.home" defaultMessage="Accueil" />
            </Link>
            {isLoggedIn && (
              <Link to="/portfolio" className="text-sm text-muted-foreground hover:text-foreground">
                <FormattedMessage id="header.portfolio" defaultMessage="Mon Portfolio" />
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => changeLocale(locale === "fr" ? "en" : "fr")}>
              <Globe className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">{locale === "fr" ? "EN" : "FR"}</span>
            </Button>

            {isLoggedIn ? (
              <>
                <span className="text-xs sm:text-sm text-muted-foreground hidden md:block max-w-[120px] truncate">
                  <FormattedMessage id="header.hello" defaultMessage="Bonjour, {name}" values={{ name: user?.name }} />
                </span>
                <Link to="/portfolio">
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3" onClick={logout}>
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    <FormattedMessage id="header.logout" defaultMessage="Déconnexion" />
                  </span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="h-8 px-2 sm:px-3 text-xs sm:text-sm">
                    <FormattedMessage id="header.login" defaultMessage="Connexion" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="h-8 px-2 sm:px-3 text-xs sm:text-sm">
                    <FormattedMessage id="header.register" defaultMessage="Inscription" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
