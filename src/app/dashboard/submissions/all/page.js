'use client';
import SubmissionsTable from '../_SubmissionsTable';
export default function AllSubmissionsPage() {
  return <SubmissionsTable title="All submissions" filterFn={null} columns="author" extraMenuItems={[{ label: '✕  Delete Incomplete Submissions', onClick: () => {} }]} />;
}
