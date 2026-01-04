import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';

// Page imports
import Landing from './pages/Landing';
import LoginSignup from './pages/LoginSignup';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import Budget from './pages/Budget';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <Router>
          <div style={styles.appContainer}>
            <Routes>
              {/* Landing Page - Entry Point */}
              <Route path="/" element={<Landing />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginSignup />} />
              <Route path="/signup" element={<LoginSignup />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <div style={styles.pageWrapper}>
                  <Navbar />
                  <div style={styles.pageContent}>
                    <Dashboard />
                  </div>
                </div>
              } />
              
              <Route path="/create-trip" element={
                <div style={styles.pageWrapper}>
                  <Navbar />
                  <div style={styles.pageContent}>
                    <CreateTrip />
                  </div>
                </div>
              } />
              
              <Route path="/trip/:tripId/itinerary" element={
                <div style={styles.pageWrapper}>
                  <Navbar />
                  <div style={styles.pageContent}>
                    <ItineraryBuilder />
                  </div>
                </div>
              } />
              
              <Route path="/trip/:tripId/view" element={
                <div style={styles.pageWrapper}>
                  <Navbar />
                  <div style={styles.pageContent}>
                    <ItineraryView />
                  </div>
                </div>
              } />
              
              <Route path="/trip/:tripId/budget" element={
                <div style={styles.pageWrapper}>
                  <Navbar />
                  <div style={styles.pageContent}>
                    <Budget />
                  </div>
                </div>
              } />
              
              <Route path="/admin" element={
                <div style={styles.pageWrapper}>
                  <Navbar />
                  <div style={styles.pageContent}>
                    <AdminDashboard />
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </Router>
      </TripProvider>
    </AuthProvider>
  );
}

const styles = {
  appContainer: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  
  pageWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  
  pageContent: {
    flex: 1,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px'
  }
};

export default App;