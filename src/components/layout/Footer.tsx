import { TrendingUp } from "lucide-react";
import { FormattedMessage } from "react-intl";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-semibold">StockManager</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            <FormattedMessage id="footer.copyright" defaultMessage="© {year} StockManager. Tous droits réservés." values={{ year: new Date().getFullYear() }} />
          </p>

          {/* Links */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              <FormattedMessage id="footer.privacy" defaultMessage="Confidentialité" />
            </a>
            <a href="#" className="hover:text-foreground">
              <FormattedMessage id="footer.terms" defaultMessage="Conditions" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
