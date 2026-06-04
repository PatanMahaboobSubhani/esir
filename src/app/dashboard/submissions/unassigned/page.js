'use client';
import SubmissionsTable from '../_SubmissionsTable';

export default function UnassignedManuscriptsPage() {
  return (
    <SubmissionsTable 
      title="Editorial Dashboard: Unassigned Manuscripts" 
      filterFn={sub => {
        const act = (sub.activity || '').toLowerCase();
        return act === 'unassigned' || act.includes('declined');
      }} 
      columns="editor" 
      extraMenuItems={[]} 
    />
  );
}
