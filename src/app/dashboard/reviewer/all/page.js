'use client';
import { useState, useEffect } from 'react';
import SubmissionsTable from '../../submissions/_SubmissionsTable';

export default function ReviewerAllPage() {
  const [role, setRole] = useState('reviewer');

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
      title={role === 'editor' ? "Editorial Dashboard: Reviewer Pool & Assignments" : "All assignments"}
      filterFn={() => true}
      columns={role}
    />
  );
}
