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
          { id: 'pet_2', name: 'Milo', category: 'cat', breed: 'Persian Longhair', age: '1.5 years' },
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
    } catch {
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

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* User Account Overview */}
        <div className="profile-user-card">
          <div className="profile-avatar-large">
            {(user?.avatar_url || user?.avatar) ? (
              <img src={user.avatar_url || user.avatar} alt={user?.name || 'User'} />
            ) : (
              <span>{(user?.name || user?.email || 'U')[0].toUpperCase()}</span>
            )}
          </div>

          <div className="profile-user-info">
            <span className="profile-eyebrow">Registered Pet Guardian</span>
            <h1 className="profile-name">{user?.name || 'Pet Parent'}</h1>
            <div className="profile-meta-row">
              <span className="profile-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {user?.email || 'parent@trustpaw.in'}
              </span>
              {user?.phone && (
                <span className="profile-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  {user.phone}
                </span>
              )}
            </div>
          </div>

          <button type="button" className="profile-signout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        {/* Pet Companion Vault */}
        <div className="pet-vault-section">
          <div className="vault-header">
            <div>
              <span className="vault-eyebrow">Companion Records</span>
              <h2 className="vault-title">Pet Companion Vault</h2>
              <p className="vault-subtitle">
                आपके पंजीकृत पालतू साथियों का स्वास्थ्य प्रोफाइल एवं रिकॉर्ड
              </p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowAddPetModal(true)}
            >
              + Add Companion
            </button>
          </div>

          {loadingPets ? (
            <div className="vault-loading-card">
              <div className="loading-spinner-circle"></div>
              <p>Loading registered companion records...</p>
            </div>
          ) : pets.length === 0 ? (
            <div className="vault-empty-card">
              <h3>No Pets Registered Yet</h3>
              <p>Add your dog, cat, rabbit, or bird to keep their medical history accessible.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowAddPetModal(true)}
              >
                + Register First Pet
              </button>
            </div>
          ) : (
            <div className="pet-cards-grid">
              {pets.map((pet) => (
                <div key={pet.id} className="pet-vault-card">
                  <div className="pet-vault-header">
                    <span className="pet-category-badge">{pet.category?.toUpperCase() || 'PET'}</span>
                    <button
                      type="button"
                      className="pet-book-shortcut"
                      onClick={() => navigate('/providers')}
                    >
                      Book Visit →
                    </button>
                  </div>
                  <h3 className="pet-vault-name">{pet.name}</h3>
                  <div className="pet-vault-details">
                    <div className="pet-detail-row">
                      <span className="pet-detail-label">Breed:</span>
                      <span className="pet-detail-val">{pet.breed || 'Indie / Crossbreed'}</span>
                    </div>
                    {pet.age && (
                      <div className="pet-detail-row">
                        <span className="pet-detail-label">Age:</span>
                        <span className="pet-detail-val">{pet.age}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Pet Modal */}
      {showAddPetModal && (
        <div
          className="modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setShowAddPetModal(false)}
        >
          <div className="modal-dialog-card">
            <div className="modal-header">
              <h3 className="modal-title">Register Companion</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowAddPetModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPet} className="modal-form">
              <div className="form-group">
                <label className="form-label">Companion Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bruno, Bella"
                  value={petForm.name}
                  onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Species / Category *</label>
                <select
                  value={petForm.category}
                  onChange={(e) => setPetForm({ ...petForm, category: e.target.value })}
                  className="form-select"
                >
                  <option value="dog">Dog (कुत्ता)</option>
                  <option value="cat">Cat (बिल्ली)</option>
                  <option value="rabbit">Rabbit (खरगोश)</option>
                  <option value="bird">Bird (पक्षी)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Breed (नस्ल)</label>
                <input
                  type="text"
                  placeholder="e.g. Labrador, Indie, Persian"
                  value={petForm.breed}
                  onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age (उम्र)</label>
                <input
                  type="text"
                  placeholder="e.g. 2 years, 6 months"
                  value={petForm.age}
                  onChange={(e) => setPetForm({ ...petForm, age: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddPetModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Companion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}