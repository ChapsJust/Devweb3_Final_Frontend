import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldContent } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { useLocale } from "@/context/LocaleContextType";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { intl } = useLocale();
  const [serverError, setServerError] = useState("");

  const formSchema = z.object({
    email: z.string().email(intl.formatMessage({ id: "login.form.emailInvalid", defaultMessage: "L'email n'est pas valide" })),
    password: z.string().min(1, intl.formatMessage({ id: "login.form.passwordRequired", defaultMessage: "Le mot de passe est requis" })),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    try {
      await login(values.email, values.password);
      navigate("/");
    } catch (error) {
      setServerError((error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <Field data-invalid={!!errors.email}>
        <FieldLabel>
          <FormattedMessage id="login.form.email" defaultMessage="Email" />
        </FieldLabel>
        <FieldContent>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="email" placeholder={intl.formatMessage({ id: "login.form.emailPlaceholder", defaultMessage: "votre@email.com" })} className="pl-10" {...register("email")} />
          </div>
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.password}>
        <FieldLabel>
          <FormattedMessage id="login.form.password" defaultMessage="Mot de passe" />
        </FieldLabel>
        <FieldContent>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="password" placeholder="••••••••" className="pl-10" {...register("password")} />
          </div>
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </FieldContent>
      </Field>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <FormattedMessage id="login.form.submitting" defaultMessage="Connexion en cours..." />
          </>
        ) : (
          <FormattedMessage id="login.form.submit" defaultMessage="Se connecter" />
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <FormattedMessage id="login.form.noAccount" defaultMessage="Pas encore de compte ?" />{" "}
        <Link to="/register" className="text-primary hover:underline font-medium">
          <FormattedMessage id="login.form.register" defaultMessage="S'inscrire" />
        </Link>
      </p>
    </form>
  );
}
