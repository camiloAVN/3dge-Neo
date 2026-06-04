import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand3DGE } from "@/components/ui/brand/Brand3DGE";
import styles from "./auth.module.css";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className={styles.container}>
      <div className={styles.page}>

        {/* ── LEFT: blue brand panel ── */}
        <div className={styles.left}>
          <div className={styles.blueTop}>EST.&nbsp;2024</div>
          <div className={styles.vert}>Orden en la pared</div>
          <div className={styles.mark}>
            <Brand3DGE size={40} priority />
          </div>
        </div>

        {/* ── RIGHT: form panel ── */}
        <div className={styles.right}>
          <div className={styles.rightInner}>
            <Link href="/" className={styles.backLink}>
              ← <Brand3DGE size={20} />
            </Link>
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
