import Link from "next/link";
import { LoginForm } from "./ui/LoginForm";
import { Brand3DGE } from "@/components/ui/brand/Brand3DGE";
import styles from "../auth.module.css";

type Props = {
  searchParams: Promise<{ redirectTo?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { redirectTo } = await searchParams;

  return (
    <>
      <h1 className={styles.heading}>Iniciar<br />sesión.</h1>
      <div className={styles.rule} />
      <p className={styles.subtitle} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Brand3DGE size={16} /> · Accede a tu cuenta
      </p>

      <LoginForm redirectTo={redirectTo} />

      <p className={styles.switchText}>
        ¿No tienes cuenta?{" "}
        <Link href="/auth/new-account" className={styles.switchLink}>
          Regístrate
        </Link>
      </p>
    </>
  );
}
