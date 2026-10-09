import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBookings() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Please sign in to view your bookings.');
        setLoading(false);
        return;
      }

      // Fetch bookings and join vehicle details
      const { data, error } = await supabase
        .from('bookings')
        .select('*, vehicles(name, daily_rate)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setBookings(data || []);
      }
      setLoading(false);
    }

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading your reservations...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-slate-900">My Reserved History</h2>
      
      {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</p>}

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-600 mb-4">You have no vehicle reservations yet.</p>
          <Link to="/browse" className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors">
            Browse Vehicles
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{booking.vehicles?.name || 'Vehicle Rental'}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Pickup: <span className="font-medium text-gray-700">{booking.pickup_date}</span> | Return: <span className="font-medium text-gray-700">{booking.return_date}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Booked on: {new Date(booking.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-slate-900">₹{booking.total_price}</span>
                <div className="mt-1">
                  <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Confirmed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}