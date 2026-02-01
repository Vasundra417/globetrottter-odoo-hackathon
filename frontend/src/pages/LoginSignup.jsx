import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import axios from 'axios';

export default function LoginSignup() {
  const searchParams = new URLSearchParams(window.location.search);
  const isSignupMode = searchParams.get('mode') === 'signup' || window.location.pathname === '/signup';

  const [mode, setMode] = useState(isSignupMode ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        // Validate fields for signup
        if (!firstName.trim() || !lastName.trim()) {
          setError('First name and last name are required');
          setLoading(false);
          return;
        }

        // Call signup API
        const signupResponse = await axios.post('http://localhost:8000/api/auth/signup', {
          email: email.trim(),
          password: password,
          first_name: firstName.trim(),
          last_name: lastName.trim()
        });

        // After successful signup, automatically log them in
        if (signupResponse.data) {
          const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
            email: email.trim(),
            password: password
          });

          if (loginResponse.data.token) {
            login(loginResponse.data.user, loginResponse.data.token);
            navigate('/dashboard');
          }
        }
      } else {
        // Call login API
        const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
          email: email.trim(),
          password: password
        });

        console.log('Login response:', loginResponse.data);

        if (loginResponse.data.token) {
          // Store user data using context
          login(loginResponse.data.user, loginResponse.data.token);
          navigate('/dashboard');
        } else {
          setError('Login failed. Invalid credentials.');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data.detail || 'Authentication failed');
      } else if (err.request) {
        // No response from server
        setError('Cannot connect to server. Please check if backend is running.');
      } else {
        // Other errors
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  return (
    <div style={styles.container}>
      {/* Background */}
      <div style={styles.background}></div>

      {/* Card */}
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            {mode === 'login' ? '🔓 Sign In' : '🔐 Sign Up'}
          </h1>
          <p style={styles.subtitle}>
            {mode === 'login' 
              ? 'Welcome back to GlobeTrotter' 
              : 'Join GlobeTrotter today'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.error}>
            <span style={styles.errorIcon}>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={styles.input}
                  placeholder="John"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={styles.input}
                  placeholder="Doe"
                  required
                />
              </div>
            </>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="your@email.com"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>⏳ {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</>
            ) : (
              mode === 'signup' ? '✓ Create Account' : '→ Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}></div>

        {/* Toggle Mode */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            {mode === 'signup'
              ? 'Already have an account?'
              : "Don't have an account?"}
          </p>
          <button
            type="button"
            onClick={handleToggleMode}
            style={styles.toggleBtn}
          >
            {mode === 'signup' ? '← Sign In' : 'Sign Up →'}
          </button>
        </div>

        {/* Back to Landing */}
        <button
          type="button"
          onClick={() => navigate('/')}
          style={styles.backBtn}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: 'hidden',
    margin: 0,
    boxSizing: 'border-box'
  },
  
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    zIndex: -1
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '40px 32px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '450px',
    animation: 'slideIn 0.4s ease-out'
  },

  header: {
    marginBottom: '30px',
    textAlign: 'center'
  },

  title: {
    margin: '0 0 10px 0',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a1a'
  },

  subtitle: {
    margin: '0',
    fontSize: '14px',
    color: '#666',
    fontWeight: '400'
  },

  error: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    color: '#856404',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px'
  },

  errorIcon: {
    fontSize: '16px'
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px'
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },

  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  input: {
    padding: '12px 14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    outline: 'none',
    ':focus': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  },

  submitBtn: {
    padding: '14px 16px',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
    marginTop: '8px'
  },

  divider: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '24px 0'
  },

  footer: {
    textAlign: 'center',
    marginBottom: '16px'
  },

  footerText: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 8px 0'
  },

  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    padding: '0',
    transition: 'color 0.3s'
  },

  backBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    color: '#667eea',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'background-color 0.3s'
  }
};