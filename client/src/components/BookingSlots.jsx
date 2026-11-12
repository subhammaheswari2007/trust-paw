import { useState, useMemo } from 'react';
import { formatTime } from '../utils/formatters';
import './BookingSlots.css';

export default function BookingSlots({
  availableSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
  onSelectSlot,
  selectedDate,
  selectedSlot,
}) {
  // Generate next 7 days starting from today
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
      {/* Date Picker Row */}
      <div className="booking-slots__section">
        <div className="booking-slots__header">
          <span className="slots-eyebrow">Step 1</span>
          <h4 className="slots-title">Select Consultation Date</h4>
          <span className="slots-subtitle">दिनांक चुनें</span>
        </div>

        <div className="booking-slots__date-row">
          {nextDays.map((d) => {
            const isSelected = activeDate === d.iso;
            return (
              <button
                key={d.iso}
                type="button"
                className={`date-pill ${isSelected ? 'date-pill--active' : ''}`}
                onClick={() => handleDatePick(d.iso)}
              >
                <span className="date-pill__weekday">{d.dayName}</span>
                <span className="date-pill__num">{d.dayNum}</span>
                <span className="date-pill__month">{d.month}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Picker Grid */}
      <div className="booking-slots__section">
        <div className="booking-slots__header">
          <span className="slots-eyebrow">Step 2</span>
          <h4 className="slots-title">Select Time Slot</h4>
          <span className="slots-subtitle">उपलब्ध समय स्लॉट</span>
        </div>

        <div className="booking-slots__grid">
          {availableSlots.map((slot) => {
            const isSelected = activeSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                className={`time-chip ${isSelected ? 'time-chip--active' : ''}`}
                onClick={() => handleSlotPick(slot)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="time-chip__icon">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{formatTime(slot)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}