import { useState } from 'react';

export default function SignUp({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', {  // backend route for signup
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token); // store JWT
        onLogin(data.user); // pass user info to parent
      } else {
        const err = await res.json();
        alert(err.message || 'Signup failed');
      }
    } catch (error) {
      console.error(error);
      alert('Signup failed due to network error');
    }
  }

  return (
    <form onSubmit={submit} className="signup-form">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
