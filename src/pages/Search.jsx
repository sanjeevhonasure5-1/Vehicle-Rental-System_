import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

export default function Search() {
  const navigate = useNavigate();
  const { updateBooking } = useBooking();
  
  const [serviceType, setServiceType] = useState('Branch Pick-up');
  const [location, setLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('All');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    updateBooking({ serviceType, location, vehicleType, pickupDate, returnDate });
    navigate('/browse');
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-3xl font-bold mb-8">Book Your Vehicle Rental</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          <button 
            type="button"
            className={`flex-1 py-2 rounded-full font-medium transition-colors ${serviceType === 'Branch Pick-up' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            onClick={() => { setServiceType('Branch Pick-up'); setLocation(''); }}
          >
            Branch Pick-up
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 rounded-full font-medium transition-colors ${serviceType === 'Doorstep Delivery' ? 'bg-slate-900 shadow-sm text-white' : 'text-gray-500'}`}
            onClick={() => { setServiceType('Doorstep Delivery'); setLocation(''); }}
          >
            Doorstep Delivery
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {serviceType === 'Branch Pick-up' ? 'Select Branch Location' : 'Specific Street Address'}
            </label>
            
            {serviceType === 'Branch Pick-up' ? (
              <select 
                value={location} 
                onChange={e => setLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white"
                required
              >
                <option value="">Select a pickup branch</option>
                <option value="Yelahanka Old Town">Yelahanka Old Town</option>
                <option value="Yeshwantpur Railway Station">Yeshwantpur Railway Station</option>
                <option value="K R Circle">K R Circle (Central)</option>
                <option value="Hebbal Outer Ring Road">Hebbal Outer Ring Road</option>
                <option value="Jayanagar 4th Block">Jayanagar 4th Block</option>
                <option value="Indiranagar 100ft Road">Indiranagar 100ft Road</option>
                <option value="Koramangala 5th Block">Koramangala 5th Block</option>
                <option value="MG Road Metro Station">MG Road Metro Station</option>
                <option value="Electronic City Phase 1">Electronic City Phase 1</option>
                <option value="Kempegowda International Airport">Kempegowda International Airport (BLR)</option>
              </select>
            ) : (
              <input 
                type="text" 
                required 
                value={location} 
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g., 123, MG Road, Bengaluru, Karnataka"
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-slate-900 outline-none"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
              <input type="date" required value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
              <input type="date" required value={returnDate} onChange={e => setReturnDate(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white font-semibold py-3 rounded-md mt-6 hover:bg-slate-800">
            Search Available Vehicles
          </button>
        </form>
      </div>
    </div>
  );
}