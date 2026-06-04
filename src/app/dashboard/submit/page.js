'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Upload, AlertCircle, Check, MoreHorizontal, X, Edit2, Move, Eye, FileText, Link as LinkIcon, Trash2 } from 'lucide-react';

const STEPS = ['Details', 'Upload Files', 'Contributors', 'For the Editors', 'Review'];

const checklistItems = [
  'This submission meets the requirements outlined in the Author Guidelines.',
  'This submission has not been previously published, nor is it before another journal for consideration.',
  'All references have been checked for accuracy and completeness.',
  'All tables and figures have been numbered and labeled.',
  'Permission has been obtained to publish all photos, datasets and other material provided with this submission.',
];

export default function SubmitPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '',
    checklistConfirmed: false,
    privacyConsent: false,
    files: [],
    contributors: [],
    editorComments: '',
    keywords: '',
    abstract: '',
    references: '',
  });
  const [dragOver, setDragOver] = useState(false);
  const [contributorName, setContributorName] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showAddContributor, setShowAddContributor] = useState(false);
  const [currentJournalId, setCurrentJournalId] = useState('');

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const jId = searchParams.get('journal');
    if (jId) setCurrentJournalId(jId);

    const draftId = searchParams.get('id');
    if (draftId) {
      setEditingId(draftId);
      const token = localStorage.getItem('eisr_token');
      fetch(`/api/submissions/${draftId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.submission) {
          const s = data.submission;
          setForm(prev => ({
            ...prev,
            title: s.title || '',
            editorComments: s.editor_comments || '',
            files: s.files || [],
            contributors: s.contributors || [],
            abstract: s.abstract || '',
            references: s.references || '',
            keywords: s.keywords || '',
            checklistConfirmed: true,
            privacyConsent: true
          }));
        }
      });
    }
  }, []);

  const inputStyle = {
    width: '100%',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: '"Noto Sans", sans-serif',
  };

  const handleFileAdd = async (e) => {
    const newFiles = Array.from(e.target.files || []);
    for (const f of newFiles) {
      try {
        const formData = new FormData();
        formData.append('file', f);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          setForm(prev => ({
            ...prev,
            files: [...prev.files, {
              id: prev.files.length + 1,
              name: data.name,
              path: data.path,
              date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              type: 'Article Text'
            }]
          }));
        }
      } catch (err) {
        console.error('Upload failed for', f.name, err);
      }
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    for (const f of droppedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', f);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          setForm(prev => ({
            ...prev,
            files: [...prev.files, {
              id: prev.files.length + 1,
              name: data.name,
              path: data.path,
              date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              type: 'Article Text'
            }]
          }));
        }
      } catch (err) {
        console.error('Upload failed for', f.name, err);
      }
    }
  };

  const handleRemoveFile = (id) => {
    setForm(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== id)
    }));
  };

  const validateStep = () => {
    const newErrors = [];
    if (step === 0) {
      if (!currentJournalId) newErrors.push('Please select a target journal.');
      if (!form.title.trim()) newErrors.push('Title is required.');
      if (!form.checklistConfirmed) newErrors.push('Please confirm that the submission meets all requirements.');
      if (!form.privacyConsent) newErrors.push('Please agree to the privacy statement.');
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setErrors([]);
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => {
    setErrors([]);
    setStep(s => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrors([]);
    try {
      const token = localStorage.getItem('eisr_token');
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title,
          editorComments: form.editorComments,
          contributors: form.contributors,
          files: form.files.map(f => ({ name: f.name, type: f.type, path: f.path })),
          journalId: currentJournalId,
          submissionId: editingId
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');
      
      window.dispatchEvent(new Event('eisr_refresh_data'));
      router.push('/dashboard/submit/complete');
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddContributor = () => {
    if (!contributorName.trim() || !contributorEmail.trim()) return;
    setForm(prev => ({
      ...prev,
      contributors: [...prev.contributors, {
        id: Date.now(),
        name: contributorName,
        email: contributorEmail,
        role: 'Author'
      }]
    }));
    setContributorName('');
    setContributorEmail('');
    setShowAddContributor(false);
  };

  const handleRemoveContributor = (id) => {
    setForm(prev => ({
      ...prev,
      contributors: prev.contributors.filter(c => c.id !== id)
    }));
  };

  const handleSaveForLater = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('eisr_token');
      await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title || 'Untitled Draft',
          editorComments: form.editorComments,
          contributors: form.contributors,
          files: form.files.map(f => ({ name: f.name, type: f.type, path: f.path })),
          journalId: currentJournalId,
          isDraft: true,
          submissionId: editingId
        })
      });
      window.dispatchEvent(new Event('eisr_refresh_data'));
      router.push('/dashboard/submissions');
    } catch (err) {
      console.error('Save draft failed:', err);
      router.push('/dashboard/submissions');
    } finally {
      setSubmitting(false);
    }
  };

  const stepHeaderStyle = (i) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 0',
    fontSize: '13px',
    fontWeight: '600',
    color: i === step ? '#005f96' : i < step ? '#005f96' : '#94a3b8',
    cursor: i < step ? 'pointer' : 'default',
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
    border: 'none',
    background: 'none',
    fontFamily: '"Noto Sans", sans-serif',
  });

  const stepNumStyle = (i) => ({
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: i < step ? '#005f96' : '#fff',
    border: i === step ? '2px solid #005f96' : i < step ? '2px solid #005f96' : '2px solid #cbd5e1',
    color: i === step ? '#005f96' : i < step ? '#fff' : '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0,
    zIndex: 2,
  });

  const RichToolbar = () => (
    <div style={{ display: 'flex', gap: '15px', padding: '8px 12px', borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
      <button style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>B</button>
      <button style={{ background: 'none', border: 'none', fontStyle: 'italic', cursor: 'pointer', fontSize: '14px' }}>I</button>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>x²</button>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>x₂</button>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><LinkIcon size={14} /></button>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Noto Sans", sans-serif' }}>

      {/* Breadcrumb Info line with Journal Selection */}
      <div style={{ fontSize: '13px', color: '#333', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: '600' }}>Target Journal:</span>
        <select 
          value={currentJournalId} 
          onChange={(e) => setCurrentJournalId(e.target.value)}
          style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', backgroundColor: '#f8fafc', color: '#005f96', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <option value="" disabled>Select Target Journal</option>
          <option value="jcsra">Journal of Eye Innovation in Security Analysis</option>
          <option value="jeiml">Journal of Eye-Innovation in Machine Learning</option>
        </select>
        {form.title ? <span style={{ color: '#666' }}>/ {form.title}</span> : ''}
      </div>

      {/* Main Title Area */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#333', margin: 0 }}>
          Make a Submission{step > 0 ? `: ${STEPS[step]}` : ''}
        </h1>
        <button
          onClick={handleSaveForLater}
          style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', color: '#333', cursor: 'pointer' }}
        >
          Save for Later
        </button>
      </div>

      {/* ── Step Wizard Progress Bar ── */}
      <div style={{ position: 'relative', marginBottom: '40px', padding: '0 40px' }}>
        <div style={{ position: 'absolute', top: '28px', left: '80px', right: '80px', height: '2px', backgroundColor: '#cbd5e1', zIndex: 1 }} />
        <div style={{ display: 'flex', position: 'relative', zIndex: 2, justifyContent: 'space-between' }}>
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => i < step && setStep(i)}
              style={stepHeaderStyle(i)}
            >
              <div style={stepNumStyle(i)}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span style={{ marginLeft: '8px' }}>{s}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '32px' }}>

          {/* ── STEP 0: Details ── */}
          {step === 0 && (
            <div>
              <div style={{ marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#333', marginTop: 0, marginBottom: '16px' }}>Before you begin</h2>
                <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>
                  <p style={{ marginBottom: '16px' }}>Thank you for submitting to the <strong>{currentJournalId === 'jeiml' ? 'Journal of Eye-Innovation in Machine Learning (JEIML)' : 'Journal of Eye Innovation in Security Analysis (JEISA)'}</strong>. You will be asked to upload files, identify co-authors, and provide information such as the title and abstract.</p>
                  <p style={{ marginBottom: '16px' }}>Please read our <Link href="#" style={{ color: '#005f96', textDecoration: 'underline' }}>Submission Guidelines</Link> if you have not done so already. When filling out the forms, provide as many details as possible in order to help our editors evaluate your work.</p>
                  <p>Once you begin, you can save your submission and come back to it later. You will be able to review and correct any information before you submit.</p>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#333', marginBottom: '8px' }}>
                  Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '32px', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '4px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#333', marginBottom: '16px' }}>
                  Submission Checklist <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>All submissions must meet the following requirements.</p>
                <ul style={{ paddingLeft: '20px', margin: '0 0 24px 0', fontSize: '14px', color: '#333', lineHeight: '1.7' }}>
                  {checklistItems.map((item, i) => (
                    <li key={i} style={{ marginBottom: '10px' }}>{item}</li>
                  ))}
                </ul>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.checklistConfirmed}
                    onChange={e => setForm(f => ({ ...f, checklistConfirmed: e.target.checked }))}
                    style={{ width: '18px', height: '18px', accentColor: '#005f96' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Yes, my submission meets all of these requirements.</span>
                </label>
              </div>

              <div style={{ marginBottom: '40px', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '4px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#333', marginBottom: '16px' }}>
                  Privacy Consent <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.privacyConsent}
                    onChange={e => setForm(f => ({ ...f, privacyConsent: e.target.checked }))}
                    style={{ width: '18px', height: '18px', accentColor: '#005f96' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                    Yes, I agree to have my data collected and stored according to the <Link href="/privacy" target="_blank" style={{ color: '#005f96', textDecoration: 'underline' }}>privacy statement</Link>.
                  </span>
                </label>
              </div>

              {errors.length > 0 && (
                <div style={{ marginBottom: '24px', padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '4px', color: '#991b1b', fontSize: '13px' }}>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>Please fix the following:</div>
                  {errors.map((e, i) => <div key={i}>• {e}</div>)}
                </div>
              )}

              <button
                onClick={nextStep}
                style={{ backgroundColor: '#005f96', color: '#fff', border: 'none', borderRadius: '4px', padding: '12px 32px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                Begin Submission
              </button>
            </div>
          )}

          {/* ── STEP 1: Upload Files ── */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#333', marginTop: 0, marginBottom: '24px' }}>Upload Files</h2>
              
              <div
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                style={{
                  border: `2px dashed ${dragOver ? '#005f96' : '#cbd5e1'}`,
                  borderRadius: '6px',
                  padding: '48px',
                  textAlign: 'center',
                  backgroundColor: dragOver ? '#f0f9ff' : '#f8fafc',
                  marginBottom: '32px',
                  transition: 'all 0.2s',
                }}
              >
                <Upload size={32} color="#94a3b8" style={{ marginBottom: '16px' }} />
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Drag and drop a file here to begin upload</p>
                <label style={{ backgroundColor: '#005f96', color: '#fff', padding: '10px 24px', borderRadius: '4px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'inline-block' }}>
                  Upload File
                  <input type="file" multiple onChange={handleFileAdd} style={{ display: 'none' }} />
                </label>
              </div>

              {form.files.length > 0 && (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '32px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 200px 120px 80px', padding: '12px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>
                    <span>ID</span><span>File Name</span><span>Date Uploaded</span><span>Type</span><span>Action</span>
                  </div>
                  {form.files.map((file) => (
                    <div key={file.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 200px 120px 80px', padding: '16px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ color: '#64748b' }}>{file.id}</span>
                      <span style={{ fontWeight: '600', color: '#1e293b' }}>{file.name}</span>
                      <span style={{ color: '#64748b' }}>{file.date}</span>
                      <span style={{ backgroundColor: '#005f96', color: '#fff', fontSize: '10px', padding: '3px 12px', borderRadius: '15px', fontWeight: '700', width: 'fit-content' }}>{file.type}</span>
                      <button 
                        onClick={() => handleRemoveFile(file.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Remove file"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={prevStep} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px 24px', fontSize: '14px', color: '#333', cursor: 'pointer' }}>Back</button>
                <button onClick={nextStep} style={{ backgroundColor: '#005f96', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Save and Continue</button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Contributors ── */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', gap: '48px' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#333', marginTop: 0, marginBottom: '16px' }}>Contributors</h2>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', marginBottom: '24px' }}>Add details for all of the contributors to this submission. Contributors added here will be sent an email confirmation of the submission, as well as a copy of all editorial decisions recorded against this submission.</p>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>If a contributor can not be contacted by email, because they must remain anonymous or do not have an email account, please do not enter a fake email address. You can add information about this contributor in a message to the editor at a later step in the submission process.</p>
                </div>

                <div style={{ flex: 2 }}>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700' }}>Contributors</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Move size={14} /> Order</button>
                        <button style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', fontSize: '12px' }}>Preview</button>
                        <button 
                          onClick={() => setShowAddContributor(true)}
                          style={{ background: '#005f96', border: 'none', color: '#fff', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
                        >
                          Add Contributor
                        </button>
                      </div>
                    </div>

                    {showAddContributor && (
                      <div style={{ padding: '20px', backgroundColor: '#f0f9ff', borderBottom: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '700' }}>Add New Contributor</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Full Name</label>
                            <input type="text" value={contributorName} onChange={e => setContributorName(e.target.value)} style={inputStyle} placeholder="e.g. John Doe" />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Email Address</label>
                            <input type="email" value={contributorEmail} onChange={e => setContributorEmail(e.target.value)} style={inputStyle} placeholder="e.g. john@example.com" />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={handleAddContributor} style={{ backgroundColor: '#005f96', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 16px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Save Contributor</button>
                          <button onClick={() => setShowAddContributor(false)} style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 16px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </div>
                    )}
                    {form.contributors.map((c) => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', padding: '20px 16px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{c.name}</div>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>{c.email}</div>
                        </div>
                        <div style={{ flex: 1, fontSize: '13px', color: '#64748b' }}>{c.role}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ backgroundColor: '#005f96', color: '#fff', fontSize: '10px', padding: '4px 12px', borderRadius: '15px', fontWeight: '700' }}>Author</span>
                          <button style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', color: '#005f96' }}>Edit</button>
                          <button 
                            onClick={() => handleRemoveContributor(c.id)}
                            style={{ background: 'none', border: '1px solid #fecaca', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', color: '#b91c1c', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                <button onClick={prevStep} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px 24px', fontSize: '14px', color: '#333' }}>Back</button>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Last saved 36 seconds ago</span>
                  <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleSaveForLater} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px 24px', fontSize: '14px', color: '#333', cursor: 'pointer' }}>Save for Later</button>
                  <button onClick={nextStep} style={{ backgroundColor: '#005f96', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 32px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Continue</button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: For the Editors ── */}
          {step === 3 && (
            <div>
              <div style={{ display: 'flex', gap: '48px' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#333', marginTop: 0, marginBottom: '16px' }}>For the Editors</h2>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', marginBottom: '24px' }}>Please provide the following details in order to help our editorial team manage your submission.</p>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>When entering metadata, provide entries that you think would be most helpful to the person managing your submission. This information can be changed before publication.</p>
                </div>

                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: '#333', marginBottom: '8px' }}>Comments for the Editor</label>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Add any information that you think our editorial staff should know when evaluating your submission.</p>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <RichToolbar />
                    <textarea
                      value={form.editorComments}
                      onChange={e => setForm(f => ({ ...f, editorComments: e.target.value }))}
                      rows={12}
                      style={{ ...inputStyle, border: 'none', borderRadius: 0, padding: '20px', resize: 'vertical', fontSize: '14px', lineHeight: '1.6' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                <button onClick={prevStep} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px 24px', fontSize: '14px', color: '#333' }}>Back</button>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Last saved 42 seconds ago</span>
                  <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleSaveForLater} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px 24px', fontSize: '14px', color: '#333', cursor: 'pointer' }}>Save for Later</button>
                  <button onClick={nextStep} style={{ backgroundColor: '#005f96', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 32px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Continue</button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Review ── */}
          {step === 4 && (
            <div>
              <div style={{ display: 'flex', gap: '48px' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#333', marginTop: 0, marginBottom: '16px' }}>Review and Submit</h2>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', marginBottom: '24px' }}>Review the information you have entered before you complete your submission. You can change any of the details displayed here by clicking the edit button at the top of each section.</p>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>Once you complete your submission, a member of our editorial team will be assigned to review it. Please ensure the details you have entered here are as accurate as possible.</p>
                </div>

                <div style={{ flex: 2 }}>
                  {[
                    {
                      label: 'Details', stepId: 0, items: [
                        { k: 'Title', v: form.title },
                        { k: 'Keywords', v: form.keywords },
                        { k: 'Abstract', v: form.abstract },
                        { k: 'References', v: form.references },
                      ]
                    },
                    {
                      label: 'Files', stepId: 1, items: form.files.map(f => ({ k: f.name, v: <span style={{ backgroundColor: '#005f96', color: '#fff', fontSize: '10px', padding: '3px 12px', borderRadius: '15px' }}>{f.type}</span> }))
                    },
                    {
                      label: 'Contributors', stepId: 2, items: form.contributors.map(c => ({ 
                        k: c.name, 
                        v: <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ backgroundColor: '#005f96', color: '#fff', fontSize: '10px', padding: '3px 12px', borderRadius: '15px' }}>Primary Contact</span>
                          <span style={{ border: '1px solid #cbd5e1', fontSize: '10px', padding: '3px 10px', borderRadius: '15px', color: '#64748b' }}>Author</span>
                        </div> 
                      }))
                    },
                    {
                      label: 'For the Editors', stepId: 3, items: [{ k: 'Comments', v: form.editorComments || 'None' }]
                    },
                  ].map(section => (
                    <div key={section.label} style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                        <span style={{ fontSize: '15px', fontWeight: '700' }}>{section.label}</span>
                        <button onClick={() => setStep(section.stepId)} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 16px', fontSize: '12px', color: '#333', cursor: 'pointer' }}>Edit</button>
                      </div>
                      <div style={{ padding: '20px' }}>
                        {section.items.map((item, i) => (
                          <div key={i} style={{ marginBottom: i === section.items.length - 1 ? 0 : '20px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{item.k}</div>
                            {typeof item.v === 'string' ? (
                              <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>{item.v}</div>
                            ) : item.v}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                <button onClick={prevStep} style={{ background: '#fff', border: '1px solid #fca5a5', borderRadius: '4px', padding: '10px 24px', fontSize: '14px', color: '#b91c1c', cursor: 'pointer' }}>Back</button>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Last saved 54 seconds ago</span>
                  <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleSaveForLater} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px 24px', fontSize: '14px', color: '#333', cursor: 'pointer' }}>Save for Later</button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={submitting}
                    style={{ backgroundColor: '#005f96', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 32px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}
