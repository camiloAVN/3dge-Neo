import Link from "next/link";
import { RegisterForm } from "./ui/RegisterForm";
import { Brand3DGE } from "@/components/ui/brand/Brand3DGE";
import styles from "../auth.module.css";

export default function RegisterPage() {
  return (
    <>
      <h1 className={styles.heading}>Crear<br />cuenta.</h1>
      <div className={styles.rule} />
      <p className={styles.subtitle} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Brand3DGE size={16} /> · Nueva cuenta
      </p>

      <RegisterForm />

      <p className={styles.switchText}>
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className={styles.switchLink}>
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
