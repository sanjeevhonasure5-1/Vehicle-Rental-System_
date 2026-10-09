import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useBooking } from '../context/BookingContext';

export default function Browse() {
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [priceRange, setPriceRange] = useState(25000);
  const [typeFilter, setTypeFilter] = useState(booking.vehicleType || 'All');

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true);
      let query = supabase.from('vehicles').select('*').eq('is_available', true);
      
      if (typeFilter !== 'All') query = query.eq('type', typeFilter);
      query = query.lte('daily_rate', priceRange);
      
      const { data, error } = await query;
      if (!error) setVehicles(data);
      setLoading(false);
    }
    fetchVehicles();
  }, [typeFilter, priceRange]);

  const handleSelectVehicle = (car) => {
    updateBooking({ selectedVehicle: car });
    navigate('/details');
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-10">
      <aside className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-sm h-fit">
        <h3 className="text-lg font-bold mb-4">Filter</h3>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Vehicle Type</h4>
          <div className="space-y-2">
            {['All', 'Sedan', 'SUV', 'Van', 'Compact'].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" name="type" className="accent-slate-900" 
                  checked={typeFilter === type}
                  onChange={() => setTypeFilter(type)} 
                />
                {type === 'Van' ? 'MPV' : type}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Max Price Range</h4>
          <input 
            type="range" min="500" max="25000" step="500"
            value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
            className="w-full accent-slate-900" 
          />
          <div className="flex justify-between text-sm mt-2 font-medium">
            <span>₹500</span>
            <span>₹{Number(priceRange).toLocaleString()}</span>
          </div>
        </div>
      </aside>

      <main className="w-full md:w-3/4">
        <h2 className="text-xl font-bold mb-4">Available Vehicles</h2>
        
        {loading ? (
          <p>Loading database inventory...</p>
        ) : vehicles.length === 0 ? (
          <p>No vehicles match your current filters.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vehicles.map((car) => (
              <div key={car.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="relative h-48 bg-gray-100">
                  <img src={car.image_url} alt={car.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{car.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">₹{car.daily_rate.toLocaleString()} / day</p>
                  </div>
                  <button 
                    onClick={() => handleSelectVehicle(car)}
                    className="w-full bg-slate-900 text-white font-semibold py-2 rounded mt-4 hover:bg-slate-800"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}