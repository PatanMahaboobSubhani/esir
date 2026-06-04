'use client';
import SubmissionsTable from '../_SubmissionsTable';
export default function RevisionsSubmittedPage() {
  return <SubmissionsTable title="Revisions submitted" filterFn={sub => (sub.status || '').toLowerCase().includes('revisions submitted')} columns="author" extraMenuItems={[{ label: '✕  Delete Incomplete Submissions', onClick: () => {} }]} />;
}
