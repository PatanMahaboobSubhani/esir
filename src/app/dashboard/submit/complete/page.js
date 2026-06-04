'use client';
import Link from 'next/link';

export default function SubmissionCompletePage() {
  return (
    <div style={{ padding: '40px 24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '32px', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#d4edda', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <span style={{ fontSize: '24px' }}>✓</span>
        </div>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#333', marginBottom: '12px' }}>Submission complete</h1>
        <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.7', marginBottom: '24px' }}>
          The submission, has been submitted successfully and you have/will receive a confirmation email shortly.
          You are now able to monitor the progress of your submission through the editorial process by logging into the
          journal web site.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <Link href="/dashboard/submissions" style={{ color: '#007ab8', textDecoration: 'none', fontSize: '13px' }}>
            → Return to your submissions
          </Link>
          <Link href="/dashboard/submit" style={{ color: '#007ab8', textDecoration: 'none', fontSize: '13px' }}>
            → Make another submission
          </Link>
          <Link href="/" style={{ color: '#007ab8', textDecoration: 'none', fontSize: '13px' }}>
            → Continue browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
