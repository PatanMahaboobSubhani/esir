'use client';
import { useState, useEffect } from 'react';
import SubmissionsTable from './_SubmissionsTable';

export default function ActiveSubmissionsPage() {
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
      title={role === 'editor' ? "Editorial Dashboard: All Submissions" : "Active submissions"}
      filterFn={sub => role === 'editor' ? true : !['declined', 'published'].includes((sub.status || '').toLowerCase())}
      columns={role}
      extraMenuItems={role === 'author' ? [{ label: '✕  Delete Incomplete Submissions', onClick: () => {} }] : []}
    />
  );
}
