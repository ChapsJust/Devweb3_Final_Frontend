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
import { fr } from "date-fns/locale";
import { Loader2, Mail, Lock, User, AlertCircle, CalendarIcon, MapPin } from "lucide-react";

const formSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("L'email n'est pas valide"),
    address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string(),
    dateOfBirth: z.date({ error: "La date de naissance est requise" }).refine(
      (date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        return age > 18 || (age === 18 && monthDiff >= 0);
      },
      { message: "Vous devez avoir au moins 18 ans" }
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState("");

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <Field data-invalid={!!errors.name}>
        <FieldLabel>Nom complet</FieldLabel>
        <FieldContent>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="John Doe" className="pl-10" {...register("name")} />
          </div>
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.email}>
        <FieldLabel>Email</FieldLabel>
        <FieldContent>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="email" placeholder="votre@email.com" className="pl-10" {...register("email")} />
          </div>
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.dateOfBirth}>
        <FieldLabel>Date de naissance</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className={"w-full justify-start text-left font-normal cursor-pointer"}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "dd MMMM yyyy", { locale: fr }) : "Sélectionnez une date"}
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
        <FieldLabel>Adresse</FieldLabel>
        <FieldContent>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="123 Rue Example, Ville" className="pl-10" {...register("address")} />
          </div>
          {errors.address && <FieldError>{errors.address.message}</FieldError>}
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.password}>
        <FieldLabel>Mot de passe</FieldLabel>
        <FieldContent>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="password" placeholder="••••••••" className="pl-10" {...register("password")} />
          </div>
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.confirmPassword}>
        <FieldLabel>Confirmer le mot de passe</FieldLabel>
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
            Inscription en cours...
          </>
        ) : (
          "S'inscrire"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
