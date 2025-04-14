// app/page.tsx or pages/index.js

import Link from "next/link";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>💬 RealTimeChat</div>
        <div className={styles.navLinks}>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Chat Freely. Instantly. Securely.</h1>
        <p>Real-time messaging powered by Socket.IO and Next.js.</p>
        <Link href="/login" className={styles.ctaBtn}>
          Start Chatting
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        Made with ❤️ by Next.js<br />
        © {new Date().getFullYear()} YourName. All rights reserved.
      </footer>
    </div>
  );
}
