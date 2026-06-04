'use client';
import SubmissionsTable from '../../submissions/_SubmissionsTable';
export default function ReviewerArchivedPage() {
  return (
    <SubmissionsTable
      title="Archived assignments"
      filterFn={sub => (sub.status || '').toLowerCase() === 'archived'}
      columns="reviewer"
    />
  );
}
