'use client';
import SubmissionsTable from '../_SubmissionsTable';

export default function ScheduledSubmissions() {
  return (
    <SubmissionsTable 
      title="Scheduled Publications" 
      filterFn={(sub) => {
        const status = (sub.status || '').toLowerCase();
        const isLive = status === 'scheduled' && sub.scheduled_at && new Date(sub.scheduled_at) <= new Date();
        return status === 'scheduled' && !isLive;
      }} 
      columns="editor" 
    />
  );
}
