import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
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
            3<span style={{ fontStyle: "italic" }}>D</span>GE
          </div>
        </div>

        {/* ── RIGHT: form panel ── */}
        <div className={styles.right}>
          <div className={styles.rightInner}>
            <Link href="/" className={styles.backLink}>
              ← 3DGE
            </Link>
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
