'use client';
import SubmissionsTable from '../_SubmissionsTable';

export default function EditorialSubmissionsPage() {
  return (
    <SubmissionsTable 
      title="Editorial Dashboard: All Submissions" 
      filterFn={null} 
      columns="editor" 
      extraMenuItems={[]} 
    />
  );
}
