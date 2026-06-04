'use client';
import SubmissionsTable from '../../submissions/_SubmissionsTable';
export default function ReviewerCompletedPage() {
  return <SubmissionsTable title="Completed" filterFn={sub => (sub.status || '').toLowerCase() === 'completed'} columns="reviewer" />;
}
