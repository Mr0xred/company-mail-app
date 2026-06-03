import { useState } from 'react';
import { Mail, Lock, Shield } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulasi proses login ke server (dummy)
    setTimeout(() => {
      if (email && password.length >= 6) {
        onLogin(email);
      } else {
        setError('Email atau password salah. (Hint: password minimal 6 karakter)');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span style={{ color: 'var(--accent-color)' }}>MAMAS</span> Mail
          </div>
          <p className="login-subtitle">Sign in to your enterprise workspace</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@mr0xred.my.id"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <Shield size={14} /> Secured by MAMAS Enterprise TLS 1.3
        </div>
      </div>
    </div>
  );
}
