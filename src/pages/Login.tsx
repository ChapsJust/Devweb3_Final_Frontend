import LoginForm from "@/components/auth/LoginForm";
import { TrendingUp } from "lucide-react";
import { FormattedMessage } from "react-intl";

export default function Login() {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <TrendingUp className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          <FormattedMessage id="login.title" defaultMessage="Connexion" />
        </h1>
        <p className="text-gray-600 mt-2">
          <FormattedMessage id="login.description" defaultMessage="Connectez-vous pour accéder à votre portfolio" />
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <LoginForm />
      </div>
    </div>
  );
}
