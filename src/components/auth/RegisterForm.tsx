import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FieldLabel, FieldError, FieldContent } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Loader2, Mail, Lock, User, AlertCircle, CalendarIcon, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormattedMessage } from "react-intl";
import { useLocale } from "@/context/LocaleContextType";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { intl, locale } = useLocale();
  const [serverError, setServerError] = useState("");

  const formSchema = z
    .object({
      name: z.string().min(2, intl.formatMessage({ id: "register.form.nameMin", defaultMessage: "Le nom doit contenir au moins 2 caractères" })),
      email: z.email(intl.formatMessage({ id: "register.form.emailInvalid", defaultMessage: "L'email n'est pas valide" })),
      address: z.string().min(5, intl.formatMessage({ id: "register.form.addressMin", defaultMessage: "L'adresse doit contenir au moins 5 caractères" })),
      password: z.string().min(6, intl.formatMessage({ id: "register.form.passwordMin", defaultMessage: "Le mot de passe doit contenir au moins 6 caractères" })),
      confirmPassword: z.string(),
      dateOfBirth: z
        .date({
          error: () => ({ message: intl.formatMessage({ id: "register.form.dobRequired", defaultMessage: "La date de naissance est requise" }) }),
        })
        .refine(
          (date) => {
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();
            const monthDiff = today.getMonth() - date.getMonth();
            return age > 18 || (age === 18 && monthDiff >= 0);
          },
          { message: intl.formatMessage({ id: "register.form.dobAge", defaultMessage: "Vous devez avoir au moins 18 ans" }) }
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: intl.formatMessage({ id: "register.form.passwordMatch", defaultMessage: "Les mots de passe ne correspondent pas" }),
      path: ["confirmPassword"],
    });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        dateOfBirth: values.dateOfBirth,
        address: values.address,
      });
      navigate("/");
    } catch (error) {
      setServerError((error as Error).message);
    }
  };

  const dateLocale = locale === "fr" ? fr : enUS;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <Field data-invalid={!!errors.name}>
        <FieldLabel>
          <FormattedMessage id="register.form.name" defaultMessage="Nom complet" />
        </FieldLabel>
        <FieldContent>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={intl.formatMessage({ id: "register.form.namePlaceholder", defaultMessage: "John Doe" })} className="pl-10" {...register("name")} />
          </div>
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.email}>
        <FieldLabel>
          <FormattedMessage id="register.form.email" defaultMessage="Email" />
        </FieldLabel>
        <FieldContent>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="email" placeholder={intl.formatMessage({ id: "register.form.emailPlaceholder", defaultMessage: "votre@email.com" })} className="pl-10" {...register("email")} />
          </div>
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.dateOfBirth}>
        <FieldLabel>
          <FormattedMessage id="register.form.dob" defaultMessage="Date de naissance" />
        </FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "dd MMMM yyyy", { locale: dateLocale }) : intl.formatMessage({ id: "register.form.dobPlaceholder", defaultMessage: "Sélectionnez une date" })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} captionLayout="dropdown" />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.dateOfBirth && <FieldError>{errors.dateOfBirth.message}</FieldError>}
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.address}>
        <FieldLabel>
          <FormattedMessage id="register.form.address" defaultMessage="Adresse" />
        </FieldLabel>
        <FieldContent>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={intl.formatMessage({ id: "register.form.addressPlaceholder", defaultMessage: "123 Rue Example, Ville" })} className="pl-10" {...register("address")} />
          </div>
          {errors.address && <FieldError>{errors.address.message}</FieldError>}
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.password}>
        <FieldLabel>
          <FormattedMessage id="register.form.password" defaultMessage="Mot de passe" />
        </FieldLabel>
        <FieldContent>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="password" placeholder="••••••••" className="pl-10" {...register("password")} />
          </div>
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.confirmPassword}>
        <FieldLabel>
          <FormattedMessage id="register.form.confirmPassword" defaultMessage="Confirmer le mot de passe" />
        </FieldLabel>
        <FieldContent>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="password" placeholder="••••••••" className="pl-10" {...register("confirmPassword")} />
          </div>
          {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
        </FieldContent>
      </Field>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <FormattedMessage id="register.form.submitting" defaultMessage="Inscription en cours..." />
          </>
        ) : (
          <FormattedMessage id="register.form.submit" defaultMessage="S'inscrire" />
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <FormattedMessage id="register.form.hasAccount" defaultMessage="Déjà un compte ?" />{" "}
        <Link to="/login" className="text-primary hover:underline font-medium">
          <FormattedMessage id="register.form.login" defaultMessage="Se connecter" />
        </Link>
      </p>
    </form>
  );
}
