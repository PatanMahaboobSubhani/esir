'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: '',
    givenName: '',
    familyName: '',
    email: '',
    phone: '',
    affiliation: '',
    country: '',
    bio: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('eisr_token');
        const res = await fetch('/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error('Fetch profile error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('eisr_token');
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        alert('Profile updated successfully!');
        router.push('/dashboard');
      } else {
        alert('Failed to update: ' + data.message);
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', 
    border: '1px solid #cbd5e1', 
    borderRadius: '4px',
    padding: '10px 14px', 
    fontSize: '14px', 
    outline: 'none', 
    fontFamily: '"Noto Sans", sans-serif',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
    color: '#334155',
    backgroundColor: '#fff'
  };

  const labelStyle = {
    display: 'block', 
    fontSize: '12px', 
    fontWeight: '700', 
    color: '#475569', 
    marginBottom: '8px',
    marginTop: '20px'
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading your profile...</div>;
  }

  return (
    <div style={{ padding: '30px 40px', maxWidth: '800px', width: '100%', boxSizing: 'border-box', fontFamily: '"Noto Sans", sans-serif' }}>
      
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '32px' }}>
        
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#002137', margin: '0 0 8px 0' }}>Edit Profile</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>Update your personal information and affiliation details.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Given Name <span style={{color:'#dc2626'}}>*</span></label>
            <input name="givenName" value={profile.givenName || ''} onChange={handleChange} type="text" style={inputStyle} placeholder="First Name" />
          </div>
          <div>
            <label style={labelStyle}>Family Name</label>
            <input name="familyName" value={profile.familyName || ''} onChange={handleChange} type="text" style={inputStyle} placeholder="Last Name" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Email Address (Read-only)</label>
          <input name="email" value={profile.email || ''} readOnly style={{ ...inputStyle, backgroundColor: '#f8fafc', cursor: 'not-allowed', color: '#94a3b8' }} />
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Email cannot be changed after registration.</p>
        </div>

        <div>
          <label style={labelStyle}>Affiliation</label>
          <input name="affiliation" value={profile.affiliation || ''} onChange={handleChange} type="text" style={inputStyle} placeholder="e.g. University of Science and Technology" />
        </div>

        <div>
          <label style={labelStyle}>Country</label>
          <input name="country" value={profile.country || ''} onChange={handleChange} type="text" style={inputStyle} placeholder="e.g. India" />
        </div>

        <div>
          <label style={labelStyle}>Bio Statement</label>
          <textarea 
            name="bio" 
            value={profile.bio || ''} 
            onChange={handleChange} 
            rows={4} 
            style={{ ...inputStyle, resize: 'vertical' }} 
            placeholder="Tell us about your academic background..."
          ></textarea>
        </div>

        <div style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleSave} 
            disabled={saving}
            style={{ 
              backgroundColor: '#005f96', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '6px', 
              padding: '12px 32px', 
              fontSize: '15px', 
              fontWeight: '700', 
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 95, 150, 0.2)',
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {saving ? 'Updating...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}
