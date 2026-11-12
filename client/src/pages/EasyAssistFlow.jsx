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

  useEffect(() => {
    async function loadPets() {
      try {
        const res = await api.getPets();
        setPets(res.pets || res.data?.pets || []);
      } catch {
        setPets([
          { id: 'p1', name: 'Simba', category: 'dog', breed: 'Golden Retriever' },
          { id: 'p2', name: 'Bella', category: 'cat', breed: 'Indie' },
        ]);
      }
    }
    loadPets();
  }, []);

  const stepPrompts = {
    1: 'नमस्ते! ट्रस्टपॉ सुगम सेवा में आपका स्वागत है। हम आपके पालतू जानवर की देखभाल में पूरी सहायता करेंगे। आगे बढ़ने के लिए नीचे दिए गए बटन को दबाएं। Welcome to TrustPaw Easy Assist.',
    2: 'कृपया बताएं: क्या आप अपने पहले से पंजीकृत पालतू जानवर के लिए सेवा चाहते हैं, या नया जानवर जोड़ना चाहते हैं? Please choose if you have an existing pet or want to register a new one.',
    3: 'आपको किस सेवा की आवश्यकता है? पशु चिकित्सा, ग्रूमिंग, प्रशिक्षण, या आहार सामग्री? Which service do you require for your pet companion?',
    4: 'आपकी सेवा का चयन हो चुका है। आप नीचे दिए गए बड़े हरे बटन से सीधे व्हाट्सएप पर बिना किसी परेशानी के बुकिंग कर सकते हैं।',
  };

  const services = [
    {
      id: 'veterinary',
      title: 'Veterinary Doctor',
      titleHi: 'पशु चिकित्सक (डॉक्टर)',
      desc: 'Health checkups, illness treatment & vaccinations',
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
    },
    {
      id: 'grooming',
      title: 'Doorstep Grooming & Spa',
      titleHi: 'घर पर नहलाना व ग्रूमिंग',
      desc: 'Medicated bathing, fur styling & ear hygiene',
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
          <circle cx="12" cy="12" r="9"/>
        </svg>
      ),
    },
    {
      id: 'training',
      title: 'Behavior & Training',
      titleHi: 'पालतू अनुशासन व ट्रेनिंग',
      desc: 'Obedience, barking control & puppy coaching',
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7"/>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
        </svg>
      ),
    },
    {
      id: 'supplies',
      title: 'Pet Food & Pharmacy',
      titleHi: 'खाना व जरूरी सामान',
      desc: 'Prescription diets, vitamins & tick care',
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      ),
    },
  ];

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

  const getServiceLabel = () => {
    const s = services.find((x) => x.id === selectedService);
    return s ? `${s.title} (${s.titleHi})` : 'Veterinary Consultation';
  };

  const getPetDisplay = () => {
    if (petStatus === 'new') {
      return newPetName ? `${newPetName} (${newPetCategory})` : 'New Pet Companion';
    }
    return selectedPet ? `${selectedPet.name} (${selectedPet.category})` : 'My Pet';
  };

  return (
    <div className="easy-assist-page">
      <div className="easy-assist-container">
        {/* Progress Header */}
        <div className="wizard-navigation-bar">
          <button
            type="button"
            className="wizard-back-button"
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else navigate('/');
            }}
          >
            ← {step === 1 ? 'Exit / बाहर निकलें' : 'Back / पीछे जाएं'}
          </button>

          <div className="wizard-progress-pill">
            <span>Step {step} of 4</span>
            <span className="wizard-progress-hi">चरण {step} (कुल 4)</span>
          </div>
        </div>

        {/* Step 1: Introduction */}
        {step === 1 && (
          <div className="wizard-step-pane">
            <div className="wizard-header-row">
              <div>
                <span className="wizard-eyebrow">Elder & Family Accessibility</span>
                <h1 className="wizard-heading">सुगम सेवा मोड | Easy Assist Mode</h1>
              </div>
              <TTSButton text={stepPrompts[1]} size={22} />
            </div>

            <p className="wizard-lead-paragraph">
              नमस्ते! वरिष्ठ नागरिकों एवं परिवारजनों के लिए विशेष रूप से डिज़ाइन किया गया सरल बुकिंग मंच।
            </p>
            <p className="wizard-sub-paragraph">
              A simplified, high-contrast guided experience with voice prompts and direct WhatsApp booking.
            </p>

            <div className="wizard-feature-cards">
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <div>
                  <strong>बड़ा व स्पष्ट टेक्स्ट</strong>
                  <p>Enlarged, easy-to-read typography and buttons</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <div>
                  <strong>आवाज में सुनें (Voice Narration)</strong>
                  <p>Hindi and English audio instructions on every step</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <div>
                  <strong>सीधे व्हाट्सएप बुकिंग</strong>
                  <p>Frictionless WhatsApp bridge directly to specialists</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary wizard-proceed-btn"
              onClick={() => setStep(2)}
            >
              Continue / आगे बढ़ें →
            </button>
          </div>
        )}

        {/* Step 2: Pet Selection */}
        {step === 2 && (
          <div className="wizard-step-pane">
            <div className="wizard-header-row">
              <div>
                <span className="wizard-eyebrow">Step 2: Companion Status</span>
                <h2 className="wizard-heading">Select Pet Companion / पालतू चुनें</h2>
              </div>
              <TTSButton text={stepPrompts[2]} size={22} />
            </div>

            <p className="wizard-lead-paragraph">
              क्या आप पहले से जुड़े पालतू के लिए सेवा चाहते हैं या नया पालतू जोड़ना है?
            </p>

            <div className="wizard-option-cards">
              <button
                type="button"
                className={`wizard-touch-tile ${petStatus === 'existing' ? 'wizard-touch-tile--active' : ''}`}
                onClick={() => handleStep2Choice('existing')}
              >
                <div className="tile-text">
                  <span className="tile-title">Registered Pet Companion</span>
                  <span className="tile-title-hi">पंजीकृत पालतू जानवर चुनें ({pets.length} उपलब्ध)</span>
                  <span className="tile-desc">पहले से सेव किए गए पालतू साथी के लिए त्वरित सेवा</span>
                </div>
                <span className="tile-arrow">→</span>
              </button>

              <button
                type="button"
                className={`wizard-touch-tile ${petStatus === 'new' ? 'wizard-touch-tile--active' : ''}`}
                onClick={() => handleStep2Choice('new')}
              >
                <div className="tile-text">
                  <span className="tile-title">Register New Companion</span>
                  <span className="tile-title-hi">नया पालतू जानवर जोड़ें</span>
                  <span className="tile-desc">नए कुत्ते, बिल्ली अथवा अन्य साथी के लिए प्रथम सेवा</span>
                </div>
                <span className="tile-arrow">→</span>
              </button>
            </div>

            {/* Existing Pets Selector */}
            {petStatus === 'existing' && pets.length > 0 && (
              <div className="wizard-sub-selector">
                <label className="sub-selector-label">Select Pet Companion:</label>
                <div className="pet-chip-radios">
                  {pets.map((p) => (
                    <label
                      key={p.id}
                      className={`pet-chip-label ${selectedPet?.id === p.id ? 'pet-chip-label--active' : ''}`}
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

            {/* New Pet Input */}
            {petStatus === 'new' && (
              <div className="wizard-new-pet-box">
                <input
                  type="text"
                  className="wizard-text-input"
                  placeholder="Pet Name / पालतू का नाम (उदा. ब्रूनो)..."
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Service Selection */}
        {step === 3 && (
          <div className="wizard-step-pane">
            <div className="wizard-header-row">
              <div>
                <span className="wizard-eyebrow">Step 3: Healthcare Service</span>
                <h2 className="wizard-heading">Choose Required Service / सेवा चुनें</h2>
              </div>
              <TTSButton text={stepPrompts[3]} size={22} />
            </div>

            <p className="wizard-lead-paragraph">
              <strong>{getPetDisplay()}</strong> के लिए आवश्यक सेवा पर क्लिक करें:
            </p>

            <div className="wizard-services-grid">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`wizard-service-tile ${selectedService === s.id ? 'wizard-service-tile--active' : ''}`}
                  onClick={() => handleServiceSelect(s.id)}
                >
                  <div className="service-tile-icon">{s.iconSvg}</div>
                  <div className="service-tile-text">
                    <span className="service-tile-title">{s.title}</span>
                    <span className="service-tile-hi">{s.titleHi}</span>
                    <span className="service-tile-desc">{s.desc}</span>
                  </div>
                  <span className="tile-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: WhatsApp Bridge Confirmation */}
        {step === 4 && (
          <div className="wizard-step-pane">
            <div className="wizard-header-row">
              <div>
                <span className="wizard-eyebrow">Step 4: Final Confirmation</span>
                <h2 className="wizard-heading">WhatsApp Booking / सीधी व्हाट्सएप बुकिंग</h2>
              </div>
              <TTSButton text={stepPrompts[4]} size={22} />
            </div>

            <p className="wizard-lead-paragraph">
              कोई जटिल चेकआउट नहीं! नीचे दिए गए बड़े हरे बटन को दबाकर सीधे व्हाट्सएप पर समय तय करें।
            </p>

            {/* Concise Booking Summary */}
            <div className="wizard-summary-box">
              <div className="summary-line">
                <span className="summary-line__label">Companion / पालतू:</span>
                <span className="summary-line__val">{getPetDisplay()}</span>
              </div>
              <div className="summary-line">
                <span className="summary-line__label">Service / सेवा:</span>
                <span className="summary-line__val">{getServiceLabel()}</span>
              </div>
              <div className="summary-line">
                <span className="summary-line__label">Concierge Routing:</span>
                <span className="summary-line__val">TrustPaw Verified Healthcare Desk</span>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <div className="wizard-whatsapp-container">
              <WhatsAppBooking
                phone="+919725671201"
                serviceType={selectedService || 'pet care'}
                providerName="TrustPaw Priority Care"
                petName={getPetDisplay()}
                buttonText="📲 Direct WhatsApp Booking (+919725671201)"
                large={true}
              />
            </div>

            <div className="wizard-alt-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(`/providers?category=${selectedService || 'veterinary'}`)}
              >
                Browse All Doctors in Directory →
              </button>
              <button
                type="button"
                className="wizard-restart-btn"
                onClick={() => {
                  setStep(1);
                  setPetStatus(null);
                  setSelectedService(null);
                }}
              >
                Start Over / दोबारा शुरू करें
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}