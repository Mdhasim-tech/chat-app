'use client';
import { useState } from 'react';
import styles from './Login.module.css';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router=useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Login successful ✅');
      localStorage.setItem('user', JSON.stringify(data.user)); // ✅
      router.push('/chat');


      // You can redirect here if needed
    } else {
      setMessage(data.error || 'Login failed ❌');
    }
  };
  console.log(message)

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
