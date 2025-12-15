import { createContext, useContext, useState, type ReactNode } from "react";
import { createIntl, type IntlShape, IntlProvider } from "react-intl";
import Francais from "@/lang/fr.json";
import Anglais from "@/lang/en.json";

type LocaleContextType = {
  locale: string;
  intl: IntlShape;
  changeLocale: (newLocale: string) => void;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale doit être utilisé dans un LocaleProvider");
  }
  return context;
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState("fr");
  const [messages, setMessages] = useState<Record<string, string>>(Francais);

  const intl = createIntl({
    locale: locale,
    messages: messages,
  });

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    setMessages(newLocale === "fr" ? Francais : Anglais);
  };

  return (
    <LocaleContext.Provider value={{ locale, intl, changeLocale }}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}
