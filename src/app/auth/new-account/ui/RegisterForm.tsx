"use client";

import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";
import { loginData, registerUser } from "@/actions";
import styles from "../../auth.module.css";

type FormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [serverError, setServerError]   = useState("");

  const password = watch("password");

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setServerError("");
    const resp = await registerUser(data.name, data.email, data.password);
    if (!resp.ok) { setServerError(resp.message); return; }
    await loginData(data.email.toLowerCase(), data.password);
    window.location.replace("/");
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={styles.form}>

      {serverError && (
        <div className={styles.errorBanner}>
          <span>{serverError}</span>
        </div>
      )}

      {/* Name */}
      <div className={styles.field}>
        <label className={styles.label}>Nombre</label>
        <input
          type="text"
          placeholder="Tu nombre"
          className={clsx(styles.input, { [styles.inputError]: errors.name })}
          {...register("name", {
            required: "El nombre es obligatorio",
            minLength: { value: 2, message: "Mínimo 2 caracteres" },
            maxLength: { value: 100, message: "Máximo 100 caracteres" },
          })}
          maxLength={100}
        />
        {errors.name && <p className={styles.fieldError}>{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className={styles.field}>
        <label className={styles.label}>Correo electrónico</label>
        <input
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          className={clsx(styles.input, { [styles.inputError]: errors.email })}
          {...register("email", {
            required: "El correo es obligatorio",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Correo electrónico inválido",
            },
          })}
        />
        {errors.email && <p className={styles.fieldError}>{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className={styles.field}>
        <label className={styles.label}>Contraseña</label>
        <div className={styles.inputWrap}>
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            className={clsx(styles.input, styles.inputWithToggle, { [styles.inputError]: errors.password })}
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 8, message: "Mínimo 8 caracteres" },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className={styles.toggle}
            aria-label={showPassword ? "Ocultar" : "Mostrar"}
          >
            {showPassword ? <LuEye size={15} /> : <LuEyeOff size={15} />}
          </button>
        </div>
        {errors.password && <p className={styles.fieldError}>{errors.password.message}</p>}
      </div>

      {/* Confirm password */}
      <div className={styles.field}>
        <label className={styles.label}>Confirmar contraseña</label>
        <div className={styles.inputWrap}>
          <input
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repite tu contraseña"
            className={clsx(styles.input, styles.inputWithToggle, { [styles.inputError]: errors.confirmPassword })}
            {...register("confirmPassword", {
              required: "Confirma tu contraseña",
              validate: v => v === password || "Las contraseñas no coinciden",
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(v => !v)}
            className={styles.toggle}
            aria-label={showConfirm ? "Ocultar" : "Mostrar"}
          >
            {showConfirm ? <LuEye size={15} /> : <LuEyeOff size={15} />}
          </button>
        </div>
        {errors.confirmPassword && <p className={styles.fieldError}>{errors.confirmPassword.message}</p>}
      </div>

      {/* Submit */}
      <button type="submit" disabled={isSubmitting} className={styles.submit}>
        <span>{isSubmitting ? "Creando cuenta..." : "Crear cuenta"}</span>
        <span>{isSubmitting ? "…" : "→"}</span>
      </button>

    </form>
  );
};
