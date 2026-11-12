import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TTSButton from '../components/TTSButton';
import WhatsAppBooking from '../components/WhatsAppBooking';
import * as api from '../services/api';
import './EasyAssistFlow.css';

export default function EasyAssistFlow() {
  const navigate = useNavigate();

  // Wizard steps: 1 = Welcome, 2 = Pet Status, 3 = Service Choice, 4 = Final Confirmation
  const [step, setStep] = useState(1);
  const [petStatus, setPetStatus] = useState(null); // 'existing' or 'new'
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [pets, setPets] = useState([]);
  const [newPetName, setNewPetName] = useState('');
  const [newPetCategory, setNewPetCategory] = useState('dog');

  // Load existing pets
  useEffect(() => {
    async function loadPets() {
      try {
        const res = await api.getPets();
        setPets(res.pets || res.data?.pets || []);
      } catch {
        setPets([
          { id: 'p1', name: 'Simba', category: 'dog', breed: 'Labrador' },
          { id: 'p2', name: 'Bella', category: 'cat', breed: 'Indie' },
        ]);
      }
    }
    loadPets();
  }, []);

  // Audio prompt text for TTS
  const stepPrompts = {
    1: 'नमस्ते! ट्रस्टपॉ सुगम सेवा में आपका स्वागत है। हम आपके पालतू जानवर की देखभाल में पूरी सहायता करेंगे। आगे बढ़ने के लिए नीचे दिए गए बटन को दबाएं। Welcome to TrustPaw Easy Assist.',
    2: 'कृपया बताएं: क्या आप अपने पहले से पंजीकृत पालतू जानवर के लिए सेवा चाहते हैं, या नया जानवर जोड़ना चाहते हैं? Please choose if you have an existing pet or want to register a new one.',
    3: 'आपको किस सेवा की आवश्यकता है? पशु चिकित्सा, ग्रूमिंग, प्रशिक्षण, या आहार सामग्री? Which service do you require for your pet?',
    4: 'आपकी सेवा लगभग तय है! आप नीचे दिए गए बटन से सीधे व्हाट्सएप पर बिना किसी परेशानी के बुकिंग कर सकते हैं। You can now book effortlessly via WhatsApp.',
  };

  const handleStep2Choice = (choice) => {
    setPetStatus(choice);
    if (choice === 'existing' && pets.length > 0) {
      setSelectedPet(pets[0]);
    }
    setStep(3);
  };

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    setStep(4);
  };

  const services = [
    {
      id: 'veterinary',
      icon: '🏥',
      title: 'Veterinary Doctor',
      titleHi: 'पशु चिकित्सक (डॉक्टर)',
      desc: 'Health checkup, vaccination & treatment',
    },
    {
      id: 'grooming',
      icon: '🛁',
      title: 'Home Grooming & Spa',
      titleHi: 'घर पर नहलाना व ग्रूमिंग',
      desc: 'Bathing, fur trimming & nail clipping',
    },
    {
      id: 'training',
      icon: '🎓',
      title: 'Pet Training',
      titleHi: 'पालतू अनुशासन व ट्रेनिंग',
      desc: 'Behavior obedience & puppy coaching',
    },
    {
      id: 'supplies',
      icon: '📦',
      title: 'Pet Food & Supplies',
      titleHi: 'खाना व जरूरी सामान',
      desc: 'Quality food, vitamins & medicines',
    },
  ];

  const getServiceLabel = () => {
    const s = services.find((x) => x.id === selectedService);
    return s ? `${s.title} (${s.titleHi})` : 'Veterinary Care';
  };

  const getPetDisplay = () => {
    if (petStatus === 'new') {
      return newPetName ? `${newPetName} (${newPetCategory})` : 'New Pet Companion';
    }
    return selectedPet ? `${selectedPet.name} (${selectedPet.category})` : 'My Pet';
  };

  return (
    <div className="easy-assist-page">
      {/* Design Safeguard Container for Large Screens: Centered, max-width: 680px */}
      <div className="easy-assist-container glass-card glass-card--lg">
        {/* Top Progress bar and back */}
        <div className="wizard-top-bar">
          <button
            type="button"
            className="wizard-back-btn"
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else navigate('/');
            }}
          >
            ← {step === 1 ? 'Exit / बाहर निकलें' : 'Previous / पीछे जाएं'}
          </button>

          <span className="wizard-step-indicator">
            Step {step} of 4 / चरण {step} (कुल 4)
          </span>
        </div>

        {/* Step 1: Welcome & Audio greeting */}
        {step === 1 && (
          <div className="wizard-step-content wizard-fade-in">
            <div className="wizard-hero-icon">👵🐾</div>
            <div className="wizard-title-row">
              <h1 className="wizard-main-heading">
                सुगम सेवा मोड | Easy Assist Mode
              </h1>
              <TTSButton text={stepPrompts[1]} size={36} />
            </div>

            <p className="wizard-lead-text">
              नमस्ते! वरिष्ठ नागरिकों एवं परिवारजनों के लिए विशेष रूप से डिज़ाइन किया गया सरल बुकिंग मंच।
            </p>
            <p className="wizard-sub-text">
              Welcome! A simplified, high-contrast experience with audio guidance and direct WhatsApp booking.
            </p>

            <div className="wizard-benefits-card">
              <div className="benefit-item">
                <span className="benefit-check">✓</span>
                <span>बड़ा व स्पष्ट टेक्स्ट (Extra large, readable font)</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-check">✓</span>
                <span>स्पीकर से आवाज में सुनें (Audio prompt narration)</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-check">✓</span>
                <span>व्हाट्सएप पर तुरंत बुकिंग (Direct WhatsApp booking bridge)</span>
              </div>
            </div>

            <button
              type="button"
              className="wizard-primary-btn"
              onClick={() => setStep(2)}
            >
              Continue / आगे बढ़ें →
            </button>
          </div>
        )}

        {/* Step 2: Pet Status Selection */}
        {step === 2 && (
          <div className="wizard-step-content wizard-fade-in">
            <div className="wizard-title-row">
              <h2 className="wizard-main-heading">
                Select Pet Status / पालतू साथी की स्थिति
              </h2>
              <TTSButton text={stepPrompts[2]} size={36} />
            </div>

            <p className="wizard-lead-text">
              क्या आप पहले से जुड़े पालतू के लिए सेवा चाहते हैं या नया पालतू जोड़ना है?
            </p>

            <div className="wizard-large-cards-column">
              <button
                type="button"
                className={`wizard-touch-card ${petStatus === 'existing' ? 'wizard-touch-card--active' : ''}`}
                onClick={() => handleStep2Choice('existing')}
              >
                <span className="touch-card-icon">🐾</span>
                <div className="touch-card-info">
                  <span className="touch-card-title">
                    Choose an existing registered pet
                  </span>
                  <span className="touch-card-title-hi">
                    पंजीकृत पालतू जानवर चुनें ({pets.length} उपलब्ध)
                  </span>
                  <span className="touch-card-desc">
                    पहले से सेव किए गए पालतू साथी के लिए त्वरित सेवा
                  </span>
                </div>
                <span className="touch-card-arrow">→</span>
              </button>

              <button
                type="button"
                className={`wizard-touch-card ${petStatus === 'new' ? 'wizard-touch-card--active' : ''}`}
                onClick={() => handleStep2Choice('new')}
              >
                <span className="touch-card-icon">➕</span>
                <div className="touch-card-info">
                  <span className="touch-card-title">
                    Register or adopt a new pet
                  </span>
                  <span className="touch-card-title-hi">
                    नया पालतू जानवर रजिस्टर करें
                  </span>
                  <span className="touch-card-desc">
                    नए कुत्ते, बिल्ली अथवा अन्य साथी के लिए प्रथम सेवा
                  </span>
                </div>
                <span className="touch-card-arrow">→</span>
              </button>
            </div>

            {/* If existing pet selected and pets list is available */}
            {petStatus === 'existing' && pets.length > 0 && (
              <div className="existing-pets-selector">
                <label className="selector-label">Select which pet / पालतू चुनें:</label>
                <div className="pet-radios">
                  {pets.map((p) => (
                    <label
                      key={p.id}
                      className={`pet-radio-card ${selectedPet?.id === p.id ? 'pet-radio-card--active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="petRadio"
                        checked={selectedPet?.id === p.id}
                        onChange={() => setSelectedPet(p)}
                      />
                      <span>{p.name} ({p.category})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* If new pet choice */}
            {petStatus === 'new' && (
              <div className="new-pet-quick-input">
                <input
                  type="text"
                  className="wizard-text-input"
                  placeholder="Pet Name / पालतू का नाम (उदा. ब्रूनो)"
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Service Requirement */}
        {step === 3 && (
          <div className="wizard-step-content wizard-fade-in">
            <div className="wizard-title-row">
              <h2 className="wizard-main-heading">
                Service Requirement / आवश्यक सेवा
              </h2>
              <TTSButton text={stepPrompts[3]} size={36} />
            </div>

            <p className="wizard-lead-text">
              <strong>{getPetDisplay()}</strong> के लिए आवश्यक सेवा पर क्लिक करें:
            </p>

            <div className="wizard-services-grid">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`service-touch-card ${selectedService === s.id ? 'service-touch-card--active' : ''}`}
                  onClick={() => handleServiceSelect(s.id)}
                >
                  <span className="service-touch-icon">{s.icon}</span>
                  <span className="service-touch-title">{s.title}</span>
                  <span className="service-touch-title-hi">{s.titleHi}</span>
                  <span className="service-touch-desc">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: WhatsApp Booking Bridge */}
        {step === 4 && (
          <div className="wizard-step-content wizard-fade-in">
            <div className="wizard-hero-icon">💬✨</div>
            <div className="wizard-title-row">
              <h2 className="wizard-main-heading">
                WhatsApp Booking Bridge / व्हाट्सएप बुकिंग
              </h2>
              <TTSButton text={stepPrompts[4]} size={36} />
            </div>

            <p className="wizard-lead-text">
              कोई जटिल चेकआउट नहीं! नीचे दिए गए बड़े हरे बटन को दबाकर सीधे व्हाट्सएप पर समय तय करें।
            </p>

            <div className="summary-card">
              <div className="summary-row">
                <span className="summary-label">Pet / पालतू:</span>
                <span className="summary-value">🐾 {getPetDisplay()}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Service / सेवा:</span>
                <span className="summary-value">🏥 {getServiceLabel()}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Location / स्थान:</span>
                <span className="summary-value">📍 Closest Verified Specialist</span>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="whatsapp-action-wrapper">
              <WhatsAppBooking
                phone="+919725671201"
                serviceType={selectedService || 'pet care'}
                providerName="TrustPaw Priority Care"
                petName={getPetDisplay()}
                buttonText="📲 Direct WhatsApp Booking (+919725671201) / सीधे व्हाट्सएप पर भेजें"
                large={true}
              />
            </div>

            <div className="alternative-actions">
              <button
                type="button"
                className="secondary-outline-btn"
                onClick={() => navigate(`/providers?category=${selectedService || 'veterinary'}`)}
              >
                Or Browse All Doctors on Map / अथवा क्लिनिक लिस्ट देखें →
              </button>
              <button
                type="button"
                className="text-reset-btn"
                onClick={() => {
                  setStep(1);
                  setPetStatus(null);
                  setSelectedService(null);
                }}
              >
                🔄 Start Over / दोबारा शुरू करें
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}