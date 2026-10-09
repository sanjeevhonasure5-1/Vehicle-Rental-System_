import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useBooking } from '../context/BookingContext';

export default function Confirm() {
  const navigate = useNavigate();
  const { booking } = useBooking();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Please sign in or create an account to complete your vehicle reservation.');
        navigate('/signin');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    }
    checkUser();
  }, [navigate]);

  const handleConfirmReservation = async () => {
    setSubmitting(true);
    setError('');

    // FIXED: Changed booking.vehicle to booking.selectedVehicle
    if (!booking || !booking.selectedVehicle) {
      setError('No vehicle selected. Please choose a vehicle first.');
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from('bookings').insert([
      {
        user_id: user.id,
        // FIXED: Changed booking.vehicle to booking.selectedVehicle
        vehicle_id: booking.selectedVehicle.id,
        pickup_date: booking.pickupDate || new Date().toISOString(),
        return_date: booking.returnDate || new Date().toISOString(),
        // FIXED: Changed booking.vehicle to booking.selectedVehicle
        total_price: booking.totalPrice || booking.selectedVehicle.daily_rate,
      }
    ]);

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
    } else {
      alert('Reservation confirmed successfully!');
      navigate('/');
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Verifying session...</div>;
  }

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 text-center">Confirm Your Reservation</h2>

        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</p>}

        {/* FIXED: Changed booking.vehicle to booking.selectedVehicle */}
        {booking && booking.selectedVehicle ? (
          <div className="space-y-4 mb-6">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">Vehicle:</span>
              <span className="font-bold text-slate-900">{booking.selectedVehicle.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">Daily Rate:</span>
              <span className="text-slate-900">₹{booking.selectedVehicle.daily_rate} / day</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">Account Email:</span>
              <span className="text-slate-900">{user?.email}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 mb-6 text-center">No active booking details found.</p>
        )}

        <button 
          onClick={handleConfirmReservation} 
          // FIXED: Changed booking.vehicle to booking.selectedVehicle
          disabled={submitting || !booking?.selectedVehicle}
          className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Processing...' : 'Complete Reservation'}
        </button>
      </div>
    </div>
  );
}