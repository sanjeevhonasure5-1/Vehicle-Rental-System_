import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState({
    serviceType: 'Branch Pick-up',
    location: '',
    vehicleType: 'All',
    pickupDate: '',
    returnDate: '',
    selectedVehicle: null,
  });

  const updateBooking = (fields) => {
    setBooking((prev) => ({ ...prev, ...fields }));
  };

  return (
    <BookingContext.Provider value={{ booking, updateBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);