'use client';
import SubmissionsTable from '../../submissions/_SubmissionsTable';
export default function ReviewerActionRequiredPage() {
  return (
    <SubmissionsTable
      title="Action Required by me"
      filterFn={sub => ['pending', 'accepted'].includes((sub.status || '').toLowerCase())}
      columns="reviewer"
    />
  );
}
