'use client';
import SubmissionsTable from '../_SubmissionsTable';

export default function InReviewManuscriptsPage() {
  return (
    <SubmissionsTable 
      title="Editorial Dashboard: Manuscripts In Review" 
      filterFn={sub => {
        const act = (sub.activity || '').toLowerCase();
        return act.includes('review') && !act.includes('declined');
      }} 
      columns="editor" 
      extraMenuItems={[]} 
    />
  );
}
