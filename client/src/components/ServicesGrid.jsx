import { useNavigate } from 'react-router-dom';
import './ServicesGrid.css';

export default function ServicesGrid() {
  const navigate = useNavigate();

  const services = [
    {
      id: 'veterinary',
      title: 'Veterinary Consultations',
      titleHi: 'पशु चिकित्सा परामर्श',
      desc: 'Expert care, vaccinations, health checkups & emergency response',
      descHi: 'अनुभवी डॉक्टरों द्वारा 24/7 स्वास्थ्य जांच व उपचार',
      icon: '🏥',
      accent: '#34D399',
    },
    {
      id: 'grooming',
      title: 'Home Grooming Services',
      titleHi: 'होम ग्रूमिंग सेवाएं',
      desc: 'Spa baths, hygienic trimming, de-shedding & ear care at your doorstep',
      descHi: 'घर पर स्पा बाथ, हेयर कटिंग व विशेष सफाई सेवाएं',
      icon: '🛁',
      accent: '#60A5FA',
    },
    {
      id: 'training',
      title: 'Pet Training & Behavior',
      titleHi: 'पालतू प्रशिक्षण व व्यवहार',
      desc: 'Certified behaviorists, puppy socialization & obedience courses',
      descHi: 'प्रमाणित ट्रेनर्स द्वारा अनुशासन व आज्ञाकारिता प्रशिक्षण',
      icon: '🎓',
      accent: '#E8B86D',
    },
    {
      id: 'supplies',
      title: 'Pet Supplies & Nutrition',
      titleHi: 'पेट आहार व आवश्यक सामग्री',
      desc: 'Veterinary-grade diets, vitamins, toys, collars & litter essentials',
      descHi: 'पोषक आहार, खिलौने एवं दैनिक देखभाल सामग्री',
      icon: '📦',
      accent: '#F472B6',
    },
  ];

  return (
    <div className="services-grid-container">
      <div className="services-grid-header">
        <div>
          <h2 className="services-grid-title">Care Offerings & Services</h2>
          <p className="services-grid-subtitle">
            हमारी मुख्य सेवाएं — बिना किसी छिपे शुल्क के उच्चतम गुणवत्ता
          </p>
        </div>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div
            key={service.id}
            className="service-card glass-card"
            onClick={() => navigate(`/providers?category=${service.id}`)}
          >
            <div className="service-card__top">
              <span className="service-card__icon" style={{ borderColor: service.accent }}>
                {service.icon}
              </span>
              <span className="service-card__arrow">→</span>
            </div>
            <div className="service-card__body">
              <h3 className="service-card__title">{service.title}</h3>
              <span className="service-card__title-hi">{service.titleHi}</span>
              <p className="service-card__desc">{service.desc}</p>
              <p className="service-card__desc-hi">{service.descHi}</p>
            </div>
            <div className="service-card__action">
              <span className="service-card__btn-text">Browse Providers / प्रोवाइडर देखें</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}