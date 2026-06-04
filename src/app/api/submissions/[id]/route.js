import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser, unauthorizedResponse } from '@/lib/auth';

export async function GET(req, { params }) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    // 1. Get submission
    const [subRows] = await pool.query(
      'SELECT id, title, status, activity, created_at, user_id, prefix, subtitle, abstract, keywords, editor_comments, references_list, final_file_path, citations_scopus, citations_google, doi FROM submissions WHERE id = ?',
      [id]
    );

    if (subRows.length === 0) {
      return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
    }

    const submission = subRows[0];
    
    // Auth check - user must own it, be an editor/admin, or be assigned as a reviewer
    let isEditorial = (user.role === 'editor' || user.role === 'admin');
    let isOwner = (submission.user_id === user.userId);
    let isAuthorized = isOwner || isEditorial;
    let assignment = null;

    if (!isAuthorized) {
      const [assignmentRows] = await pool.query(
        `SELECT ra.id, ra.assigned_at, ra.status, ra.response_deadline, ra.review_deadline 
         FROM reviewer_assignments ra
         JOIN users u ON ra.user_id = u.id
         WHERE ra.submission_id = ? AND (ra.user_id = ? OR u.email = ?)`,
        [id, user.userId, user.email]
      );
      if (assignmentRows.length > 0) {
        isAuthorized = true;
        assignment = assignmentRows[0];
      }
    }

    if (!isAuthorized) {
      return unauthorizedResponse();
    }


    // 2. Get files
    const [fileRows] = await pool.query(
      'SELECT id, name, type, path, uploaded_at FROM submission_files WHERE submission_id = ?',
      [id]
    );

    // 3. Get contributors
    const [contribRows] = await pool.query(
      'SELECT id, name, email FROM submission_contributors WHERE submission_id = ?',
      [id]
    );

    // 4. Get discussions
    const [discRows] = await pool.query(
      `SELECT d.id, d.subject, d.created_at, u.username as author 
       FROM discussions d 
       LEFT JOIN users u ON d.user_id = u.id 
       WHERE d.submission_id = ?`,
      [id]
    );

    // 5. Get all assignments & reviews (Full details only for editors/admins)
    let allAssignments = [];
    if (isEditorial) {
      const [allAssRows] = await pool.query(
        `SELECT ra.id, ra.status, ra.assigned_at, u.fullName as reviewerName, u.email as reviewerEmail 
         FROM reviewer_assignments ra
         LEFT JOIN users u ON ra.user_id = u.id
         WHERE ra.submission_id = ?`,
        [id]
      );

      const [allRevRows] = await pool.query(
        `SELECT sr.*, u.fullName as reviewerName 
         FROM submission_reviews sr
         LEFT JOIN users u ON sr.user_id = u.id
         WHERE sr.submission_id = ?`,
        [id]
      );

      allAssignments = allAssRows.map(ass => {
        const review = allRevRows.find(r => r.user_id === ass.user_id);
        return {
          ...ass,
          review: review ? {
            recommendation: review.recommendation,
            commentsAuthors: review.comments_authors,
            commentsEditors: review.comments_editors,
            rating: review.rating,
            date: review.created_at,
            isDraft: review.is_draft
          } : null
        };
      });
    }

// Format response
    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        title: submission.title,
        status: submission.status,
        activity: submission.activity,
        prefix: submission.prefix || '',
        subtitle: submission.subtitle || '',
        abstract: submission.abstract || '',
        keywords: submission.keywords || '',
        references: submission.references_list || '',
        editor_comments: submission.editor_comments || '',
        final_file_path: submission.final_file_path || '',
        citations_scopus: submission.citations_scopus || 0,
        citations_google: submission.citations_google || 0,
        doi: submission.doi || '',
        language: 'English',
        files: Array.from(new Map(fileRows.map(f => [f.path, f])).values()).map(f => ({ 
          id: f.id, 
          name: f.name, 
          type: f.type, 
          path: f.path, 
          date: f.uploaded_at 
        })),
        contributors: contribRows,
        discussions: discRows.map(d => ({
          id: d.id,
          subject: d.subject,
          author: d.author,
          date: d.created_at,
          replies: 0
        })),
        assignment: assignment,
        assignments: allAssignments
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Fetch single submission error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  const { id } = await params;
  const { title, prefix, subtitle, abstract, keywords, references, citations_scopus, citations_google, doi } = await req.json();

  try {
    // Auth check: only owner can update for now
    const [subRows] = await pool.query('SELECT user_id FROM submissions WHERE id = ?', [id]);
    if (subRows.length === 0) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    
    const isEditorial = (user.role === 'editor' || user.role === 'admin');
    if (subRows[0].user_id !== user.userId && !isEditorial) return unauthorizedResponse();

    // Update submission
    await pool.query(
      'UPDATE submissions SET title = ?, prefix = ?, subtitle = ?, abstract = ?, keywords = ?, references_list = ?, citations_scopus = ?, citations_google = ?, doi = ? WHERE id = ?',
      [title, prefix || '', subtitle || '', abstract || '', keywords || '', references || '', citations_scopus || 0, citations_google || 0, doi || null, id]
    );

    return NextResponse.json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    console.error('Update submission error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update' }, { status: 500 });
  }
}
