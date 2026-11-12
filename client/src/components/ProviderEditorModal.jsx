import { useState } from 'react';
import * as api from '../services/api';
import './ProviderEditorModal.css';

export default function ProviderEditorModal({ provider, onSave, onClose }) {
  const isEditing = Boolean(provider?.id);

  // Form State
  const [formData, setFormData] = useState({
    id: provider?.id || '',
    name: provider?.name || '',
    clinicName: provider?.clinicName || '',
    category: provider?.category || 'veterinary',
    city: provider?.city || 'Mumbai',
    area: provider?.area || '',
    address: provider?.address || '',
    phone: provider?.phone || '',
    email: provider?.email || '',
    imageUrl: provider?.imageUrl || 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=400&fit=crop',
    rating: provider?.rating ?? 4.8,
    reviewCount: provider?.reviewCount ?? 120,
    yearsExperience: provider?.yearsExperience ?? 8,
    isEmergency: Boolean(provider?.isEmergency),
    is24x7: Boolean(provider?.is24x7),
    // Pricing
    consultationMin: provider?.pricing?.consultation?.min ?? 500,
    consultationMax: provider?.pricing?.consultation?.max ?? 1200,
    followUpMin: provider?.pricing?.followUp?.min ?? 300,
    followUpMax: provider?.pricing?.followUp?.max ?? 600,
    // Arrays as strings for easy editing
    specializations: (provider?.specializations || ['General Checkup', 'Vaccination']).join(', '),
    languages: (provider?.languages || ['English', 'Hindi']).join(', '),
    availableSlots: (provider?.availableSlots || ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']).join(', '),
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide at least a Doctor Name and Phone Number.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Build structured payload
      const payload = {
        id: formData.id || 'prov_' + Date.now(),
        name: formData.name.trim(),
        clinicName: formData.clinicName.trim(),
        category: formData.category,
        city: formData.city.trim(),
        area: formData.area.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        imageUrl: formData.imageUrl.trim(),
        rating: Number(formData.rating) || 4.5,
        reviewCount: Number(formData.reviewCount) || 0,
        yearsExperience: Number(formData.yearsExperience) || 1,
        isEmergency: Boolean(formData.isEmergency),
        is24x7: Boolean(formData.is24x7),
        specializations: formData.specializations
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        languages: formData.languages
          .split(',')
          .map((l) => l.trim())
          .filter(Boolean),
        availableSlots: formData.availableSlots
          .split(',')
          .map((slot) => slot.trim())
          .filter(Boolean),
        pricing: {
          consultation: {
            min: Number(formData.consultationMin) || 0,
            max: Number(formData.consultationMax) || 0,
            currency: 'INR',
          },
          followUp: {
            min: Number(formData.followUpMin) || 0,
            max: Number(formData.followUpMax) || 0,
            currency: 'INR',
          },
        },
      };

      const res = await api.adminSaveProvider(payload);
      if (res.success && res.provider) {
        onSave(res.provider);
      } else {
        onSave(payload);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save facility details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="editor-modal-container">
        <div className="editor-modal-header">
          <h3>
            <span>✏️</span> {isEditing ? `Edit Facility: ${formData.name}` : 'Add New Doctor / Facility'}
          </h3>
          <button className="editor-modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="editor-modal-body">
          {error && <div style={{ color: '#fc8181', fontSize: '13px', background: 'rgba(252, 129, 129, 0.1)', padding: '10px 14px', borderRadius: '8px' }}>{error}</div>}

          {/* Section: Basic Info */}
          <div className="editor-section-heading">1. Basic Identification & Category</div>
          <div className="editor-grid-3">
            <div className="editor-field-group">
              <label>Doctor / Specialist Name *</label>
              <input
                type="text"
                className="editor-input"
                placeholder="e.g. Dr. Ananya Sharma"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="editor-field-group">
              <label>Clinic / Facility Name</label>
              <input
                type="text"
                className="editor-input"
                placeholder="e.g. Paws & Claws Veterinary"
                value={formData.clinicName}
                onChange={(e) => handleChange('clinicName', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label>Service Category</label>
              <select
                className="editor-select"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                <option value="veterinary">Veterinary / पशु चिकित्सा</option>
                <option value="grooming">Grooming / संवारना</option>
                <option value="training">Training / प्रशिक्षण</option>
                <option value="boarding">Boarding / हॉस्टल</option>
              </select>
            </div>
          </div>

          {/* Section: Photo & Live Preview */}
          <div className="editor-section-heading">2. Doctor Photo / Image URL & Live Preview</div>
          <div className="editor-photo-preview-box">
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="editor-photo-thumb"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&h=300&fit=crop';
              }}
            />
            <div className="editor-photo-info">
              <p>Paste any direct image URL (Unsplash, Cloudinary, AWS S3, or website link):</p>
              <input
                type="url"
                className="editor-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
              />
            </div>
          </div>

          {/* Section: Contact & Location */}
          <div className="editor-section-heading">3. Contact Details & Location</div>
          <div className="editor-grid-2">
            <div className="editor-field-group">
              <label>Phone Number (Receives WhatsApp Bookings) *</label>
              <input
                type="text"
                className="editor-input"
                placeholder="e.g. +919876543210"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>

            <div className="editor-field-group">
              <label>Email Address (Receives Booking Alerts)</label>
              <input
                type="email"
                className="editor-input"
                placeholder="e.g. clinic@trustpaw.in"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="editor-grid-2">
            <div className="editor-field-group">
              <label>City</label>
              <input
                type="text"
                className="editor-input"
                placeholder="e.g. Mumbai"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label>Area / Locality</label>
              <input
                type="text"
                className="editor-input"
                placeholder="e.g. Bandra West"
                value={formData.area}
                onChange={(e) => handleChange('area', e.target.value)}
              />
            </div>
          </div>

          <div className="editor-field-group">
            <label>Full Clinic Address</label>
            <input
              type="text"
              className="editor-input"
              placeholder="e.g. Shop 12, Hill Road, Bandra West, Mumbai 400050"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          {/* Section: Pricing (INR) */}
          <div className="editor-section-heading">4. Pricing Structure (INR ₹)</div>
          <div className="editor-grid-2">
            <div className="editor-field-group">
              <label>Consultation Fee Range (₹)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  className="editor-input"
                  placeholder="Min ₹"
                  value={formData.consultationMin}
                  onChange={(e) => handleChange('consultationMin', e.target.value)}
                />
                <span style={{ color: '#a0aec0' }}>to</span>
                <input
                  type="number"
                  className="editor-input"
                  placeholder="Max ₹"
                  value={formData.consultationMax}
                  onChange={(e) => handleChange('consultationMax', e.target.value)}
                />
              </div>
            </div>

            <div className="editor-field-group">
              <label>Follow-Up Fee Range (₹)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  className="editor-input"
                  placeholder="Min ₹"
                  value={formData.followUpMin}
                  onChange={(e) => handleChange('followUpMin', e.target.value)}
                />
                <span style={{ color: '#a0aec0' }}>to</span>
                <input
                  type="number"
                  className="editor-input"
                  placeholder="Max ₹"
                  value={formData.followUpMax}
                  onChange={(e) => handleChange('followUpMax', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section: Slots, Specializations & Languages */}
          <div className="editor-section-heading">5. Booking Slots & Qualifications</div>
          <div className="editor-field-group">
            <label>Available Daily Booking Time Slots (Comma-separated)</label>
            <input
              type="text"
              className="editor-input"
              placeholder="09:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00"
              value={formData.availableSlots}
              onChange={(e) => handleChange('availableSlots', e.target.value)}
            />
          </div>

          <div className="editor-grid-2">
            <div className="editor-field-group">
              <label>Specializations (Comma-separated)</label>
              <input
                type="text"
                className="editor-input"
                placeholder="Surgery, Dermatology, Vaccinations"
                value={formData.specializations}
                onChange={(e) => handleChange('specializations', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label>Languages Spoken (Comma-separated)</label>
              <input
                type="text"
                className="editor-input"
                placeholder="English, Hindi, Marathi"
                value={formData.languages}
                onChange={(e) => handleChange('languages', e.target.value)}
              />
            </div>
          </div>

          {/* Section: Status & Experience */}
          <div className="editor-section-heading">6. Rating & Emergency Operations</div>
          <div className="editor-grid-3">
            <div className="editor-field-group">
              <label>Experience (Years)</label>
              <input
                type="number"
                className="editor-input"
                value={formData.yearsExperience}
                onChange={(e) => handleChange('yearsExperience', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label>Rating (out of 5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                className="editor-input"
                value={formData.rating}
                onChange={(e) => handleChange('rating', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label>Review Count</label>
              <input
                type="number"
                className="editor-input"
                value={formData.reviewCount}
                onChange={(e) => handleChange('reviewCount', e.target.value)}
              />
            </div>
          </div>

          <div className="editor-checkboxes-row">
            <label className="editor-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isEmergency}
                onChange={(e) => handleChange('isEmergency', e.target.checked)}
              />
              🚨 24/7 Emergency SOS Active (Shows in Emergency Modal)
            </label>

            <label className="editor-checkbox-label">
              <input
                type="checkbox"
                checked={formData.is24x7}
                onChange={(e) => handleChange('is24x7', e.target.checked)}
              />
              ⏰ Open 24 Hours / 7 Days
            </label>
          </div>

          <div className="editor-modal-footer">
            <button type="button" className="editor-cancel-btn" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="editor-save-btn" disabled={saving}>
              {saving ? 'Saving to Database...' : '💾 Save Changes / सुरक्षित करें'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

