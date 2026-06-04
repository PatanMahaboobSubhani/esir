'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronUp, ChevronDown, Edit3, FileText, Plus, Bell, User, X, Info } from 'lucide-react';
import { journals } from '@/lib/data';

function DashboardLayoutContent({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [reviewerSubmissions, setReviewerSubmissions] = useState([]);
  const [reviewerOpen, setReviewerOpen] = useState(true);
  const [authorOpen, setAuthorOpen] = useState(true);
  const [editorOpen, setEditorOpen] = useState(true);
  const [editorSubmissions, setEditorSubmissions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [readNotifs, setReadNotifs] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const searchParams = useSearchParams();
  const currentJournal = searchParams.get('journal');

  useEffect(() => {
    const token = localStorage.getItem('eisr_token');
    if (!token) { router.push('/login'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch { router.push('/login'); }

    const savedRead = localStorage.getItem('eisr_read_notifs');
    if (savedRead) setReadNotifs(JSON.parse(savedRead));

    const handleClickOutside = (e) => {
      if (!e.target.closest('.header-menu-container')) {
        setShowNotif(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('eisr_token');
        if (!token) return;

        let url = '/api/submissions';
        if (currentJournal) url += `?journal=${currentJournal}`;
        
        const subRes = await fetch(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`, { 
          headers: { 'Authorization': `Bearer ${token}` },
          cache: 'no-store'
        });
        const subData = await subRes.json();
        if (subData.success) {
          setSubmissions(subData.submissions);
        }

        let revUrl = '/api/submissions?role=reviewer';
        if (currentJournal) revUrl += `&journal=${currentJournal}`;
        const revRes = await fetch(`${revUrl}&t=${Date.now()}`, { 
          headers: { 'Authorization': `Bearer ${token}` },
          cache: 'no-store'
        });
        const revData = await revRes.json();
        if (revData.success) {
          setReviewerSubmissions(revData.submissions);
        }

        let payloadRole = 'author';
        try { payloadRole = JSON.parse(atob(token.split('.')[1])).role || 'author'; } catch(e){}

        if (payloadRole === 'editor' || payloadRole === 'admin') {
          let edUrl = '/api/submissions?role=editor';
          if (currentJournal) edUrl += `&journal=${currentJournal}`;
          const edRes = await fetch(`${edUrl}&t=${Date.now()}`, { 
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
          });
          const edData = await edRes.json();
          if (edData.success) {
            setEditorSubmissions(edData.submissions);
          }
        }
        
        const notifRes = await fetch(`/api/notifications?t=${Date.now()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const notifData = await notifRes.json();
        if (notifData.success) {
          setNotifications(notifData.notifications.map(n => ({
            id: n.id,
            title: n.title,
            msg: n.message,
            link: `/dashboard/submissions/${n.submission_id}`,
            isRead: n.is_read
          })));
        }

        const profRes = await fetch('/api/profile', { headers: { 'Authorization': `Bearer ${token}` } });
        const profData = await profRes.json();
        if (profData.success) setProfile(profData.profile);
      } catch {}
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    window.addEventListener('eisr_refresh_data', fetchData);

    return () => {
      clearInterval(interval);
      window.removeEventListener('eisr_refresh_data', fetchData);
    };
  }, [currentJournal]);

  const handleLogout = () => { localStorage.removeItem('eisr_token'); router.push('/login'); };

  const handleNotifClick = async (n) => {
    try {
      const token = localStorage.getItem('eisr_token');
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id: n.id })
      });
      setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, isRead: 1 } : notif));
    } catch (err) {}
    setShowNotif(false);
    if (n.link) router.push(n.link);
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('eisr_token');
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ markAll: true })
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: 1 })));
    } catch (err) {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isActive = (href) => {
    const [path] = pathname.split('?');
    return path === href;
  };

  const jId = currentJournal === 'jeiml' ? 'jeiml' : (currentJournal ? 'jcsra' : null);
  const filteredAuthor = jId ? submissions.filter(s => s.journal_id === jId) : submissions;
  const filteredEditor = jId ? editorSubmissions.filter(s => s.journal_id === jId) : editorSubmissions;
  const filteredReviewer = jId ? reviewerSubmissions.filter(s => s.journal_id === jId) : reviewerSubmissions;

  const counts = {
    active: filteredAuthor.filter(s => {
      const status = (s.status || '').toLowerCase();
      const isLive = status === 'scheduled' && s.scheduled_at && new Date(s.scheduled_at) <= new Date();
      return !['declined', 'published'].includes(status) && !isLive;
    }).length,
    revisionsRequested: filteredAuthor.filter(s => (s.status || '').toLowerCase().includes('revision')).length,
    revisionsSubmitted: filteredAuthor.filter(s => (s.status || '').toLowerCase().includes('revisions submitted')).length,
    incomplete: filteredAuthor.filter(s => (s.status || '').toLowerCase().includes('incomplete')).length,
    accepted: filteredAuthor.filter(s => (s.status || '').toLowerCase() === 'accepted').length,
    scheduled: filteredAuthor.filter(s => {
      const status = (s.status || '').toLowerCase();
      const isLive = status === 'scheduled' && s.scheduled_at && new Date(s.scheduled_at) <= new Date();
      return status === 'scheduled' && !isLive;
    }).length,
    published: filteredAuthor.filter(s => {
      const status = (s.status || '').toLowerCase();
      const isLive = status === 'scheduled' && s.scheduled_at && new Date(s.scheduled_at) <= new Date();
      return status === 'published' || isLive;
    }).length,
    declined: filteredAuthor.filter(s => (s.status || '').toLowerCase() === 'declined').length,
    revAction: filteredReviewer.filter(s => ['pending', 'accepted'].includes((s.status || '').toLowerCase())).length,
    revAll: filteredReviewer.length,
    revCompleted: filteredReviewer.filter(s => (s.status || '').toLowerCase() === 'completed').length,
    revDeclined: filteredReviewer.filter(s => (s.status || '').toLowerCase() === 'declined').length,
    revPublished: filteredReviewer.filter(s => {
      const status = (s.submission_status || '').toLowerCase();
      const isLive = status === 'scheduled' && s.scheduled_at && new Date(s.scheduled_at) <= new Date();
      return status === 'published' || isLive;
    }).length,
    revArchived: filteredReviewer.filter(s => (s.status || '').toLowerCase() === 'archived').length,
    edUnassigned: filteredEditor.filter(s => {
      const act = (s.activity || '').toLowerCase();
      return act === 'unassigned' || act.includes('declined');
    }).length,
    edReview: filteredEditor.filter(s => {
      const act = (s.activity || '').toLowerCase();
      return act.includes('review') && !act.includes('declined');
    }).length,
    edPublished: filteredEditor.filter(s => {
      const status = (s.status || '').toLowerCase();
      const isLive = status === 'scheduled' && s.scheduled_at && new Date(s.scheduled_at) <= new Date();
      return status === 'published' || isLive;
    }).length,
    edAccepted: filteredEditor.filter(s => (s.status || '').toLowerCase() === 'accepted').length,
    edScheduled: filteredEditor.filter(s => {
      const status = (s.status || '').toLowerCase();
      const isLive = status === 'scheduled' && s.scheduled_at && new Date(s.scheduled_at) <= new Date();
      return status === 'scheduled' && !isLive;
    }).length,
    edDeclined: filteredEditor.filter(s => (s.status || '').toLowerCase() === 'declined').length,
    edReviewerDeclined: filteredEditor.filter(s => (s.activity || '').toLowerCase().includes('reviewer declined')).length,
    edTotal: filteredEditor.length,
  };

  const displayName = profile?.givenName
    ? `${profile.givenName}${profile.familyName ? ' ' + profile.familyName : ''}`
    : (profile?.fullName || user?.name || user?.username || 'User');

  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const NavItem = ({ href, label, count, color = '#cbd5e1' }) => {
    const journalParam = currentJournal ? `?journal=${currentJournal}` : '';
    const fullHref = `${href}${journalParam}`;
    const active = isActive(href);
    const isActionRequired = label === 'Action Required by me';
    
    return (
      <Link href={fullHref} style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 20px', fontSize: '12.5px', textDecoration: 'none',
        color: active ? '#fff' : '#005f96',
        backgroundColor: active ? '#002137' : 'transparent',
        borderLeft: active ? '4px solid #005f96' : '4px solid transparent',
        fontFamily: '"Noto Sans", sans-serif',
        transition: 'all 0.15s',
        fontWeight: active ? '500' : '400',
        borderBottom: '1px solid #f1f5f9',
      }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          minWidth: '20px', height: '20px', borderRadius: '50%', fontSize: '10px',
          fontWeight: '700', 
          backgroundColor: active ? 'transparent' : (isActionRequired ? '#dc2626' : 'white'),
          color: active ? 'white' : (isActionRequired ? 'white' : '#005f96'),
          border: active ? '1.5px solid white' : (isActionRequired ? '1.5px solid #dc2626' : '1.5px solid #cbd5e1'),
        }}>{count}</span>
        <span style={{ flex: 1 }}>{label}</span>
      </Link>
    );
  };

  const SectionHeader = ({ icon: Icon, label }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px', fontSize: '11px', fontWeight: '600', color: '#005f96',
      backgroundColor: '#f8fafc', border: 'none', borderTop: '1px solid #e2e8f0',
      borderBottom: '1px solid #e2e8f0', width: '100%', textAlign: 'left',
      fontFamily: '"Noto Sans", sans-serif', textTransform: 'none',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon size={14} /> {label}
      </span>
    </div>
  );

  const targetJournalData = journals.find(j => j.id === currentJournal);
  const headerTitle = targetJournalData ? targetJournalData.title : 'EISR - Academic Publishing Portal';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '"Noto Sans", -apple-system, sans-serif', backgroundColor: '#fff' }}>
      <div style={{
        backgroundColor: '#002137', color: '#fff',
        display: 'flex', alignItems: 'center', padding: '0 20px',
        justifyContent: 'space-between', height: '40px',
      }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', fontWeight: '600', fontStyle: targetJournalData ? 'normal' : 'italic', fontSize: '14px', letterSpacing: '0.02em', color: targetJournalData ? '#fff' : '#4BA6B9' }}>
          {headerTitle}
        </Link>
        <div className="header-menu-container" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}><Info size={18} /></button>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowNotif(v => !v); setShowProfileMenu(false); }}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', position: 'relative' }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#dc2626', color: '#fff', width: '15px', height: '15px', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div style={{
                position: 'absolute', top: '35px', right: '-10px',
                backgroundColor: '#fff', color: '#333',
                border: '1px solid #e2e8f0', borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                width: '280px', zIndex: 50,
                display: 'flex', flexDirection: 'column',
                maxHeight: '350px'
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '14px' }}>Notifications</div>
                  {unreadCount > 0 && (
                    <span 
                      style={{ fontSize: '11px', color: '#005f96', cursor: 'pointer', fontWeight: '600' }} 
                      onClick={markAllRead}
                    >
                      Mark all as read
                    </span>
                  )}
                </div>
                
                <div style={{ overflowY: 'auto', flex: 1 }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No new notifications</div>
                  ) : (
                    notifications.map(n => {
                      const isUnread = !n.isRead;
                      return (
                        <div key={n.id} onClick={() => handleNotifClick(n)} style={{ 
                          padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                          backgroundColor: isUnread ? '#f0f9ff' : '#fff',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = isUnread ? '#e0f2fe' : '#f8fafc'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = isUnread ? '#f0f9ff' : '#fff'}>
                          <div style={{ fontWeight: '600', fontSize: '13px', color: isUnread ? '#0284c7' : '#334155', display: 'flex', justifyContent: 'space-between' }}>
                            {n.title}
                            {isUnread && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7', marginTop: '4px' }}></span>}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>{n.msg}</div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '50%',
              backgroundColor: '#4e6d8a', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer'
            }} onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotif(false); }}>
              {initials}
            </div>

            {showProfileMenu && (
              <div style={{
                position: 'absolute', top: '35px', right: '0',
                backgroundColor: '#fff', color: '#333',
                border: '1px solid #e2e8f0', borderRadius: '4px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                width: '180px', zIndex: 50,
                fontSize: '13px', display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '14px' }}>{displayName}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', wordBreak: 'break-all' }}>{profile?.email}</div>
                  
                  {profile?.affiliation && (
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '8px' }}>
                      <span style={{ color: '#94a3b8' }}>Affiliation:</span><br/>
                      <strong>{profile.affiliation}</strong>
                    </div>
                  )}
                  {profile?.country && (
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                      <span style={{ color: '#94a3b8' }}>Country:</span> <strong>{profile.country}</strong>
                    </div>
                  )}
                </div>
                
                <Link 
                  href="/dashboard/profile"
                  onClick={() => setShowProfileMenu(false)}
                  style={{
                    padding: '10px 16px', borderBottom: '1px solid #f1f5f9',
                    textDecoration: 'none', color: '#005f96', display: 'block',
                    fontSize: '13px', fontWeight: '600'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f0f9ff'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Edit Profile
                </Link>

                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '10px 16px', border: 'none', background: 'none',
                    textAlign: 'left', cursor: 'pointer', color: '#dc2626',
                    fontFamily: '"Noto Sans", sans-serif', fontSize: '13px',
                    fontWeight: '600', display: 'block', width: '100%'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{
          width: '240px', backgroundColor: '#fff', borderRight: '1px solid #e2e8f0',
          minHeight: 'calc(100vh - 40px)', flexShrink: 0, display: 'flex',
          flexDirection: 'column', overflowY: 'auto',
        }}>
          {(user?.role === 'editor' || user?.role === 'admin') && (
            <>
              <SectionHeader icon={Plus} label="Editorial Dashboard" />
              <div style={{ borderBottom: '1px solid #e2e8f0' }}>
                <NavItem href="/dashboard/submissions" label="All Submissions" count={counts.edTotal} />
                <NavItem href="/dashboard/submissions/unassigned" label="Unassigned" count={counts.edUnassigned} />
                  <NavItem href="/dashboard/submissions/in-review" label="In Review" count={counts.edReview} />
                <NavItem href="/dashboard/submissions/reviewer-declined" label="Reviewer Declined" count={counts.edReviewerDeclined} />
                <NavItem href="/dashboard/submissions/accepted" label="Accepted" count={counts.edAccepted} />
                <NavItem href="/dashboard/submissions/scheduled" label="Scheduled" count={counts.edScheduled} />
                <NavItem href="/dashboard/submissions/published" label="Published" count={counts.edPublished} />
                <NavItem href="/dashboard/submissions/declined" label="Declined" count={counts.edDeclined} />
              </div>
            </>
          )}

          {user?.role === 'reviewer' && (
            <>
              <SectionHeader icon={Edit3} label="My Assignments as Reviewer" />
              <div>
                <NavItem href="/dashboard/reviewer/action-required" label="Action Required by me" count={counts.revAction} />
                <NavItem href="/dashboard/reviewer/all" label="All assignments" count={counts.revAll} />
                <NavItem href="/dashboard/reviewer/completed" label="Completed" count={counts.revCompleted} />
                <NavItem href="/dashboard/reviewer/declined" label="Declined" count={counts.revDeclined} />
                <NavItem href="/dashboard/reviewer/published" label="Published" count={counts.revPublished} />
                <NavItem href="/dashboard/reviewer/archived" label="Archived" count={counts.revArchived} />
              </div>
            </>
          )}

          {user?.role === 'author' && (
            <>
              <SectionHeader icon={FileText} label="My Submissions as Author" />
              <div>
                <NavItem href="/dashboard/submissions" label="Active submissions" count={counts.active} />
                <NavItem href="/dashboard/submissions/revisions-requested" label="Revisions requested" count={counts.revisionsRequested} />
                <NavItem href="/dashboard/submissions/revisions-submitted" label="Revisions submitted" count={counts.revisionsSubmitted} />
                <NavItem href="/dashboard/submissions/accepted" label="Accepted (Final Check)" count={counts.accepted} />
                <NavItem href="/dashboard/submissions/incomplete" label="Incomplete submissions" count={counts.incomplete} />
                <NavItem href="/dashboard/submissions/scheduled" label="Scheduled for publication" count={counts.scheduled} />
                <NavItem href="/dashboard/submissions/published" label="Published" count={counts.published} />
                <NavItem href="/dashboard/submissions/declined" label="Declined" count={counts.declined} />
                <div style={{ padding: '12px 20px' }}>
                  <Link href={`/dashboard/submit${currentJournal ? '?journal='+currentJournal : ''}`} style={{ fontSize: '13px', color: '#005f96', textDecoration: 'none', fontWeight: '600' }}>Start A New Submission</Link>
                </div>
              </div>
            </>
          )}
        </aside>

        <main style={{ flex: 1, backgroundColor: '#fff', position: 'relative' }}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        body { margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: '"Noto Sans", sans-serif', color: '#005f96' }}>
        Loading Dashboard...
      </div>
    }>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

