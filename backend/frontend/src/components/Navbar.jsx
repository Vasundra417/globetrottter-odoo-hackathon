// frontend/src/components/Navbar.jsx

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <h2>🌍 GlobeTrotter</h2>
        </div>

        <div style={styles.links}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={styles.link}
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/create-trip')}
            style={styles.link}
          >
            Create Trip
          </button>
          <button 
            onClick={() => navigate('/admin')}
            style={styles.link}
          >
            Admin
          </button>
        </div>

        <div style={styles.user}>
          <span>Welcome, {user?.email}</span>
          <button 
            onClick={handleLogout}
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: { margin: 0 },
  links: {
    display: 'flex',
    gap: '20px'
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '8px 12px'
  },
  user: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};