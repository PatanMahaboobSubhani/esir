'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronUp, ChevronDown, MoreHorizontal, Bold, Italic, Underline, Link2, DivideSquare, Image as ImageIcon, UploadCloud, Save } from 'lucide-react';

const WORKFLOW_STEPS = ['Submission', 'Review', 'Copyediting', 'Production'];
const PUB_STEPS = ['Title & Abstract', 'Contributors', 'Metadata', 'References', 'Galleys'];

const WysiwygToolbar = () => (
  <div style={{ display: 'flex', gap: '10px', padding: '8px 12px', borderBottom: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#64748b' }}>
    <Bold size={14} style={{ cursor: 'pointer' }}/>
    <Italic size={14} style={{ cursor: 'pointer' }}/>
    <Underline size={14} style={{ cursor: 'pointer' }}/>
    <span style={{ color: '#cbd5e1' }}>|</span>
    <Link2 size={14} style={{ cursor: 'pointer' }}/>
    <DivideSquare size={14} style={{ cursor: 'pointer' }}/>
    <span style={{ color: '#cbd5e1' }}>|</span>
    <ImageIcon size={14} style={{ cursor: 'pointer' }}/>
    <UploadCloud size={14} style={{ cursor: 'pointer' }}/>
  </div>
);

export default function SubmissionWorkflowPage({ params }) {
  const { id } = use(params);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  // Reviewer Assignment State
  const [assigningLoading, setAssigningLoading] = useState(false);
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [assignments, setAssignments] = useState([]);
  
  const [activeMenu, setActiveMenu] = useState('Workflow');
  const [activeStep, setActiveStep] = useState('Submission');
  const [workflowOpen, setWorkflowOpen] = useState(true);
  const [pubOpen, setPubOpen] = useState(true);
  const [formTitle, setFormTitle] = useState('');
  const [formAbstract, setFormAbstract] = useState('');
  const [formPrefix, setFormPrefix] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formReferences, setFormReferences] = useState('');
  const [user, setUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Revision State
  const [revisionComments, setRevisionComments] = useState('');
  const [revFiles, setRevFiles] = useState([]);
  const [submittingRevision, setSubmittingRevision] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Editorial Decision State
  const [decision, setDecision] = useState('');
  const [decisionComments, setDecisionComments] = useState('');
  const [recordingDecision, setRecordingDecision] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [newDiscSubject, setNewDiscSubject] = useState('');
  const [newDiscMessage, setNewDiscMessage] = useState('');
  const [discussions, setDiscussions] = useState([]);
  const [finalFilePath, setFinalFilePath] = useState('');
  const [finalFileName, setFinalFileName] = useState('');
  const [finalUploading, setFinalUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalContent, setSuccessModalContent] = useState({ title: '', message: '' });
  const [publishDate, setPublishDate] = useState('');

  const [formCitationsScopus, setFormCitationsScopus] = useState(0);
  const [formCitationsGoogle, setFormCitationsGoogle] = useState(0);
  const [formDoi, setFormDoi] = useState('');

  useEffect(() => {
    if (submission) {
      setFormTitle(submission.title || '');
      setFormAbstract(submission.abstract || '');
      setFormPrefix(submission.prefix || '');
      setFormSubtitle(submission.subtitle || '');
      setFormKeywords(submission.keywords || '');
      setFormReferences(submission.references || '');
      setFormCitationsScopus(submission.citations_scopus || 0);
      setFormCitationsGoogle(submission.citations_google || 0);
      setFormDoi(submission.doi || '');
    }
  }, [submission]);

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        const token = localStorage.getItem('eisr_token');
        if (!token) return;

        // Fetch User profile to check role
        const profRes = await fetch('/api/profile', { headers: { 'Authorization': `Bearer ${token}` } });
        const profData = await profRes.json();
        if (profData.success) setUser(profData.profile);

        const res = await fetch(`/api/submissions/${id}?t=${Date.now()}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          cache: 'no-store'
        });
        const data = await res.json();
        if (data.success) {
          setSubmission(data.submission);
          // If the API now returns assignments directly in submission object, use it
          if (data.submission.assignments) setAssignments(data.submission.assignments);
        } else {
          setError(data.message || 'Failed to load submission');
        }

        // Fallback backward compat if assignments weren't in detail res
        if (!data.submission?.assignments) {
          const assignRes = await fetch(`/api/reviewer/assignments?submissionId=${id}&t=${Date.now()}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
          });
          const assignData = await assignRes.json();
          if (assignData.success) setAssignments(assignData.assignments || []);
        }

        // Fetch Discussions
        const discRes = await fetch(`/api/submissions/${id}/discussions?t=${Date.now()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const discData = await discRes.json();
        if (discData.success) setDiscussions(discData.discussions);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEverything();
  }, [id]);

  const handleAssignReviewer = async () => {
    if (!reviewerEmail || !reviewerName) return alert('Enter reviewer name and email');
    setAssigningLoading(true);
    try {
      const token = localStorage.getItem('eisr_token');
      const res = await fetch('/api/reviewer/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          submissionId: parseInt(id),
          reviewerId: 999, // Fallback placeholder ID since we are inviting by email directly
          reviewerEmail,
          reviewerName,
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Reviewer Assigned and Email Sent successfully!');
        setReviewerEmail('');
        setReviewerName('');
        // Refresh assignments list
        const assignRes = await fetch(`/api/reviewer/assignments?submissionId=${id}&t=${Date.now()}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          cache: 'no-store'
        });
        const assignData = await assignRes.json();
        if (assignData.success) {
          setAssignments(assignData.assignments || []);
          window.dispatchEvent(new Event('eisr_refresh_data'));
        }
      } else {
        alert('Failed: ' + data.message);
      }
    } catch (error) {
      alert('Network Error assigning reviewer');
    } finally {
      setAssigningLoading(false);
    }
  };

  const handleDecision = async () => {
    if (!decision) return alert('Select a decision');
    setRecordingDecision(true);
    try {
      const token = localStorage.getItem('eisr_token');
      const res = await fetch(`/api/submissions/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ decision, comments: decisionComments, finalFilePath })
      });
      const data = await res.json();
      if (data.success) {
        setSubmission(prev => ({ ...prev, status: data.newStatus, activity: data.newActivity }));
        alert('Editorial decision recorded successfully!');
        setDecision('');
        setDecisionComments('');
        window.dispatchEvent(new Event('eisr_refresh_data'));
      } else {
        alert(data.message);
      }
    } catch (err) { alert('Error recording decision'); } finally { setRecordingDecision(false); }
  };

  const handleAuthorConfirmation = async () => {
    setRecordingDecision(true);
    try {
      const token = localStorage.getItem('eisr_token');
      const res = await fetch(`/api/submissions/${id}/confirm-proof`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSubmission(prev => ({ ...prev, activity: 'Proofs Confirmed by Author' }));
        setSuccessModalContent({
          title: 'Proofs Confirmed!',
          message: 'Thank you! Your final approval has been recorded. The editorial team has been notified and will proceed with publication.'
        });
        setShowSuccessModal(true);
      } else {
        alert(data.message);
      }
    } catch (err) { alert('Error sending confirmation'); } finally { setRecordingDecision(false); }
  };

  const handleRevisionFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setRevFiles(prev => [...prev, { name: file.name, path: data.path }]);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };
  
  const handleUpdateCitations = async () => {
    setRecordingDecision(true);
    try {
      const token = localStorage.getItem('eisr_token');
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: formTitle,
          prefix: formPrefix,
          subtitle: formSubtitle,
          abstract: formAbstract,
          keywords: formKeywords,
          references: formReferences,
          citations_scopus: formCitationsScopus,
          citations_google: formCitationsGoogle,
          doi: formDoi
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Citations updated successfully!');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error updating citations');
    } finally {
      setRecordingDecision(false);
    }
  };

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
        setFinalFileName(file.name);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setFinalUploading(false);
    }
  };

  const handleSubmitRevisions = async () => {
    if (revFiles.length === 0) return alert('Please upload at least one revised file.');
    setSubmittingRevision(true);
    try {
      const token = localStorage.getItem('eisr_token');
      const res = await fetch(`/api/submissions/${id}/revisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ files: revFiles, comments: revisionComments })
      });
      const data = await res.json();
      if (data.success) {
        setSubmission(prev => ({ ...prev, status: data.newStatus, activity: data.newActivity }));
        window.dispatchEvent(new Event('eisr_refresh_data'));
        alert('Revisions submitted successfully!');
        setRevFiles([]);
        setRevisionComments('');
      } else {
        alert(data.message);
      }
    } catch (err) { alert('Error submitting revisions'); } finally { setSubmittingRevision(false); }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontFamily: '"Noto Sans", sans-serif' }}>Loading submission details...</div>;
  }

  if (error || !submission) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: '"Noto Sans", sans-serif' }}>
        <p style={{ color: '#dc2626', marginBottom: '20px' }}>{error || 'Submission not found.'}</p>
        <Link href="/dashboard/submissions" style={{ color: '#005f96', textDecoration: 'underline' }}>
          Back to My Submissions
        </Link>
      </div>
    );
  }

  const handleStepClick = (menu, step) => {
    setActiveMenu(menu);
    setActiveStep(step);
  };

  const navItemStyle = (menu, step) => ({
    padding: '8px 16px',
    fontSize: '13px',
    color: activeMenu === menu && activeStep === step ? '#fff' : '#005f96',
    backgroundColor: activeMenu === menu && activeStep === step ? '#003a5c' : 'transparent',
    cursor: 'pointer',
    fontFamily: '"Noto Sans", sans-serif',
    display: 'block'
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('eisr_token');
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formTitle,
          prefix: formPrefix,
          subtitle: formSubtitle,
          abstract: formAbstract,
          keywords: formKeywords,
          references: formReferences
        })
      });
      const data = await res.json();
      if (data.success) {
        // Update local submission state to reflect in UI immediately
        setSubmission(prev => ({
          ...prev,
          title: formTitle,
          prefix: formPrefix,
          subtitle: formSubtitle,
          abstract: formAbstract,
          keywords: formKeywords,
          references: formReferences
        }));
        alert('Changes saved successfully!');
      } else {
        alert('Failed to save: ' + data.message);
      }
    } catch (error) {
      alert('Error updating submission');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeature = (feature) => {
    alert(feature + ' feature will be available in the next release.');
  };

  const handleDownloadFile = (filePath, fileName) => {
    if (!filePath) {
      alert('File path is not available.');
      return;
    }
    
    // Extract filename from the path (handles both forward and backward slashes)
    const filename = filePath.split(/[\\/]/).pop();
    const downloadUrl = `/api/download?file=${encodeURIComponent(filename)}`;

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName || filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    if (!submission?.files || submission.files.length === 0) {
      alert('No files to download.');
      return;
    }
    submission.files.forEach((file, index) => {
      setTimeout(() => {
        handleDownloadFile(file.path, file.name);
      }, index * 300);
    });
  };

  const handleCreateDiscussion = async () => {
    if (!newDiscSubject || !newDiscMessage) return alert('Subject and message are required');
    try {
      const token = localStorage.getItem('eisr_token');
      const res = await fetch(`/api/submissions/${id}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ subject: newDiscSubject, message: newDiscMessage })
      });
      const data = await res.json();
      if (data.success) {
        setShowDiscussionModal(false);
        setNewDiscSubject('');
        setNewDiscMessage('');
        // Refresh
        const discRes = await fetch(`/api/submissions/${id}/discussions?t=${Date.now()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const discData = await discRes.json();
        if (discData.success) setDiscussions(discData.discussions);
      }
    } catch (err) { alert('Error starting discussion'); }
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#005f96',
    backgroundColor: '#fff',
    border: 'none',
    borderBottom: '1px solid #e2e8f0',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    fontFamily: '"Noto Sans", sans-serif',
  };

  const inputStyle = {
    width: '100%', 
    border: '1px solid #cbd5e1', 
    borderRadius: '2px',
    padding: '8px 12px', 
    fontSize: '13px', 
    outline: 'none', 
    fontFamily: '"Noto Sans", sans-serif',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
    color: '#334155'
  };

  const labelStyle = {
    display: 'block', 
    fontSize: '11px', 
    fontWeight: '700', 
    color: '#475569', 
    marginBottom: '6px',
    marginTop: '16px'
  };

  return (
    <div style={{ minHeight: '100%', backgroundColor: '#f1f5f9', fontFamily: '"Noto Sans", sans-serif' }}>
      
      {/* Top Header bar below main nav */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <Link href="/dashboard/submissions" style={{ color: '#005f96', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontSize: '15px' }}>
            <ChevronLeft size={16} /> <span>{submission.id}</span>
          </Link>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '400', color: '#1e293b', margin: '0 0 8px 0', lineHeight: '1.3' }}>
              {submission.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9333ea' }}></div>
              <span style={{ fontSize: '13px', color: '#334155' }}>
                {submission.status || 'Submission'}
              </span>
            </div>
          </div>
        </div>
          {submission.status === 'Incomplete' && (
            <button 
              onClick={() => router.push(`/dashboard/submit?id=${id}`)}
              style={{ backgroundColor: '#005f96', color: '#fff', border: 'none', padding: '6px 16px', fontSize: '13px', borderRadius: '2px', cursor: 'pointer', fontFamily: '"Noto Sans", sans-serif', fontWeight: '700' }}
            >
              Resume Submission
            </button>
          )}
        </div>

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Left Sidebar Menu */}
        <div style={{ width: '220px', flexShrink: 0, borderRight: '1px solid #e2e8f0', backgroundColor: '#fff', minHeight: 'calc(100vh - 120px)' }}>
          <div>
            <button onClick={() => setWorkflowOpen(!workflowOpen)} style={sectionHeaderStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Workflow</span>
              {workflowOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {workflowOpen && (
              <div style={{ padding: '0', borderBottom: '1px solid #e2e8f0' }}>
                {WORKFLOW_STEPS.map(step => (
                  <div key={step} style={navItemStyle('Workflow', step)} onClick={() => handleStepClick('Workflow', step)}>
                    {step}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <button onClick={() => setPubOpen(!pubOpen)} style={sectionHeaderStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Publication</span>
              {pubOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {pubOpen && (
              <div style={{ padding: '0', borderBottom: '1px solid #e2e8f0' }}>
                {PUB_STEPS.map(step => (
                  <div key={step} style={navItemStyle('Publication', step)} onClick={() => handleStepClick('Publication', step)}>
                    {step}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, padding: '24px' }}>
          
          <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            
            {/* dynamic Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#005f96', textTransform: 'uppercase' }}>
                {activeMenu.toUpperCase()}: {activeStep.toUpperCase()}
              </h2>
            </div>
            
            <div style={{ padding: '20px' }}>
              
              {activeMenu === 'Workflow' && activeStep === 'Submission' && (
                <>
                  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '24px' }}>
                    Current Submission Language: <strong>{submission.language || 'English'}</strong>
                  </div>

                  {/* Submission Files */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '2px', marginBottom: '24px' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>Submission Files</h3>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Files uploaded at the time of submission</div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 140px 120px', padding: '10px 16px', backgroundColor: '#f8fafc', fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>
                      <div>NO</div><div>FILE NAME</div><div>DATE UPLOADED</div><div>TYPE</div>
                    </div>
                    
                    {submission.files && submission.files.length > 0 ? (
                      submission.files.map((file, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 140px 120px', padding: '12px 16px', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ color: '#475569' }}>{file.id || 194 + i}</span>
                          <span 
                            style={{ color: '#005f96', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => handleDownloadFile(file.path, file.name)}
                          >
                            {file.name}
                          </span>
                          <span style={{ color: '#475569' }}>{new Date(file.date).toLocaleDateString()}</span>
                          <div>
                            <span style={{ backgroundColor: '#005f96', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: '500' }}>{file.type || 'Article Text'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '16px', fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>No files uploaded.</div>
                    )}
                    
                    {submission.files?.length > 0 && (
                      <div style={{ padding: '12px 16px' }}>
                        <button 
                          onClick={handleDownloadAll}
                          style={{ color: '#005f96', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          Download All Files
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pre-Review Discussions */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '2px' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Pre-Review Discussions</h3>
                      <button 
                        onClick={() => setShowDiscussionModal(true)}
                        style={{ fontSize: '13px', color: '#005f96', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Add discussion
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 120px 60px 40px', padding: '10px 16px', backgroundColor: '#f8fafc', fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>
                      <div>Name</div><div>From</div><div>Last Reply</div><div style={{ textAlign: 'center' }}>Replies</div><div style={{ textAlign: 'center' }}>Closed</div>
                    </div>
                    
                    {discussions && discussions.length > 0 ? (
                      discussions.map((d, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 180px 120px 60px 40px', padding: '12px 16px', alignItems: 'center', fontSize: '12px', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ color: '#005f96', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '4px', height: '4px', backgroundColor: '#005f96', borderRadius: '50%' }}></div>
                            <strong>{d.subject}</strong>: {d.message ? d.message.substring(0, 40) + '...' : ''}
                          </span>
                          <div>
                            <div style={{ color: '#475569' }}>{d.author}</div>
                            <div style={{ color: '#64748b', fontSize: '11px' }}>{new Date(d.created_at).toLocaleString()}</div>
                          </div>
                          <span style={{ color: '#475569' }}>-</span>
                          <span style={{ color: '#475569', textAlign: 'center' }}>0</span>
                          <div style={{ textAlign: 'center' }}>
                            <input type="checkbox" style={{ cursor: 'pointer' }} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>No discussions started.</div>
                    )}
                  </div>

                  {/* Submit Revisions Section (Visible only to Authors when requested) */}
                  {submission.status === 'Revisions Requested' && user?.role === 'author' && (
                    <div style={{ border: '2px solid #ca8a04', borderRadius: '4px', padding: '24px', backgroundColor: '#fffcf5', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#854d0e', marginTop: 0, marginBottom: '12px' }}>Action Required: Revisions Requested</h3>
                      
                      {/* Editor's Feedback Box */}
                      {submission.editor_comments && (
                        <div style={{ backgroundColor: '#fff', border: '1px solid #fed7aa', borderRadius: '6px', padding: '16px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                          <div style={{ fontSize: '12px', fontWeight: '800', color: '#ca8a04', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                            Feedback from Editors:
                          </div>
                          <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                            {submission.editor_comments}
                          </div>
                        </div>
                      )}

                      <p style={{ fontSize: '13px', color: '#854d0e', marginBottom: '20px' }}>Please upload your revised files and provide a point-by-point response to the editorial comments above.</p>
                      
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ ...labelStyle, marginTop: 0 }}>Response to Reviewers/Editors</label>
                        <textarea 
                          value={revisionComments} 
                          onChange={e => setRevisionComments(e.target.value)}
                          placeholder="Provide details about the changes made based on the feedback..."
                          style={{ ...inputStyle, minHeight: '120px' }}
                        />
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ ...labelStyle, marginTop: 0 }}>Upload Revised Files</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                          <input 
                            type="file" 
                            id="rev-upload" 
                            onChange={handleRevisionFileUpload} 
                            style={{ display: 'none' }} 
                          />
                          <label 
                            htmlFor="rev-upload" 
                            style={{ backgroundColor: '#fff', border: '1px dashed #ca8a04', color: '#854d0e', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                          >
                            {uploading ? 'Uploading...' : 'Choose Revised File'}
                          </label>
                        </div>
                        {revFiles.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {revFiles.map((f, i) => (
                              <div key={i} style={{ fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <UploadCloud size={14} /> {f.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={handleSubmitRevisions}
                        disabled={submittingRevision || revFiles.length === 0}
                        style={{ backgroundColor: '#ca8a04', color: '#fff', border: 'none', borderRadius: '4px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: (submittingRevision || revFiles.length === 0) ? 'not-allowed' : 'pointer', opacity: (submittingRevision || revFiles.length === 0) ? 0.7 : 1 }}
                      >
                        {submittingRevision ? 'Submitting...' : 'Complete Revision Submission'}
                      </button>
                    </div>
                  )}

                  {/* Final Check Section (Visible only to Authors when Accepted) */}
                  {submission.status === 'Accepted' && user?.role === 'author' && submission.activity !== 'Proofs Confirmed by Author' && (
                    <div style={{ border: '2px solid #16a34a', borderRadius: '4px', padding: '24px', backgroundColor: '#f0fdf4', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#166534', marginTop: 0, marginBottom: '12px' }}>Action Required: Final Check</h3>
                      <p style={{ fontSize: '13px', color: '#166534', marginBottom: '20px', lineHeight: '1.5' }}>
                        Congratulations! Your manuscript has been accepted. Please review the final version and the metadata below. 
                        If everything is correct, click the <strong>Confirm</strong> button below. If you found a minor error, you can upload a corrected version or start a discussion.
                      </p>
                      
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <button 
                          onClick={handleAuthorConfirmation}
                          disabled={recordingDecision}
                          style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: recordingDecision ? 'not-allowed' : 'pointer' }}
                        >
                          {recordingDecision ? 'Processing...' : 'Confirm & Approve Proofs'}
                        </button>
                        <button 
                          onClick={() => setShowDiscussionModal(true)}
                          style={{ backgroundColor: '#fff', color: '#16a34a', border: '1px solid #16a34a', borderRadius: '4px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Start Discussion if errors found
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── PUBLICATION: Title & Abstract ── */}
              {activeMenu === 'Publication' && activeStep === 'Title & Abstract' && (
                <div style={{ maxWidth: '800px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', color: '#475569' }}>Status: <span style={{ color: '#dc2626', fontWeight: '700' }}>● Unscheduled</span></div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>Version: <strong>1</strong></div>
                    <select style={{ ...inputStyle, width: 'auto', padding: '4px 8px' }}><option>All Versions</option></select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Prefix</label>
                    <input 
                      type="text" 
                      style={{ ...inputStyle, width: '120px' }} 
                      placeholder="Examples: A, The" 
                      value={formPrefix}
                      onChange={(e) => setFormPrefix(e.target.value)}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Title <span style={{ color: '#dc2626' }}>*</span></label>
                    <input 
                      type="text" 
                      style={inputStyle} 
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Subtitle</label>
                    <input 
                      type="text" 
                      style={inputStyle} 
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Abstract <span style={{ color: '#dc2626' }}>*</span></label>
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '2px', overflow: 'hidden' }}>
                      <WysiwygToolbar />
                      <textarea 
                        rows={12} 
                        style={{ width: '100%', border: 'none', padding: '12px', outline: 'none', resize: 'vertical', fontSize: '13px', fontFamily: '"Noto Sans", sans-serif' }} 
                        value={formAbstract}
                        onChange={(e) => setFormAbstract(e.target.value)}
                        placeholder="Paste or write your manuscript abstract here..."
                      ></textarea>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      style={{ backgroundColor: '#005f96', color: '#fff', border: 'none', borderRadius: '2px', padding: '8px 24px', fontSize: '13px', fontWeight: '700', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1 }}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── PUBLICATION: Contributors ── */}
              {activeMenu === 'Publication' && activeStep === 'Contributors' && (
                <div>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '2px' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Contributors</h3>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px 120px', padding: '10px 16px', backgroundColor: '#f8fafc', fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>
                      <div>Name</div><div>Email</div><div>Role</div><div style={{ textAlign: 'center' }}>Primary Contact</div>
                    </div>
                    
                    {submission.contributors && submission.contributors.length > 0 ? (
                      submission.contributors.map((c, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px 120px', padding: '12px 16px', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ color: '#005f96' }}>{c.name}</span>
                          <span style={{ color: '#475569' }}>{c.email}</span>
                          <span style={{ color: '#475569' }}>Author</span>
                          <div style={{ textAlign: 'center' }}>
                            {i === 0 && <span style={{ fontSize: '10px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>PRIMARY</span>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>No contributors found.</div>
                    )}
                  </div>
                </div>
              )}

              {/* ── PUBLICATION: Metadata ── */}
              {activeMenu === 'Publication' && activeStep === 'Metadata' && (
                <div style={{ maxWidth: '800px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Keywords</label>
                    <input 
                      type="text" 
                      style={inputStyle} 
                      placeholder="Add keywords (e.g. Ophthalmology, Machine Learning)" 
                      value={formKeywords}
                      onChange={(e) => setFormKeywords(e.target.value)}
                    />
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Provide terms that represent your research topics.</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Supporting Agencies</label>
                    <input type="text" style={inputStyle} placeholder="e.g. National Science Foundation" />
                  </div>
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      style={{ backgroundColor: '#005f96', color: '#fff', border: 'none', borderRadius: '2px', padding: '8px 24px', fontSize: '13px', fontWeight: '700', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1 }}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── PUBLICATION: References ── */}
              {activeMenu === 'Publication' && activeStep === 'References' && (
                <div style={{ maxWidth: '800px' }}>
                  <label style={labelStyle}>References</label>
                  <textarea 
                    rows={15} 
                    style={{ ...inputStyle, resize: 'vertical' }} 
                    placeholder="Provide a list of references cited in this submission. Please separate individual references with a blank line."
                    value={formReferences}
                    onChange={(e) => setFormReferences(e.target.value)}
                  ></textarea>
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      style={{ backgroundColor: '#005f96', color: '#fff', border: 'none', borderRadius: '2px', padding: '8px 24px', fontSize: '13px', fontWeight: '700', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1 }}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── WORKFLOW: Production Stage ── */}
              {activeMenu === 'Workflow' && activeStep === 'Production' && (
                <div style={{ maxWidth: '800px' }}>
                  {(user?.role === 'admin' || user?.role === 'editor') ? (
                    <div style={{ border: '2px solid #005f96', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                      <div style={{ backgroundColor: '#005f96', padding: '16px 20px', color: '#fff' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <UploadCloud size={20} /> Publication & Production Control
                        </h3>
                      </div>
                      
                      <div style={{ padding: '24px' }}>
                        <p style={{ fontSize: '14px', color: '#475569', marginBottom: '24px', lineHeight: '1.6' }}>
                          In this final stage, you can upload the formatted manuscript and set the publication date. Once published, the article will be visible to the public.
                        </p>

                        <div style={{ marginBottom: '24px', padding: '20px', border: '2px dashed #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                            Final Published Manuscript (PDF)
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <input 
                              type="file" 
                              id="prod-final-upload" 
                              accept=".pdf"
                              onChange={handleFinalFileUpload} 
                              style={{ display: 'none' }} 
                            />
                            <label 
                              htmlFor="prod-final-upload" 
                              style={{ 
                                backgroundColor: '#fff', border: '1px solid #005f96', color: '#005f96',
                                padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '700',
                                display: 'inline-flex', alignItems: 'center', gap: '8px'
                              }}
                            >
                              <UploadCloud size={18} />
                              {finalUploading ? 'Uploading...' : 'Upload Final PDF'}
                            </label>
                            {finalFilePath && (
                              <div style={{ color: '#16a34a', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                ✅ {finalFileName || 'File Uploaded'}
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                            Schedule Publication Date
                          </label>
                          <input 
                            type="datetime-local" 
                            value={publishDate || ''}
                            onChange={(e) => setPublishDate(e.target.value)}
                            style={{
                              width: '100%', padding: '12px', border: '1px solid #cbd5e1',
                              borderRadius: '6px', fontSize: '15px', outline: 'none', color: '#1e293b'
                            }}
                          />
                          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                            Leave as current time to publish immediately.
                          </p>
                        </div>

                        <div style={{ marginBottom: '32px', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#fcfcfc' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                            Impact Metrics (Citations)
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>SCOPUS CITATIONS</label>
                              <input 
                                type="number" 
                                value={formCitationsScopus}
                                onChange={(e) => setFormCitationsScopus(parseInt(e.target.value) || 0)}
                                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>GOOGLE SCHOLAR CITATIONS</label>
                              <input 
                                type="number" 
                                value={formCitationsGoogle}
                                onChange={(e) => setFormCitationsGoogle(parseInt(e.target.value) || 0)}
                                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                              />
                            </div>
                          </div>
                          
                          <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>DIGITAL OBJECT IDENTIFIER (DOI)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. 10.1234/jeiml.2026.01.01"
                              value={formDoi}
                              onChange={(e) => setFormDoi(e.target.value)}
                              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                            />
                          </div>

                          <button 
                            onClick={handleUpdateCitations}
                            style={{ padding: '10px 20px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                          >
                            <Save size={14} /> Update Metrics & DOI Only
                          </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                          <button 
                            onClick={async () => {
                              if (!finalFilePath) return alert('Please upload the final PDF first');
                              setRecordingDecision(true);
                              try {
                                const token = localStorage.getItem('eisr_token');
                                let dateToUse;
                                if (publishDate) {
                                  if (publishDate.includes('T')) {
                                    const [datePart, timePart] = publishDate.split('T');
                                    const [year, month, day] = datePart.split('-').map(Number);
                                    const [hour, minute] = timePart.split(':').map(Number);
                                    const localDate = new Date(year, month - 1, day, hour, minute);
                                    dateToUse = localDate.toISOString();
                                  } else {
                                    dateToUse = new Date(publishDate).toISOString();
                                  }
                                } else {
                                  dateToUse = new Date().toISOString();
                                }
                                const res = await fetch(`/api/submissions/${id}/publish`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                  body: JSON.stringify({ 
                                    scheduledAt: dateToUse, 
                                    finalFilePath,
                                    citationsScopus: formCitationsScopus,
                                    citationsGoogle: formCitationsGoogle,
                                    doi: formDoi
                                  })
                                });
                                const data = await res.json();
                                if (data.success) {
                                  alert('Article Published Successfully!');
                                  window.location.reload();
                                } else { alert(data.message); }
                              } catch (err) { alert('Error publishing'); } finally { setRecordingDecision(false); }
                            }}
                            disabled={recordingDecision || finalUploading}
                            style={{ 
                              backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px',
                              padding: '14px 40px', fontSize: '15px', fontWeight: '800',
                              cursor: (recordingDecision || finalUploading) ? 'not-allowed' : 'pointer',
                              opacity: (recordingDecision || finalUploading) ? 0.7 : 1,
                              boxShadow: '0 4px 10px rgba(22, 163, 74, 0.2)'
                            }}
                          >
                            {recordingDecision ? 'Processing...' : 'PUBLISH MANUSCRIPT'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                      <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '2px', backgroundColor: '#f8fafc', marginBottom: '20px', textAlign: 'left' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Status</div>
                        <div>Your manuscript is currently in the Production stage. The editorial team is preparing it for publication.</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Workflow Stage Placeholders ── */}
              {activeMenu === 'Workflow' && activeStep !== 'Submission' && activeStep !== 'Review' && activeStep !== 'Production' && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                  <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '2px', backgroundColor: '#f8fafc', marginBottom: '20px', textAlign: 'left' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Status</div>
                    <div>The {activeStep} stage has not yet been initiated.</div>
                  </div>
                </div>
              )}

              {/* ── WORKFLOW: Review Stage ── */}
              {activeMenu === 'Workflow' && activeStep === 'Review' && (
                <div>
                  <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '4px', backgroundColor: '#fff', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginTop: 0 }}>Reviewers</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Assign reviewers to evaluate this submission. An automatic invitation email will be sent upon assignment containing personalized secure Accept/Decline links.</p>
                    
                    {/* Existing Assignments Table */}
                    {assignments.length > 0 && (
                      <table style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '10px', fontWeight: 'bold', color: '#475569' }}>{user?.role === 'editor' || user?.role === 'admin' ? 'Reviewer Name' : 'Reviewer ID'}</th>
                            <th style={{ padding: '10px', fontWeight: 'bold', color: '#475569' }}>Status</th>
                            <th style={{ padding: '10px', fontWeight: 'bold', color: '#475569' }}>Date Assigned</th>
                          </tr>
                        </thead>
                        <tbody>
                          {assignments.map((a, idx) => (
                            <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px', color: '#005f96', fontWeight: '600' }}>
                                {user?.role === 'editor' || user?.role === 'admin' 
                                  ? (a.reviewerName || a.reviewerEmail) 
                                  : `Reviewer ${idx + 1}`}
                              </td>
                              <td style={{ padding: '10px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span style={{ 
                                    width: 'fit-content', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                                    backgroundColor: a.status === 'Accepted' ? '#dcfce3' : a.status === 'Declined' ? '#fee2e2' : a.status === 'Completed' ? '#e0f2fe' : '#f1f5f9',
                                    color: a.status === 'Accepted' ? '#166534' : a.status === 'Declined' ? '#991b1b' : a.status === 'Completed' ? '#0369a1' : '#475569'
                                  }}>
                                    {a.status === 'Declined' ? 'Invitation Declined' : a.status}
                                  </span>
                                  {a.review && (
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '4px', backgroundColor: '#f8fafc' }}>
                                      <div style={{ fontWeight: '700', color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>Recommendation: {a.review.recommendation} {(user?.role === 'editor' || user?.role === 'admin') && `(Rating: ${a.review.rating}/10)`}</div>
                                      <div style={{ marginBottom: '4px' }}><strong>Author Comments:</strong> {a.review.commentsAuthors}</div>
                                      {(user?.role === 'editor' || user?.role === 'admin') && (
                                        <div><strong>Editor Comments (Private):</strong> {a.review.commentsEditors}</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: '10px', color: '#64748b' }}>{new Date(a.assigned_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {/* Assign New Reviewer Form (Only for Editors/Admins) */}
                    {(user?.role === 'editor' || user?.role === 'admin') && (
                      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>Assign New Reviewer</h4>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Reviewer Name</label>
                            <input type="text" placeholder="Dr. John Doe" value={reviewerName} onChange={e => setReviewerName(e.target.value)} style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px 12px', fontSize: '13px', outline: 'none' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Reviewer Email</label>
                            <input type="email" placeholder="john.doe@university.edu" value={reviewerEmail} onChange={e => setReviewerEmail(e.target.value)} style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px 12px', fontSize: '13px', outline: 'none' }} />
                          </div>
                        </div>
                        <button onClick={handleAssignReviewer} disabled={assigningLoading} style={{ backgroundColor: '#005f96', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', cursor: assigningLoading ? 'not-allowed' : 'pointer', opacity: assigningLoading ? 0.7 : 1 }}>
                          {assigningLoading ? 'Sending Invitation...' : 'Assign & Send Email'}
                        </button>
                      </div>
                    )}

                    {/* Editorial Decision Section - Highlighted */}
                    {(user?.role === 'editor' || user?.role === 'admin') && (
                      <div style={{ 
                        border: '2px solid #005f96', 
                        marginTop: '40px', 
                        borderRadius: '8px', 
                        overflow: 'hidden',
                        boxShadow: '0 4px 15px rgba(0, 95, 150, 0.1)'
                      }}>
                        <div style={{ 
                          backgroundColor: '#005f96', 
                          padding: '12px 20px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px',
                          color: '#fff'
                        }}>
                          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '50%' }}>
                            <MoreHorizontal size={18} />
                          </div>
                          <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>Final Editorial Decision</h3>
                        </div>

                        <div style={{ padding: '24px', backgroundColor: '#fff' }}>
                          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '24px', lineHeight: '1.5' }}>
                            Based on the reviewer evaluations above, please select the final verdict for this manuscript. 
                            <strong> Note:</strong> Selecting 'Accept' will send the paper to the author for a final check before you schedule it for publication.
                          </p>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Verdict</label>
                              <select 
                                value={decision} 
                                onChange={e => setDecision(e.target.value)} 
                                style={{ 
                                  width: '100%', 
                                  border: '2px solid #e2e8f0', 
                                  borderRadius: '6px', 
                                  padding: '12px', 
                                  fontSize: '14px', 
                                  fontWeight: '600',
                                  outline: 'none',
                                  color: decision === 'accept' ? '#16a34a' : decision === 'decline' ? '#dc2626' : decision === 'revisions' ? '#ca8a04' : '#1e293b',
                                  backgroundColor: '#f8fafc'
                                }}
                              >
                                <option value="">Select Final Verdict...</option>
                                <option value="accept" style={{ color: '#16a34a', fontWeight: 'bold' }}>✅ Accept</option>
                                <option value="publish" style={{ color: '#005f96', fontWeight: 'bold' }}>🚀 Publish Directly</option>
                                <option value="revisions" style={{ color: '#ca8a04', fontWeight: 'bold' }}>✏️ Request Revisions</option>
                                <option value="decline" style={{ color: '#dc2626', fontWeight: 'bold' }}>❌ Decline Submission (Reject)</option>
                              </select>

                              {decision === 'publish' && (
                                <div style={{ marginTop: '20px', padding: '16px', border: '2px dashed #16a34a', borderRadius: '8px', backgroundColor: '#f0fdf4' }}>
                                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                                    Final Published Version (PDF)
                                  </label>
                                  <p style={{ fontSize: '12px', color: '#166534', marginBottom: '12px' }}>
                                    Please upload the final, formatted version of the manuscript that will be visible to the public.
                                  </p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <input 
                                      type="file" 
                                      id="final-upload" 
                                      accept=".pdf"
                                      onChange={handleFinalFileUpload} 
                                      style={{ display: 'none' }} 
                                    />
                                    <label 
                                      htmlFor="final-upload" 
                                      style={{ 
                                        backgroundColor: '#16a34a', 
                                        color: '#fff', 
                                        padding: '10px 20px', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer', 
                                        fontSize: '13px', 
                                        fontWeight: '700',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)'
                                      }}
                                    >
                                      <UploadCloud size={16} />
                                      {finalUploading ? 'Uploading...' : 'Choose Final PDF'}
                                    </label>
                                    {finalFilePath && (
                                      <div style={{ fontSize: '13px', color: '#166534', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        ✅ {finalFileName}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Editor Comments (Sent to Author)</label>
                              <textarea 
                                value={decisionComments} 
                                onChange={e => setDecisionComments(e.target.value)} 
                                placeholder="Enter the rationale for your decision and any final feedback for the author..." 
                                style={{ 
                                  width: '100%', 
                                  minHeight: '100px', 
                                  border: '2px solid #e2e8f0', 
                                  borderRadius: '6px', 
                                  padding: '12px', 
                                  fontSize: '14px', 
                                  outline: 'none',
                                  fontFamily: 'inherit',
                                  backgroundColor: '#f8fafc'
                                }} 
                              />
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                            <button 
                              onClick={handleDecision} 
                              disabled={recordingDecision || !decision} 
                              style={{ 
                                backgroundColor: decision === 'accept' ? '#16a34a' : decision === 'decline' ? '#dc2626' : '#005f96', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '6px', 
                                padding: '14px 32px', 
                                fontSize: '14px', 
                                fontWeight: '800', 
                                cursor: (recordingDecision || !decision) ? 'not-allowed' : 'pointer', 
                                opacity: (recordingDecision || !decision) ? 0.7 : 1,
                                transition: 'all 0.2s',
                                boxShadow: decision ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                              }}
                            >
                              {recordingDecision ? 'Recording Decision...' : 'SUBMIT FINAL EDITORIAL DECISION'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Galleys Placeholder */}
              {activeMenu === 'Publication' && activeStep === 'Galleys' && (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '2px' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Galleys</h3>
                    <button 
                      onClick={() => handleFeature('Add Galley')}
                      style={{ fontSize: '13px', color: '#005f96', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Add Galley
                    </button>
                  </div>
                  <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>No galleys have been created.</div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
      {/* Discussion Modal */}
      {showDiscussionModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '500px', maxWidth: '90%' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#005f96' }}>Start Discussion</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Subject</label>
              <input type="text" value={newDiscSubject} onChange={e => setNewDiscSubject(e.target.value)} style={inputStyle} placeholder="e.g. Question about my files" />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Message</label>
              <textarea value={newDiscMessage} onChange={e => setNewDiscMessage(e.target.value)} style={{ ...inputStyle, minHeight: '120px' }} placeholder="Type your message to the editor..."></textarea>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowDiscussionModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleCreateDiscussion} style={{ backgroundColor: '#005f96', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}>Send Message</button>
            </div>
          </div>
        </div>
      )}
      {/* Custom Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#fff', width: '450px', borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '32px', textAlign: 'center', position: 'relative',
            animation: 'modalSlideIn 0.3s ease-out'
          }}>
            <div style={{
              width: '60px', height: '60px', backgroundColor: '#dcfce7',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 20px auto'
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>
              {successModalContent.title}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '24px' }}>
              {successModalContent.message}
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              style={{
                width: '100%', padding: '12px', backgroundColor: '#005f96',
                color: '#fff', border: 'none', borderRadius: '6px',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#003a5c'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#005f96'}
            >
              Great, thank you!
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes modalSlideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
