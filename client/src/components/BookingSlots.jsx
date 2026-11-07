import { useState, useMemo } from 'react';
import { formatTime } from '../utils/formatters';
import './BookingSlots.css';

export default function BookingSlots({
  availableSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
  onSelectSlot,
  selectedDate,
  selectedSlot,
}) {
  // Generate next 7 days
  const nextDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' });
      const dayNum = d.getDate();
      const month = d.toLocaleDateString('en-IN', { month: 'short' });
      days.push({ iso, dayName, dayNum, month });
    }
    return days;
  }, []);

  const [activeDate, setActiveDate] = useState(selectedDate || nextDays[0].iso);
  const [activeSlot, setActiveSlot] = useState(selectedSlot || null);

  const handleDatePick = (iso) => {
    setActiveDate(iso);
    if (onSelectSlot) onSelectSlot({ date: iso, slot: activeSlot });
  };

  const handleSlotPick = (slot) => {
    setActiveSlot(slot);
    if (onSelectSlot) onSelectSlot({ date: activeDate, slot });
  };

  return (
    <div className="booking-slots-container">
      <div className="booking-slots__date-section">
        <h4 className="booking-slots__section-title">Select Appointment Date / दिनांक चुनें</h4>
        <div className="booking-slots__date-row">
          {nextDays.map((d) => {
            const isSelected = activeDate === d.iso;
            return (
              <button
                key={d.iso}
                type="button"
                className={`booking-slots__date-pill ${
                  isSelected ? 'booking-slots__date-pill--active' : ''
                }`}
                onClick={() => handleDatePick(d.iso)}
              >
                <span className="booking-slots__date-weekday">{d.dayName}</span>
                <span className="booking-slots__date-num">{d.dayNum}</span>
                <span className="booking-slots__date-month">{d.month}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="booking-slots__time-section">
        <h4 className="booking-slots__section-title">Available Time Slots / समय स्लॉट चुनें</h4>
        <div className="booking-slots__grid">
          {availableSlots.map((slot) => {
            const isSelected = activeSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                className={`booking-slots__chip ${
                  isSelected ? 'booking-slots__chip--active' : ''
                }`}
                onClick={() => handleSlotPick(slot)}
              >
                {formatTime(slot)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}