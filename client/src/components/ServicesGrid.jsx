import { useNavigate } from 'react-router-dom';
import './ServicesGrid.css';

const SERVICES = [
  {
    id: 'veterinary',
    title: 'Veterinary Medicine',
    titleHi: 'पशु चिकित्सा परामर्श',
    desc: 'Expert clinical diagnostics, surgery, vaccinations & wellness health checks.',
    tag: 'Licensed Clinics',
    img: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&h=300&fit=crop',
    accent: 'sage',
  },
  {
    id: 'grooming',
    title: 'Doorstep Grooming & Spa',
    titleHi: 'होम ग्रूमिंग व स्पा सेवाएं',
    desc: 'Stress-free therapeutic baths, precision haircuts, hygiene styling & ear care.',
    tag: 'At-Home Service',
    img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&h=300&fit=crop',
    accent: 'terracotta',
  },
  {
    id: 'training',
    title: 'Behavior & Training',
    titleHi: 'पालतू अनुशासन व ट्रेनिंग',
    desc: 'Positive reinforcement, puppy socialization & certified behavioral therapy.',
    tag: 'Certified Trainers',
    img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=300&fit=crop',
    accent: 'navy',
  },
  {
    id: 'supplies',
    title: 'Veterinary Nutrition & Pharmacy',
    titleHi: 'पेट आहार व आवश्यक सामग्री',
    desc: 'Prescription diets, clinical supplements, daily care & pharmacy essentials.',
    tag: 'Verified Authentic',
    img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=300&fit=crop',
    accent: 'sage',
  },
];

export default function ServicesGrid() {
  const navigate = useNavigate();

  return (
    <section className="services-section">
      <div className="services-header">
        <div>
          <span className="services-eyebrow">Comprehensive Healthcare</span>
          <h2 className="services-title">Specialized Services for Companion Wellness</h2>
        </div>
        <p className="services-subtitle">
          विश्वसनीय डॉक्टरों और प्रमाणित विशेषज्ञों द्वारा देखभाल — बिना किसी छिपे शुल्क के
        </p>
      </div>

      <div className="services-grid">
        {SERVICES.map((service) => (
          <div
            key={service.id}
            className={`service-card service-card--${service.accent}`}
            onClick={() => navigate(`/providers?category=${service.id}`)}
          >
            <div className="service-card__media">
              <img src={service.img} alt={service.title} className="service-card__img" loading="lazy" />
              <span className={`service-card__tag service-card__tag--${service.accent}`}>
                {service.tag}
              </span>
            </div>
            <div className="service-card__body">
              <div className="service-card__headings">
                <h3 className="service-card__title">{service.title}</h3>
                <span className="service-card__title-hi">{service.titleHi}</span>
              </div>
              <p className="service-card__desc">{service.desc}</p>
              <div className="service-card__cta">
                <span>Browse Specialists</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}