'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, FileText, Edit3, User, Clock, SlidersHorizontal } from 'lucide-react';

const BANNERS = ['/baner0001.jpg', '/baner0002.jpg', '/baner0003.jpg', '/baner0004.jpg'];

function SlidingBanner({ displayName, role }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const roleLabels = {
    admin: { title: 'Administrator Console', portal: 'Global Admin Portal' },
    editor: { title: 'Editorial Dashboard', portal: 'Editor Console' },
    reviewer: { title: 'Reviewer Dashboard', portal: 'Reviewer Portal' },
    author: { title: 'Author Dashboard', portal: 'Author Portal' },
  };

  const currentRole = roleLabels[role] || roleLabels.author;

  return (
    <div style={{ position: 'relative', height: '180px', overflow: 'hidden', backgroundColor: '#050B14' }}>
      {/* Sliding images */}
      {BANNERS.map((src, i) => (
        <div
          key={src}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${src}')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            transition: 'opacity 1s ease',
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(5,11,20,0.52)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 48px' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#4BA6B9', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: '"Noto Sans", sans-serif' }}>
          {currentRole.title}
        </p>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', lineHeight: 1.2, margin: '0 0 10px 0', fontFamily: '"Merriweather", serif', maxWidth: '580px' }}>
          Welcome back,{' '}
          <span style={{ color: '#4BA6B9' }}>{displayName || 'Researcher'}</span>!
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', margin: 0, fontFamily: '"Noto Sans", sans-serif', fontWeight: '400' }}>
          Eye-Innovations Scientific Research — {currentRole.portal}
        </p>

        {/* Quick action button - Only show for Authors */}
        {role === 'author' && (
          <div style={{ marginTop: '20px' }}>
            <Link href="/dashboard/submit" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#4BA6B9', color: '#fff',
              padding: '10px 22px', borderRadius: '50px',
              fontSize: '13px', fontWeight: '700', textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(75,166,185,0.4)',
              transition: 'all 0.2s',
            }}>
              <Plus size={14} /> Make a New Submission
            </Link>
          </div>
        )}
      </div>

      {/* Dot indicators */}
      <div style={{ position: 'absolute', bottom: '16px', left: '48px', display: 'flex', gap: '6px', zIndex: 10 }}>
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? '28px' : '8px', height: '8px', borderRadius: '4px',
              backgroundColor: i === current ? '#4BA6B9' : 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [editorSubmissions, setEditorSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('eisr_token');
        if (!token) return;

        // Get basic profile first to know the role
        const profRes = await fetch('/api/profile', { headers: { 'Authorization': `Bearer ${token}` } });
        const profData = await profRes.json();
        if (profData.success) {
          setProfile(profData.profile);
          const role = profData.profile.role;

          // Fetch submissions based on role
          const requests = [
            fetch('/api/submissions?role=author', { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch('/api/submissions?role=reviewer', { headers: { 'Authorization': `Bearer ${token}` } }),
          ];
          
          if (role === 'editor' || role === 'admin') {
            requests.push(fetch('/api/submissions?role=editor', { headers: { 'Authorization': `Bearer ${token}` } }));
          }

          const [subRes, assRes, edRes] = await Promise.all(requests);
          const subData = await subRes.json();
          const assData = await assRes.json();
          
          if (subData.success) setSubmissions(subData.submissions);
          if (assData.success) setAssignments(assData.submissions);
          
          if (edRes) {
            const edData = await edRes.json();
            if (edData.success) setEditorSubmissions(edData.submissions);
          }
        }
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const authorStats = {
    active: submissions.filter(s => {
      const status = (s.status || '').toLowerCase();
      const isLive = status === 'scheduled' && s.scheduled_at && new Date(s.scheduled_at) <= new Date();
      return !['declined', 'published'].includes(status) && !isLive;
    }).length,
    scheduled: submissions.filter(s => {
      const status = (s.status || '').toLowerCase();
      const isLive = status === 'scheduled' && s.scheduled_at && new Date(s.scheduled_at) <= new Date();
      return status === 'scheduled' && !isLive;
    }).length,
    declined: submissions.filter(s => s.status === 'Declined').length,
    published: submissions.filter(s => {
      const status = (s.status || '').toLowerCase();
      const isLive = status === 'scheduled' && s.scheduled_at && new Date(s.scheduled_at) <= new Date();
      return status === 'published' || isLive;
    }).length,
    total: submissions.length,
  };

  const reviewerStats = {
    actionRequired: assignments.filter(a => ['Pending', 'Accepted'].includes(a.status)).length,
    completed: assignments.filter(a => a.status === 'Completed').length,
    declined: assignments.filter(a => a.status === 'Declined').length,
    total: assignments.length,
  };

  const displayName = profile?.givenName
    ? `${profile.givenName}${profile.familyName ? ' ' + profile.familyName : ''}`
    : (profile?.fullName || profile?.username || 'User');

  const edStats = {
    total: editorSubmissions.length,
    unassigned: editorSubmissions.filter(s => (s.activity || '').toLowerCase() === 'unassigned').length,
    inReview: editorSubmissions.filter(s => (s.activity || '').toLowerCase().includes('review')).length,
    published: editorSubmissions.filter(s => {
      const status = (s.status || '').toLowerCase();
      const isLive = status === 'scheduled' && s.scheduled_at && new Date(s.scheduled_at) <= new Date();
      return status === 'published' || isLive;
    }).length,
    scheduled: editorSubmissions.filter(s => {
      const status = (s.status || '').toLowerCase();
      const isLive = status === 'scheduled' && s.scheduled_at && new Date(s.scheduled_at) <= new Date();
      return status === 'scheduled' && !isLive;
    }).length,
    accepted: editorSubmissions.filter(s => (s.status || '').toLowerCase() === 'accepted').length,
    declined: editorSubmissions.filter(s => (s.status || '').toLowerCase() === 'declined').length,
    reviewerDeclined: editorSubmissions.filter(s => (s.activity || '').toLowerCase().includes('reviewer declined')).length,
  };

  const recentSubmissions = submissions.slice(0, 5);
  const recentAssignments = assignments.slice(0, 5);

  const statCardStyle = (color) => ({
    backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px',
    padding: '20px 24px', textDecoration: 'none', display: 'block',
    borderTop: `3px solid ${color}`,
  });

  return (
    <div style={{ fontFamily: '"Noto Sans", sans-serif' }}>
      {/* ── Sliding Banner ── */}
      <SlidingBanner displayName={displayName} role={profile?.role} />

      {/* ── Content below banner ── */}
      <div style={{ padding: '28px 40px', width: '100%', boxSizing: 'border-box' }}>

      {/* Stats Row - Role Specific */}
      {profile?.role === 'author' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Submissions', value: loading ? '—' : authorStats.total, color: '#005f96', href: '/dashboard/submissions/all' },
            { label: 'Active', value: loading ? '—' : authorStats.active, color: '#7c3aed', href: '/dashboard/submissions' },
            { label: 'Declined', value: loading ? '—' : authorStats.declined, color: '#dc2626', href: '/dashboard/submissions/declined' },
            { label: 'Published', value: loading ? '—' : authorStats.published, color: '#16a34a', href: '/dashboard/submissions/published' },
          ].map(stat => (
            <Link key={stat.label} href={stat.href} style={statCardStyle(stat.color)}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', fontWeight: '500' }}>{stat.label}</div>
            </Link>
          ))}
        </div>
      )}

      {profile?.role === 'reviewer' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Assignments', value: loading ? '—' : reviewerStats.total, color: '#005f96', href: '/dashboard/reviewer/all' },
            { label: 'Action Required', value: loading ? '—' : reviewerStats.actionRequired, color: '#ca8a04', href: '/dashboard/reviewer/action-required' },
            { label: 'Completed', value: loading ? '—' : reviewerStats.completed, color: '#0284c7', href: '/dashboard/reviewer/completed' },
            { label: 'Declined', value: loading ? '—' : reviewerStats.declined, color: '#dc2626', href: '/dashboard/reviewer/declined' },
          ].map(stat => (
            <Link key={stat.label} href={stat.href} style={statCardStyle(stat.color)}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', fontWeight: '500' }}>{stat.label}</div>
            </Link>
          ))}
        </div>
      )}

      {(profile?.role === 'editor' || profile?.role === 'admin') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Submissions', value: loading ? '—' : edStats.total, color: '#005f96', href: '/dashboard/submissions/editor' },
            { label: 'Unassigned', value: loading ? '—' : edStats.unassigned, color: '#ca8a04', href: '/dashboard/submissions/unassigned' },
            { label: 'In Review', value: loading ? '—' : edStats.inReview, color: '#2563eb', href: '/dashboard/submissions/in-review' },
            { label: 'Published', value: loading ? '—' : edStats.published, color: '#16a34a', href: '/dashboard/submissions/published' },
          ].map(stat => (
            <Link key={stat.label} href={stat.href} style={statCardStyle(stat.color)}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', fontWeight: '500' }}>{stat.label}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Main Grid - Adjusted for Role */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: (profile?.role === 'editor' || profile?.role === 'admin') ? '1fr' : '1fr 1fr', 
        gap: '20px', 
        marginBottom: '20px' 
      }}>

        {/* My Submissions - Only for Authors */}
        {profile?.role === 'author' && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px 24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={15} color="#005f96" /> My Submissions as Author
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', fontSize: '13px' }}>
              {[
                { href: '/dashboard/submissions', label: 'Active submissions', count: authorStats.active },
                { href: '/dashboard/submissions/revisions-requested', label: 'Revisions requested', count: null },
                { href: '/dashboard/submissions/scheduled', label: 'Scheduled for publication', count: authorStats.scheduled },
                { href: '/dashboard/submissions/published', label: 'Published', count: authorStats.published },
                { href: '/dashboard/submissions/declined', label: 'Declined', count: authorStats.declined },
              ].map(item => (
                <li key={item.href} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link href={item.href} style={{ color: '#005f96', textDecoration: 'none' }}>
                    → {item.label}
                  </Link>
                  {item.count !== null && !loading && (
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '2px 8px' }}>
                      {item.count}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
              <Link href="/dashboard/submit" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                backgroundColor: '#005f96', color: '#fff', padding: '8px 18px',
                borderRadius: '4px', fontSize: '13px', fontWeight: '700', textDecoration: 'none',
              }}>
                <Plus size={14} /> Make a New Submission
              </Link>
            </div>
          </div>
        )}

        {/* My Reviewer Tasks - Only for Reviewers */}
        {profile?.role === 'reviewer' && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px 24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit3 size={15} color="#005f96" /> My Assignments as Reviewer
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0', fontSize: '13px' }}>
              {[
                { href: '/dashboard/reviewer/action-required', label: 'Action Required by me', count: reviewerStats.actionRequired },
                { href: '/dashboard/reviewer/all', label: 'All assignments', count: reviewerStats.total },
                { href: '/dashboard/reviewer/completed', label: 'Completed', count: reviewerStats.completed },
                { href: '/dashboard/reviewer/declined', label: 'Declined', count: reviewerStats.declined },
                { href: '/dashboard/reviewer/published', label: 'Published', count: assignments.filter(a => (a.submission_status || '').toLowerCase() === 'published').length },
                { href: '/dashboard/reviewer/archived', label: 'Archived', count: assignments.filter(a => (a.status || '').toLowerCase() === 'archived').length },
              ].map(item => (
                <li key={item.href} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link href={item.href} style={{ color: '#005f96', textDecoration: 'none' }}>
                    → {item.label}
                  </Link>
                  {!loading && (
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '2px 8px' }}>
                      {item.count}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Editorial Console (Visible to Editor/Admin) */}
        {(profile?.role === 'editor' || profile?.role === 'admin') && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px 24px', gridColumn: 'span 2' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={15} color="#005f96" /> Editorial Management Console
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', fontSize: '13px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { href: '/dashboard/submissions/editor', label: 'All Submissions', count: edStats.total },
                { href: '/dashboard/submissions/unassigned', label: 'Unassigned', count: edStats.unassigned },
                { href: '/dashboard/submissions/in-review', label: 'In Review', count: edStats.inReview },
                { href: '/dashboard/submissions/reviewer-declined', label: 'Reviewer Declined', count: edStats.reviewerDeclined },
                { href: '/dashboard/submissions/accepted', label: 'Accepted', count: edStats.accepted },
                { href: '/dashboard/submissions/scheduled', label: 'Scheduled', count: edStats.scheduled },
                { href: '/dashboard/submissions/published', label: 'Published', count: edStats.published },
                { href: '/dashboard/submissions/declined', label: 'Declined', count: edStats.declined },
              ].map(item => (
                <li key={item.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', border: '1px solid #f1f5f9', borderRadius: '4px' }}>
                  <Link href={item.href} style={{ color: '#005f96', textDecoration: 'none', fontWeight: '500' }}>
                    → {item.label}
                  </Link>
                  {!loading && (
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '2px 8px' }}>
                      {item.count}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', gap: '12px' }}>
              <Link href="/dashboard/submissions/editor" style={{ display: 'inline-block', padding: '8px 18px', border: '1px solid #005f96', borderRadius: '4px', textDecoration: 'none', color: '#005f96', fontSize: '13px', fontWeight: '700' }}>
                Manage All
              </Link>
              <Link href="/dashboard/reviewer/all" style={{ display: 'inline-block', padding: '8px 18px', border: '1px solid #005f96', borderRadius: '4px', textDecoration: 'none', color: '#005f96', fontSize: '13px', fontWeight: '700' }}>
                Reviewer Pool
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Recent Submissions Table - Only for Authors */}
      {profile?.role === 'author' && recentSubmissions.length > 0 && (
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={15} color="#005f96" /> Recent Submissions
            </h2>
            <Link href="/dashboard/submissions" style={{ fontSize: '13px', color: '#005f96', textDecoration: 'none', fontWeight: '500' }}>
              View all →
            </Link>
          </div>
          <div>
            {recentSubmissions.map((sub, idx) => {
              const statusColors = {
                'Published': '#16a34a', 'Declined': '#dc2626', 'Review': '#2563eb',
                'Submitted': '#7c3aed', 'Unassigned': '#64748b',
              };
              const sc = statusColors[sub.status] || '#64748b';
              return (
                <div key={sub.id} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 120px 140px 80px',
                  borderBottom: idx < recentSubmissions.length - 1 ? '1px solid #f1f5f9' : 'none',
                  alignItems: 'center', padding: '12px 24px',
                  backgroundColor: idx % 2 === 0 ? '#fff' : '#fafcff',
                }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>#{sub.id}</span>
                  <Link href={`/dashboard/submissions/${sub.id}`} style={{ fontSize: '13px', color: '#005f96', textDecoration: 'none', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '12px' }}>
                    {sub.title}
                  </Link>
                  <span style={{ fontSize: '12px', color: sc, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sc, display: 'inline-block' }} />
                    {sub.status || 'Submitted'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {sub.date || '—'}
                  </span>
                  <Link href={`/dashboard/submissions/${sub.id}`} style={{ fontSize: '12px', color: '#005f96', textDecoration: 'none', fontWeight: '600', textAlign: 'right' }}>
                    View →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Assignments Table - Only for Reviewers */}
      {profile?.role === 'reviewer' && recentAssignments.length > 0 && (
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={15} color="#005f96" /> Recent Assignments
            </h2>
            <Link href="/dashboard/reviewer/action-required" style={{ fontSize: '13px', color: '#005f96', textDecoration: 'none', fontWeight: '500' }}>
              View all →
            </Link>
          </div>
          <div>
            {recentAssignments.map((sub, idx) => {
              const statusColors = {
                'Published': '#16a34a', 'Declined': '#dc2626', 'Accepted': '#16a34a',
                'Completed': '#0284c7', 'Pending': '#ca8a04',
              };
              const sc = statusColors[sub.status] || '#64748b';
              return (
                <div key={sub.id} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 120px 140px 80px',
                  borderBottom: idx < recentAssignments.length - 1 ? '1px solid #f1f5f9' : 'none',
                  alignItems: 'center', padding: '12px 24px',
                  backgroundColor: idx % 2 === 0 ? '#fff' : '#fafcff',
                }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>#{sub.id}</span>
                  <Link href={`/dashboard/reviewer/assignments/${sub.id}`} style={{ fontSize: '13px', color: '#005f96', textDecoration: 'none', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '12px' }}>
                    {sub.title}
                  </Link>
                  <span style={{ fontSize: '12px', color: sc, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sc, display: 'inline-block' }} />
                    {sub.status || 'Pending'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {sub.date || '—'}
                  </span>
                  <Link href={`/dashboard/reviewer/assignments/${sub.id}`} style={{ fontSize: '12px', color: '#005f96', textDecoration: 'none', fontWeight: '600', textAlign: 'right' }}>
                    Review →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      </div>{/* inner content padding div */}
    </div>
  );
}
