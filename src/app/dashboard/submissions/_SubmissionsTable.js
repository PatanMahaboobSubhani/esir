'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ChevronUp, X, MoreHorizontal, ChevronsUpDown, Calendar } from 'lucide-react';

const STATUS_COLORS = {
  'Submitted': { dot: '#9333ea', bg: '#faf5ff', text: '#7e22ce' },
  'Review': { dot: '#2563eb', bg: '#eff6ff', text: '#1d4ed8' },
  'Copyediting': { dot: '#0891b2', bg: '#ecfeff', text: '#0e7490' },
  'Production': { dot: '#0d9488', bg: '#f0fdfa', text: '#0f766e' },
  'Published': { dot: '#16a34a', bg: '#f0fdf4', text: '#15803d' },
  'Declined': { dot: '#dc2626', bg: '#fef2f2', text: '#b91c1c' },
  'Scheduled': { dot: '#ca8a04', bg: '#fefce8', text: '#a16207' },
  'Accepted': { dot: '#16a34a', bg: '#f0fdf4', text: '#15803d' },
  'Incomplete': { dot: '#f97316', bg: '#fff7ed', text: '#c2410c' },
  'Unassigned': { dot: '#64748b', bg: '#f8fafc', text: '#475569' },
};

function getStatusStyle(status) {
  if (!status) return STATUS_COLORS['Unassigned'];
  for (const key of Object.keys(STATUS_COLORS)) {
    if (status.toLowerCase().includes(key.toLowerCase())) return STATUS_COLORS[key];
  }
  return STATUS_COLORS['Unassigned'];
}

export default function SubmissionsTable({ title, filterFn, columns = 'reviewer', extraMenuItems }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [filterDays, setFilterDays] = useState(0);
  const [filterIssue, setFilterIssue] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [journalId, setJournalId] = useState(null);
  const [schedulingSub, setSchedulingSub] = useState(null);
  const [publishDate, setPublishDate] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [finalFilePath, setFinalFilePath] = useState('');
  const [finalUploading, setFinalUploading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setJournalId(params.get('journal'));
    }
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('eisr_token');
        let url = `/api/submissions?role=${columns}&t=${Date.now()}`;
        if (journalId) url += `&journal=${encodeURIComponent(journalId)}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });

        const data = await res.json();

        if (data.success) {
          setSubmissions(data.submissions || []);
        } else {
          setError(data.message || 'Failed to load submissions');
        }
      } catch (err) {
        setError('Could not connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [columns, journalId]);
  
  const handleFinalFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFinalUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setFinalFilePath(data.path);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setFinalUploading(false);
    }
  };

  const filtered = submissions
    .filter(sub => (filterFn ? filterFn(sub) : true))
    .filter(sub => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        String(sub.id).includes(q) ||
        (sub.title || '').toLowerCase().includes(q) ||
        (sub.status || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (sortDir === 'asc' ? a.id - b.id : b.id - a.id));

  const isReviewer = columns === 'reviewer';
  const isAuthor = columns === 'author';
  const gridCols = isReviewer ? '60px 1fr 120px 120px' : '60px 1fr 140px 160px 240px';

  return (
    <div style={{ padding: '24px 20px', width: '100%', boxSizing: 'border-box', fontFamily: '"Noto Sans", sans-serif' }}>
      <h1
        style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '24px',
          letterSpacing: '-0.02em',
        }}
      >
        {title} ({filtered.length})
      </h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Filters {showFilters ? <ChevronUp size={14} /> : <ChevronsUpDown size={14} />}
          </button>
        </div>

        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '400px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
          />
          <input
            type="text"
            placeholder="Search submissions, ID, authors, k..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '13px',
              outline: 'none',
              backgroundColor: '#fff',
            }}
          />
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontWeight: '600',
          }}
        >
          <div
            style={{
              padding: '10px 16px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#444',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
          >
            ID <ChevronsUpDown size={12} style={{ marginLeft: '4px' }} />
          </div>
          <div style={{ padding: '10px 16px', fontSize: '11px', fontWeight: '600', color: '#444', textTransform: 'uppercase' }}>
            SUBMISSIONS
          </div>

          {!isReviewer && (
            <div style={{ padding: '10px 16px', fontSize: '11px', fontWeight: '600', color: '#444', textTransform: 'uppercase' }}>
              STAGE / STATUS
            </div>
          )}

          {!isReviewer && (
            <div style={{ padding: '10px 16px', fontSize: '11px', fontWeight: '600', color: '#444', textTransform: 'uppercase' }}>
              EDITORIAL ACTIVITY
            </div>
          )}

          {isReviewer && (
            <div style={{ padding: '10px 16px', fontSize: '11px', fontWeight: '600', color: '#444', textTransform: 'uppercase' }}>
              STATUS
            </div>
          )}

          <div
            style={{
              padding: '10px 16px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#444',
              textTransform: 'uppercase',
              textAlign: 'right',
            }}
          >
            ACTIONS
          </div>
        </div>

        {error ? (
          <div style={{ borderBottom: '1px solid #eee', padding: '12px 16px', fontSize: '13px', color: '#dc2626' }}>
            {error}
          </div>
        ) : loading ? (
          <div style={{ borderBottom: '1px solid #eee', padding: '12px 16px', fontSize: '13px', color: '#666' }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, borderBottom: '1px solid #eee', alignItems: 'center' }}>
            <div style={{ padding: '12px 16px' }}></div>
            <div style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>No Items Found</div>
          </div>
        ) : (
          filtered.map(sub => {
            const isLive = sub.status === 'Scheduled' && sub.scheduled_at && new Date(sub.scheduled_at) <= new Date();
            const statusStyle = getStatusStyle(isLive ? 'Published' : sub.status);

            return (
              <div
                key={sub.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: gridCols,
                  borderBottom: '1px solid #eee',
                  alignItems: 'center',
                }}
              >
                <div style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>{sub.id}</div>

                <div style={{ padding: '12px 16px' }}>
                  <Link
                    href={isReviewer ? `/dashboard/reviewer/assignments/${sub.id}` : `/dashboard/submissions/${sub.id}`}
                    style={{ color: '#005f96', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}
                  >
                    {sub.title}
                  </Link>
                  {sub.scheduled_at && (
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      {isLive ? 'Published on: ' : 'Scheduled for: '}
                      <span style={{ fontWeight: '700', color: isLive ? '#16a34a' : '#ca8a04' }}>
                        {new Date(sub.scheduled_at).toLocaleString('en-US', { 
                          day: 'numeric', month: 'short', year: 'numeric', 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {!isReviewer && (
                  <div style={{ padding: '12px 16px', fontSize: '13px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusStyle.dot }} />
                    {isLive ? 'Live / Published' : (sub.status || 'Submission')}
                  </div>
                )}

                {!isReviewer && (
                  <div style={{ padding: '12px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        backgroundColor: (sub.activity || '').includes('Declined') ? '#fee2e2' : (sub.activity || '').includes('Accepted') ? '#dcfce3' : '#f1f5f9',
                        color: (sub.activity || '').includes('Declined') ? '#991b1b' : (sub.activity || '').includes('Accepted') ? '#166534' : '#64748b',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '12px',
                      }}
                    >
                      {sub.activity || '—'}
                    </span>
                  </div>
                )}

                {isReviewer && (
                  <div style={{ padding: '12px 16px', fontSize: '13px', color: '#333' }}>
                    {sub.status}
                  </div>
                )}

                <div style={{ padding: '12px 16px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                  {isReviewer && ['Pending', 'Accepted'].includes(sub.status) && (
                    <Link
                      href={`/dashboard/reviewer/assignments/${sub.id}`}
                      style={{ color: '#16a34a', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}
                    >
                      Review
                    </Link>
                  )}
                  {!isReviewer && !isAuthor && sub.status === 'Accepted' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          const now = new Date();
                          const offset = now.getTimezoneOffset() * 60000;
                          const localTime = new Date(now - offset).toISOString().slice(0, 16);
                          setSchedulingSub(sub);
                          setPublishDate(localTime);
                        }}
                        style={{ background: '#005f96', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Schedule
                      </button>
                      <button
                        onClick={() => {
                          const now = new Date();
                          const offset = now.getTimezoneOffset() * 60000;
                          const localTime = new Date(now - offset).toISOString().slice(0, 16);
                          setSchedulingSub(sub);
                          setPublishDate(localTime);
                        }}
                        style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Publish Now
                      </button>
                    </div>
                  )}

                  {!isReviewer && (
                    <Link
                      href={`/dashboard/submissions/${sub.id}`}
                      style={{ color: '#005f96', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {schedulingSub && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: '#fff', width: '400px', borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '24px',
            position: 'relative', fontFamily: '"Noto Sans", sans-serif'
          }}>
            <button 
              onClick={() => setSchedulingSub(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Schedule Publication</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
              Set the date and time when this manuscript should become visible on the public portal.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                PUBLICATION DATE & TIME
              </label>
              <input 
                type="datetime-local" 
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                style={{
                  width: '100%', padding: '10px', border: '1px solid #cbd5e1',
                  borderRadius: '6px', fontSize: '14px', outline: 'none',
                  fontFamily: 'inherit', color: '#1e293b'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px', padding: '16px', border: '2px dashed #005f96', borderRadius: '8px', backgroundColor: '#f0f9ff' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#005f96', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Final Published Version (PDF)
              </label>
              <p style={{ fontSize: '12px', color: '#005f96', marginBottom: '12px' }}>
                Upload the final, formatted version for public viewing.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="file" 
                  id="modal-final-upload" 
                  accept=".pdf"
                  onChange={handleFinalFileUpload} 
                  style={{ display: 'none' }} 
                />
                <label 
                  htmlFor="modal-final-upload" 
                  style={{ 
                    backgroundColor: '#005f96', 
                    color: '#fff', 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontSize: '12px', 
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Calendar size={14} />
                  {finalUploading ? 'Uploading...' : 'Choose PDF'}
                </label>
                {finalFilePath && (
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>
                    ✅ Uploaded
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => setSchedulingSub(null)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1',
                  backgroundColor: '#fff', color: '#475569', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                disabled={isPublishing}
                onClick={async () => {
                  if (!publishDate) return;
                  setIsPublishing(true);
                  try {
                    let utcISO;
                    if (publishDate.includes('T')) {
                      const [datePart, timePart] = publishDate.split('T');
                      const [year, month, day] = datePart.split('-').map(Number);
                      const [hour, minute] = timePart.split(':').map(Number);
                      const localDate = new Date(year, month - 1, day, hour, minute);
                      utcISO = localDate.toISOString();
                    } else {
                      utcISO = new Date(publishDate).toISOString();
                    }

                    const token = localStorage.getItem('eisr_token');
                    const res = await fetch(`/api/submissions/${schedulingSub.id}/publish`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                      body: JSON.stringify({ 
                        scheduledAt: utcISO,
                        finalFilePath: finalFilePath
                      })
                    });
                    const data = await res.json();
                    if (data.success) {
                      setSchedulingSub(null);
                      window.location.reload();
                    } else {
                      alert(data.message);
                    }
                  } catch (err) {
                    alert('Error publishing manuscript');
                  } finally {
                    setIsPublishing(false);
                  }
                }}
                style={{
                  flex: 1, padding: '10px', borderRadius: '6px', border: 'none',
                  backgroundColor: '#005f96', color: '#fff', fontWeight: '600', fontSize: '14px', 
                  cursor: isPublishing ? 'not-allowed' : 'pointer', opacity: isPublishing ? 0.7 : 1
                }}
              >
                {isPublishing ? 'Publishing...' : 'Publish Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
