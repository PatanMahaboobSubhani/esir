'use client';
import SubmissionsTable from '../../submissions/_SubmissionsTable';
export default function ReviewerPublishedPage() {
  return <SubmissionsTable title="Published" filterFn={sub => {
    const status = (sub.submission_status || '').toLowerCase();
    const isLive = status === 'scheduled' && sub.scheduled_at && new Date(sub.scheduled_at) <= new Date();
    return status === 'published' || isLive;
  }} columns="reviewer" />;
}
