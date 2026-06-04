'use client';
import SubmissionsTable from '../_SubmissionsTable';
export default function IncompleteSubmissionsPage() {
  return <SubmissionsTable title="Incomplete submissions" filterFn={sub => (sub.status || '').toLowerCase().includes('incomplete') || (sub.activity || '').toLowerCase().includes('incomplete')} columns="author" extraMenuItems={[{ label: '✕  Delete Incomplete Submissions', onClick: () => {} }]} />;
}
