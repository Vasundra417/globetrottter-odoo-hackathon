import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';

// Page imports
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
          <div className="app">
            <Routes>
              <Route path="/login" element={<LoginSignup />} />
              
              <Route path="/dashboard" element={
                <>
                  <Navbar />
                  <Dashboard />
                </>
              } />
              
              <Route path="/create-trip" element={
                <>
                  <Navbar />
                  <CreateTrip />
                </>
              } />
              
              <Route path="/trip/:tripId/itinerary" element={
                <>
                  <Navbar />
                  <ItineraryBuilder />
                </>
              } />
              
              <Route path="/trip/:tripId/view" element={
                <>
                  <Navbar />
                  <ItineraryView />
                </>
              } />
              
              <Route path="/trip/:tripId/budget" element={
                <>
                  <Navbar />
                  <Budget />
                </>
              } />
              
              <Route path="/admin" element={
                <>
                  <Navbar />
                  <AdminDashboard />
                </>
              } />
              
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;