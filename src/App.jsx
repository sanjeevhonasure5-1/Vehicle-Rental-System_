import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { BookingProvider } from './context/BookingContext';
import Search from './pages/Search';
import Browse from './pages/Browse';
import Details from './pages/Details';
import Confirm from './pages/Confirm';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import Bookings from './pages/Bookings'; // Import bookings page

function Navigation() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b border-gray-100">
      <Link to="/" className="text-xl font-bold text-slate-900">DriveGo</Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-600 hover:text-slate-900 font-medium">Home</Link>
        <Link to="/browse" className="text-gray-600 hover:text-slate-900 font-medium">Browse</Link>
        
        {session ? (
          <div className="flex items-center gap-4">
            <Link to="/bookings" className="text-sm text-gray-700 hover:text-slate-900 font-medium">My Bookings</Link>
            <Link to="/settings" className="text-sm text-gray-700 hover:text-slate-900 font-medium">Settings</Link>
            <span className="text-sm text-gray-500 hidden md:inline">{session.user.email}</span>
            <button 
              onClick={handleSignOut}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/signin" className="text-gray-700 font-medium px-4 py-2 hover:text-slate-900">Sign In</Link>
            <Link to="/signup" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <div className="flex-grow max-w-7xl mx-auto px-4 w-full">
            <Routes>
              <Route path="/" element={<Search />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/details" element={<Details />} />
              <Route path="/confirm" element={<Confirm />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/bookings" element={<Bookings />} />
            </Routes>
          </div>
        </div>
      </Router>
    </BookingProvider>
  );
}