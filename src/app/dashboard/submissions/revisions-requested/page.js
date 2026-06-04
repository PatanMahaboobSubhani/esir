'use client';
import SubmissionsTable from '../_SubmissionsTable';
export default function RevisionsRequestedPage() {
  return <SubmissionsTable title="Revisions requested" filterFn={sub => (sub.status || '').toLowerCase().includes('revision')} columns="author" extraMenuItems={[{ label: '✕  Delete Incomplete Submissions', onClick: () => {} }]} />;
}
