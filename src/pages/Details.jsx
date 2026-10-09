import { useNavigate, Navigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

export default function Details() {
  const navigate = useNavigate();
  const { booking } = useBooking();
  const car = booking.selectedVehicle;

  if (!car) return <Navigate to="/" />;

  const start = new Date(booking.pickupDate);
  const end = new Date(booking.returnDate);
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  
  const subtotal = car.daily_rate * days;
  const deliveryFee = booking.serviceType === 'Doorstep Delivery' ? 1000 : 0;
  const gst = subtotal * 0.18;
  const total = subtotal + deliveryFee + gst;

  return (
    <div className="mt-8 max-w-5xl mx-auto">
      <button onClick={() => navigate('/browse')} className="text-sm font-medium text-slate-600 mb-6 flex items-center gap-2">
        ← Back to Vehicles
      </button>

      <h2 className="text-3xl font-bold mb-8">Review Vehicle Details</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit">
          <div className="h-72 bg-gray-100">
             <img src={car.image_url} alt={car.name} className="w-full h-full object-cover mix-blend-multiply" />
          </div>
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900">{car.name} ({car.type})</h3>
            <h4 className="font-semibold text-lg mt-8 mb-4">Vehicle Specifications</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border p-4 rounded-lg text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase">Transmission</span>
                <span className="font-semibold">{car.transmission}</span>
              </div>
              <div className="border p-4 rounded-lg text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase">Seats</span>
                <span className="font-semibold">{car.seats}</span>
              </div>
              <div className="border p-4 rounded-lg text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase">Fuel</span>
                <span className="font-semibold">{car.fuel_type}</span>
              </div>
              <div className="border p-4 rounded-lg text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase">Bags</span>
                <span className="font-semibold">{car.bags}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
            <h3 className="text-lg font-bold mb-4">Rental Summary</h3>
            <div className="space-y-3 text-sm text-gray-600 border-b pb-4 mb-4">
              <div className="flex justify-between">
                <span>Daily Rate</span><span>₹{car.daily_rate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Rental Duration</span><span>{days} Days</span>
              </div>
              <div className="flex justify-between text-gray-900 font-medium pt-2">
                <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{booking.serviceType}</span><span>₹{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span><span>₹{gst.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xl font-bold mb-6 text-gray-900">
              <span>Total Amount</span><span>₹{total.toLocaleString()}</span>
            </div>
            
            <button onClick={() => navigate('/confirm')} className="w-full bg-slate-900 text-white font-semibold py-3 rounded-md hover:bg-slate-800">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}