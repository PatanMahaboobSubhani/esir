'use client';
import { useState, useEffect } from 'react';
import SubmissionsTable from '../_SubmissionsTable';

export default function PublishedSubmissionsPage() {
  const [role, setRole] = useState('author');

  useEffect(() => {
    const token = localStorage.getItem('eisr_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'editor' || payload.role === 'admin') {
          setRole('editor');
        }
      } catch (e) {}
    }
  }, []);

  return (
    <SubmissionsTable 
      title={role === 'editor' ? "Editorial Dashboard: Published" : "Published"} 
      filterFn={sub => {
        const status = (sub.status || '').toLowerCase();
        const isLive = status === 'scheduled' && sub.scheduled_at && new Date(sub.scheduled_at) <= new Date();
        return status === 'published' || isLive;
      }} 
      columns={role} 
      extraMenuItems={role === 'author' ? [{ 
        label: '✕  Delete Incomplete Submissions', 
        onClick: async () => {
          if (!confirm('Are you sure you want to delete all incomplete submissions? This cannot be undone.')) return;
          try {
            const token = localStorage.getItem('eisr_token');
            const res = await fetch('/api/submissions/bulk-delete?status=Incomplete', {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
              alert(`Deleted ${data.count} incomplete submissions.`);
              window.location.reload();
            } else {
              alert(data.message);
            }
          } catch (err) { alert('Error deleting submissions'); }
        } 
      }] : []} 
    />
  );
}
