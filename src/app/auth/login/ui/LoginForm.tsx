"use client";

import { useActionState, useEffect, useState } from "react";
import { LuEye, LuEyeOff, LuCircleAlert } from "react-icons/lu";
import { login } from "@/actions";
import clsx from "clsx";
import styles from "../../auth.module.css";

interface Props {
  redirectTo?: string;
}

export const LoginForm = ({ redirectTo = "/" }: Props) => {
  const [errorMessage, formAction, isPending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (errorMessage === "Success") {
      window.location.replace(redirectTo);
    }
  }, [errorMessage]);

  const hasError = !!errorMessage && errorMessage !== "Success";

  return (
    <form action={formAction} className={styles.form}>

      {/* Error banner */}
      {hasError && (
        <div className={styles.errorBanner}>
          <LuCircleAlert size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Email */}
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Correo electrónico
        </label>
        <div className={styles.inputWrap}>
          <input
            id="email"
            name="email"
            type="email"
            disabled={isPending}
            autoComplete="email"
            placeholder="tu@correo.com"
            className={styles.input}
          />
        </div>
      </div>

      {/* Password */}
      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Contraseña
        </label>
        <div className={styles.inputWrap}>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            disabled={isPending}
            autoComplete="current-password"
            placeholder="••••••••"
            className={clsx(styles.input, styles.inputWithToggle)}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(v => !v)}
            className={styles.toggle}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <LuEye size={15} /> : <LuEyeOff size={15} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={isPending} className={styles.submit}>
        <span>{isPending ? "Verificando..." : "Entrar"}</span>
        <span>{isPending ? "…" : "→"}</span>
      </button>

    </form>
  );
};
