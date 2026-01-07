// frontend/src/pages/AdminLogin.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    
    // HARDCODED ADMIN CREDENTIALS
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Store admin session
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminUser', username);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <h1 style={styles.title}>🔐 Admin Login</h1>
          <p style={styles.subtitle}>Access restricted to administrators only</p>
        </div>

        <form onSubmit={handleAdminLogin} style={styles.form}>
          {error && (
            <div style={styles.error}>
              ❌ {error}
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Enter admin username"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter admin password"
              required
            />
          </div>

          <button type="submit" style={styles.loginBtn}>
            Login as Admin
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            style={styles.backBtn}
          >
            ← Back to User Login
          </button>
        </form>

        <div style={styles.info}>
          <p style={styles.infoText}>
            Default credentials:<br/>
            Username: <strong>admin</strong><br/>
            Password: <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1e3a8a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  loginBox: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    transition: 'border 0.2s',
  },
  loginBtn: {
    padding: '14px',
    backgroundColor: '#1e3a8a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  backBtn: {
    padding: '12px',
    backgroundColor: '#f3f4f6',
    color: '#666',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  info: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f0f9ff',
    borderRadius: '8px',
    border: '1px solid #bfdbfe',
  },
  infoText: {
    fontSize: '13px',
    color: '#1e40af',
    margin: 0,
    lineHeight: 1.6,
  },
};