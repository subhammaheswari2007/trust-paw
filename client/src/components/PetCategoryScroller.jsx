import { useRef, useState } from 'react';
import { PET_CATEGORIES } from '../utils/constants';
import './PetCategoryScroller.css';

export default function PetCategoryScroller({ selectedCategory, onSelectCategory }) {
  const scrollerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollerRef.current.offsetLeft);
    setScrollLeft(scrollerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="pet-scroller-container">
      <div className="pet-scroller-header">
        <h3 className="pet-scroller-title">Select Your Pet Companion</h3>
        <span className="pet-scroller-subtitle">अपने पालतू साथी को चुनें</span>
      </div>

      <div
        ref={scrollerRef}
        className={`pet-scroller ${isDragging ? 'pet-scroller--dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
      >
        <button
          className={`pet-card ${!selectedCategory ? 'pet-card--active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          <span className="pet-card__icon">🐾</span>
          <span className="pet-card__label">All Pets</span>
          <span className="pet-card__sublabel">सभी</span>
        </button>

        {PET_CATEGORIES.map((pet) => {
          const isSelected = selectedCategory === pet.id;
          return (
            <button
              key={pet.id}
              className={`pet-card ${isSelected ? 'pet-card--active' : ''}`}
              onClick={() => onSelectCategory(isSelected ? null : pet.id)}
            >
              <span className="pet-card__icon">{pet.emoji}</span>
              <span className="pet-card__label">{pet.label}</span>
              <span className="pet-card__sublabel">{pet.labelHi}</span>
              {isSelected && <span className="pet-card__indicator" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}