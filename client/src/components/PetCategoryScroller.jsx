import { useRef, useState } from 'react';
import './PetCategoryScroller.css';

const PET_TYPES = [
  {
    id: null,
    label: 'All Companions',
    labelHi: 'सभी साथी',
    img: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=160&h=160&fit=crop&crop=faces',
  },
  {
    id: 'dog',
    label: 'Dogs',
    labelHi: 'कुत्ता',
    img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=160&h=160&fit=crop&crop=faces',
  },
  {
    id: 'cat',
    label: 'Cats',
    labelHi: 'बिल्ली',
    img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=160&h=160&fit=crop&crop=faces',
  },
  {
    id: 'rabbit',
    label: 'Rabbits',
    labelHi: 'खरगोश',
    img: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=160&h=160&fit=crop&crop=faces',
  },
  {
    id: 'bird',
    label: 'Avian & Birds',
    labelHi: 'पक्षी',
    img: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=160&h=160&fit=crop&crop=faces',
  },
];

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
    <section className="pet-scroller-section">
      <div className="pet-scroller-header">
        <div>
          <span className="pet-scroller-eyebrow">Companion Species</span>
          <h3 className="pet-scroller-title">Tailored Care by Pet Type</h3>
        </div>
        <span className="pet-scroller-subtitle">अपने पालतू साथी के अनुसार विशेषज्ञ खोजें</span>
      </div>

      <div
        ref={scrollerRef}
        className={`pet-scroller ${isDragging ? 'pet-scroller--dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
      >
        {PET_TYPES.map((pet) => {
          const isActive = selectedCategory === pet.id;
          return (
            <button
              key={pet.label}
              type="button"
              className={`pet-card ${isActive ? 'pet-card--active' : ''}`}
              onClick={() => onSelectCategory(pet.id)}
            >
              <div className="pet-card__media">
                <img src={pet.img} alt={pet.label} className="pet-card__image" loading="lazy" />
              </div>
              <div className="pet-card__info">
                <span className="pet-card__label">{pet.label}</span>
                <span className="pet-card__sublabel">{pet.labelHi}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}