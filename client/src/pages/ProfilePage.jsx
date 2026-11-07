import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [petForm, setPetForm] = useState({ name: '', category: 'dog', breed: '', age: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPets() {
      try {
        setLoadingPets(true);
        const res = await api.getPets();
        setPets(res.pets || res.data?.pets || []);
      } catch (err) {
        // Fallback demo pets
        setPets([
          { id: 'pet_1', name: 'Simba', category: 'dog', breed: 'Golden Retriever', age: '3 years' },
          { id: 'pet_2', name: 'Milo', category: 'cat', breed: 'Persian', age: '1.5 years' },
        ]);
      } finally {
        setLoadingPets(false);
      }
    }
    loadPets();
  }, []);

  const handleAddPet = async (e) => {
    e.preventDefault();
    if (!petForm.name) return;

    try {
      setSubmitting(true);
      const res = await api.addPet(petForm);
      const newPet = res.pet || {
        id: 'pet_' + Date.now(),
        ...petForm,
      };
      setPets([...pets, newPet]);
      setShowAddPetModal(false);
      setPetForm({ name: '', category: 'dog', breed: '', age: '' });
    } catch (err) {
      // Fallback
      setPets([...pets, { id: 'pet_' + Date.now(), ...petForm }]);
      setShowAddPetModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getPetEmoji = (cat) => {
    switch (cat) {
      case 'dog': return '🐕';
      case 'cat': return '🐱';
      case 'rabbit': return '🐰';
      case 'bird': return '🐦';
      default: return '🐾';
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* User Card */}
        <div className="profile-user-card glass-card glass-card--lg">
          <div className="profile-user-avatar">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name || 'User'} />
            ) : (
              <span>{(user?.name || user?.email || 'U')[0].toUpperCase()}</span>
            )}
          </div>

          <div className="profile-user-info">
            <h1 className="profile-user-name">{user?.name || 'TrustPaw Pet Parent'}</h1>
            <p className="profile-user-email">✉️ {user?.email || 'user@trustpaw.in'}</p>
            {user?.phone && <p className="profile-user-phone">📱 {user.phone}</p>}
            <span className="profile-badge">Verified Pet Guardian / सत्यापित सदस्य</span>
          </div>

          <div className="profile-actions">
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out / लॉग आउट
            </button>
          </div>
        </div>

        {/* Registered Pets Section */}
        <div className="pets-section">
          <div className="pets-section-header">
            <div>
              <h2 className="pets-section-title">My Registered Pets / मेरे पालतू जानवर</h2>
              <p className="pets-section-sub">Manage medical records, vaccines, and rapid appointments</p>
            </div>
            <button
              className="primary-btn add-pet-btn"
              onClick={() => setShowAddPetModal(true)}
            >
              + Register New Pet / नया जानवर जोड़ें
            </button>
          </div>

          {loadingPets ? (
            <div className="pets-loading">Loading pets...</div>
          ) : pets.length === 0 ? (
            <div className="pets-empty glass-card">
              <span className="empty-paw">🐾</span>
              <h3>No Pets Registered Yet</h3>
              <p>Add your dog, cat, rabbit, or bird for tailored medical and wellness tracking.</p>
              <button
                className="primary-btn"
                onClick={() => setShowAddPetModal(true)}
              >
                + Register First Companion
              </button>
            </div>
          ) : (
            <div className="pets-grid">
              {pets.map((pet) => (
                <div key={pet.id} className="pet-item-card glass-card">
                  <div className="pet-item-emoji">{getPetEmoji(pet.category)}</div>
                  <div className="pet-item-info">
                    <h3 className="pet-item-name">{pet.name}</h3>
                    <span className="pet-item-category">
                      {pet.category.toUpperCase()} • {pet.breed || 'Companion'}
                    </span>
                    {pet.age && <span className="pet-item-age">Age: {pet.age}</span>}
                  </div>
                  <div className="pet-item-action">
                    <button
                      className="pet-book-shortcut-btn"
                      onClick={() => navigate('/providers')}
                    >
                      Book Care →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Pet Modal */}
      {showAddPetModal && (
        <div className="modal-backdrop" onClick={() => setShowAddPetModal(false)}>
          <div className="modal-card glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register New Companion / नया पालतू जोड़ें</h3>
              <button className="modal-close-btn" onClick={() => setShowAddPetModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPet} className="pet-modal-form">
              <div className="form-group">
                <label className="form-label">Pet Name / पालतू का नाम</label>
                <input
                  type="text"
                  className="form-input modal-input"
                  placeholder="e.g. Bruno, Bella"
                  value={petForm.name}
                  onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Species / श्रेणी</label>
                <select
                  className="form-input modal-input modal-select"
                  value={petForm.category}
                  onChange={(e) => setPetForm({ ...petForm, category: e.target.value })}
                >
                  <option value="dog">🐕 Dog (कुत्ता)</option>
                  <option value="cat">🐱 Cat (बिल्ली)</option>
                  <option value="rabbit">🐰 Rabbit (खरगोश)</option>
                  <option value="bird">🐦 Bird (पक्षी)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Breed / नस्ल (Optional)</label>
                <input
                  type="text"
                  className="form-input modal-input"
                  placeholder="e.g. Labrador, Indie, Persian"
                  value={petForm.breed}
                  onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age / उम्र (Optional)</label>
                <input
                  type="text"
                  className="form-input modal-input"
                  placeholder="e.g. 2 years, 6 months"
                  value={petForm.age}
                  onChange={(e) => setPetForm({ ...petForm, age: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="primary-btn submit-pet-btn"
                disabled={submitting}
              >
                {submitting ? 'Registering...' : 'Save Pet / सुरक्षित करें'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}