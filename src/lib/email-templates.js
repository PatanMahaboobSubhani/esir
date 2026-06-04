/**
 * Professional Email Templates for EISR Academic Portal
 * Inspired by OJS and standard journal correspondence
 */

export const getInvitationEmailTemplate = ({
    reviewerName,
    journalName,
    articleTitle,
    abstract,
    responseDueDate,
    reviewDueDate,
    dashboardUrl,
    editorName,
    acceptLink,
    declineLink
}) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 15px;
      line-height: 1.8;
      color: #222222;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .wrap {
      max-width: 720px;
      margin: 0 auto;
      padding: 30px 20px 40px 20px;
      background: #ffffff;
    }
    p { margin: 0 0 16px 0; }
    a { color: #1155cc; }
    .bold-title { font-weight: bold; }
    .abstract-heading { font-weight: bold; margin-top: 18px; margin-bottom: 6px; }
    .abstract-text { margin: 0 0 16px 0; text-align: justify; }
    .action-links { margin: 24px 0; font-weight: bold; }
    .action-btn { margin-right: 20px; text-decoration: underline; color: #1155cc; }
    .action-btn-decline { text-decoration: underline; color: #cc0000; }
    .signature { margin-top: 24px; }
    .signature p { margin: 0 0 5px 0; }
  </style>
</head>
<body>
  <div class="wrap">
    <p>Dear ${reviewerName},</p>

    <p>
      I am writing to respectfully request your expertise and invite you to serve as a reviewer for a manuscript that has been recently submitted to the <strong>${journalName}</strong>. Given your extensive and highly regarded research background in this field, we firmly believe that your insights would serve as an invaluable contribution to our editorial evaluation process. We hold your scientific judgment in the highest esteem and hope that you will consider undertaking this important task for our distinguished journal.
    </p>

    <p>
      The editorial board has conducted an initial assessment of the manuscript and concluded that it warrants a comprehensive peer review to determine its suitability for publication. Your rigorous evaluation and constructive feedback are crucial in helping us maintain the exceptional scientific standards and academic integrity that our readership consistently expects from us.
    </p>

    <p class="bold-title">Title: ${articleTitle}</p>

    <p class="abstract-heading">Abstract:</p>
    <p class="abstract-text">${abstract}</p>

    <p>
      If you are able to accommodate this request and review this submission, your comprehensive evaluation and final recommendation will be due by <strong>${reviewDueDate}</strong>. As a reviewer, you will be expected to thoroughly examine the methodology, validate the empirical claims, and provide constructive commentary that can guide both the authors in the revision process and the editorial team in reaching a final publication decision.
    </p>

    <p>
      You can securely view the complete manuscript, upload detailed review files, and submit your final recommendation by logging into our dedicated manuscript management system. The platform will guide you through our standard evaluation questionnaire and provide secure access to all necessary supplementary materials required for your assessment at <a href="${dashboardUrl}">${dashboardUrl}</a>.
    </p>

    <div class="action-links">
      <p>Please click one of the following links to accept or decline the review by <strong>${responseDueDate}</strong>:</p>
      <p>
        <a href="${acceptLink}" class="action-btn">Accept Review</a> | 
        <a href="${declineLink}" class="action-btn-decline">Decline Review</a>
      </p>
    </div>

    <p><strong>Kindly don't use or upload the manuscript in AI applications.</strong> Maintaining the strictest confidentiality of unpublished research is a foundational ethical requirement of our peer review process, and we rely on our reviewers to protect the intellectual property of our submitting authors.</p>

    <p>You may contact me directly should you encounter any technical difficulties accessing the system, or if you have any preliminary questions regarding the submission or the scope of the review process.</p>

    <p>Thank you for your time, dedication to the scientific community, and for considering this request. Your scholarly help is very much appreciated.</p>

    <div style="margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 14px; color: #475569;">
      <p style="margin: 0;">Best regards,</p>
      <p style="margin: 4px 0 16px 0; font-weight: 700;">Your ${journalName} team</p>
      <p style="margin: 0; font-size: 12px; color: #64748b;">
        <strong>Eye-Innovations Scientific Research (EISR)</strong> | Editorial Office - Collaborative Peer Review Team<br>
        <a href="https://www.eye-isr.com" style="color: #005f96; text-decoration: none;">www.eye-isr.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
};


export const getProofConfirmedNotification = ({
    editorName,
    paperTitle,
    authorName,
    portalUrl,
    submissionId
}) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .wrap { max-width: 650px; margin: 20px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="wrap">
    <h2 style="color: #16a34a;">Final Proofs Confirmed</h2>
    <p>Dear ${editorName},</p>
    <p>This is to notify you that the author (<strong>${authorName}</strong>) has reviewed and confirmed the final proofs for the manuscript:</p>
    <p style="padding: 15px; background: #f8fafc; border-left: 4px solid #16a34a; font-style: italic;">
      "${paperTitle}"
    </p>
    <p>The manuscript is now ready to be scheduled for publication.</p>
    <div style="margin-top: 30px;">
      <a href="${portalUrl}/dashboard/submissions/${submissionId}" style="display: inline-block; padding: 12px 24px; background-color: #005f96; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Schedule Publication &rarr;</a>
    </div>
    <p style="margin-top: 30px; font-size: 12px; color: #64748b; border-top: 1px solid #eee; pt: 10px;">
      This is an automated notification from the Editorial System.
    </p>
  </div>
</body>
</html>`;
};
export const getSubmissionNotificationTemplate = ({
    authorName,
    authorEmail,
    articleTitle,
    submissionId,
    journalName,
    editorComments,
    submissionDate,
    portalUrl,
}) => {
    const year = new Date().getFullYear();
    const commentsBlock = editorComments && editorComments.trim()
        ? `<div class="comments-box">
               <div class="clabel">Comments for the Editor</div>
               <div>${editorComments}</div>
           </div>`
        : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f7f9; }
    .wrap { max-width: 650px; margin: 20px auto; background: #ffffff; border: 1px solid #e1e8ed; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .hdr { background-color: #002137; color: #ffffff; padding: 28px 35px; }
    .hdr h1 { margin: 0 0 4px 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    .hdr p { margin: 0; font-size: 13px; opacity: 0.72; }
    .body { padding: 35px; }
    .badge { display: inline-block; background-color: #00a86b; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; margin-bottom: 16px; }
    .intro { font-size: 15px; margin-bottom: 26px; color: #444; }
    .title-box { background: #fff9c4; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 0 6px 6px 0; margin-bottom: 26px; }
    .title-box .tlbl { font-size: 11px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .title-box .ttl { font-size: 15px; font-weight: 600; color: #1e293b; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 22px 25px; margin-bottom: 26px; }
    .row { display: flex; align-items: flex-start; margin-bottom: 13px; }
    .row:last-child { margin-bottom: 0; }
    .rlbl { font-weight: 700; color: #002137; font-size: 13px; min-width: 150px; padding-top: 1px; }
    .rval { color: #334155; font-size: 14px; flex: 1; }
    .rval a { color: #005f96; text-decoration: none; }
    .pill { display: inline-block; background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
    .comments-box { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 14px 18px; border-radius: 0 6px 6px 0; margin-bottom: 26px; font-size: 14px; color: #166534; }
    .clabel { font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .btn { display: inline-block; padding: 13px 26px; background-color: #005f96; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 14px; }
    .note { font-size: 13px; color: #64748b; margin-top: 26px; padding-top: 18px; border-top: 1px solid #f1f5f9; }
    .ftr { background-color: #f8fafc; padding: 22px 35px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
    .ftr p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">
      <h1>EISR Portal &mdash; New Submission Received</h1>
      <p>Eye-Innovations Scientific Research | Academic Publishing System</p>
    </div>
    <div class="body">
      <span class="badge">&#10003; New Submission</span>
      <p class="intro">A new manuscript has been submitted through the EISR Portal. Please review the details below and take the appropriate editorial action.</p>

      <div class="title-box">
        <div class="tlbl">Manuscript Title</div>
        <div class="ttl">${articleTitle}</div>
      </div>

      <div class="card">
        <div class="row">
          <span class="rlbl">Submission ID</span>
          <span class="rval"><span class="pill">#${submissionId}</span></span>
        </div>
        <div class="row">
          <span class="rlbl">Author</span>
          <span class="rval">${authorName}</span>
        </div>
        <div class="row">
          <span class="rlbl">Author Email</span>
          <span class="rval"><a href="mailto:${authorEmail}">${authorEmail}</a></span>
        </div>
        <div class="row">
          <span class="rlbl">Journal</span>
          <span class="rval">${journalName}</span>
        </div>
        <div class="row">
          <span class="rlbl">Date Submitted</span>
          <span class="rval">${submissionDate}</span>
        </div>
      </div>

      ${commentsBlock}

      <p style="font-size:14px; color:#475569; margin-bottom:14px;">Log in to the editorial dashboard to assign reviewers and manage this submission.</p>
      <a href="${portalUrl}/dashboard" class="btn">Open Editorial Dashboard &rarr;</a>

      <div class="note">
        <p>This is an automated notification from the EISR Portal. Please do not reply directly to this email.</p>
      </div>
    </div>
    <div class="ftr">
      <p>&copy; ${year} Eye-Innovations Scientific Research (EISR). All rights reserved.</p>
      <p>EISR Academic Publishing Portal</p>
    </div>
  </div>
</body>
</html>`;
};

export const getDecisionNotificationTemplate = ({
    authorName,
    articleTitle,
    submissionId,
    journalName,
    decision,
    editorComments,
    portalUrl,
}) => {
    const year = new Date().getFullYear();
    
    let decisionColor = '#005f96';
    let decisionText = decision;
    let icon = 'ℹ️';

    if (decision === 'Accepted') {
        decisionColor = '#00a86b';
        decisionText = 'Accepted for Publication';
        icon = '✅';
    } else if (decision === 'Declined') {
        decisionColor = '#dc2626';
        decisionText = 'Submission Declined';
        icon = '❌';
    } else if (decision === 'Revisions Requested') {
        decisionColor = '#ca8a04';
        decisionText = 'Revisions Requested';
        icon = '✏️';
    }

    const commentsBlock = editorComments && editorComments.trim()
        ? `<div style="background: #f8fafc; border-left: 4px solid ${decisionColor}; padding: 16px; border-radius: 4px; margin: 24px 0; font-size: 14px; color: #334155;">
               <div style="font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; color: ${decisionColor};">Editor's Comments:</div>
               <div style="line-height: 1.6;">${editorComments.replace(/\n/g, '<br>')}</div>
           </div>`
        : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f7f9; }
    .wrap { max-width: 650px; margin: 20px auto; background: #ffffff; border: 1px solid #e1e8ed; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .hdr { background-color: #002137; color: #ffffff; padding: 28px 35px; }
    .hdr h1 { margin: 0; font-size: 20px; font-weight: 700; }
    .body { padding: 35px; }
    .decision-badge { display: inline-block; background-color: ${decisionColor}; color: #fff; font-size: 12px; font-weight: 700; text-transform: uppercase; padding: 5px 14px; border-radius: 4px; margin-bottom: 20px; }
    .intro { font-size: 15px; color: #444; margin-bottom: 20px; }
    .title-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; margin-bottom: 24px; }
    .tlbl { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px; }
    .ttl { font-size: 15px; font-weight: 600; color: #1e293b; }
    .btn { display: inline-block; padding: 12px 24px; background-color: #005f96; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: 700; font-size: 14px; }
    .ftr { background-color: #f8fafc; padding: 20px 35px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">
      <h1>${journalName}</h1>
    </div>
    <div class="body">
      <div class="decision-badge">${icon} ${decisionText}</div>
      <p class="intro">Dear ${authorName},</p>
      <p class="intro">Thank you for submitting your work to our journal. An editorial decision has been reached regarding your submission.</p>

      <div class="title-box">
        <div class="tlbl">Manuscript Title</div>
        <div class="ttl">${articleTitle}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 8px;">Submission ID: #${submissionId}</div>
      </div>

      ${commentsBlock}

      <p class="intro">You can view the full details and take any necessary actions by logging into your author dashboard.</p>
      
      <a href="${portalUrl}/dashboard/submissions/${submissionId}" class="btn">View Submission Dashboard &rarr;</a>

      <div style="margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 14px; color: #475569;">
        <p style="margin: 0;">Best regards,</p>
        <p style="margin: 4px 0 16px 0; font-weight: 700;">Your ${journalName} team</p>
        <p style="margin: 0; font-size: 12px; color: #64748b;">
          <strong>Eye-Innovations Scientific Research (EISR)</strong> | Editorial Office - Collaborative Peer Review Team<br>
          <a href="https://www.eye-isr.com" style="color: #005f96; text-decoration: none;">www.eye-isr.com</a>
        </p>
      </div>
    </div>
    <div class="ftr">
      <p>&copy; ${year} Eye-Innovations Scientific Research. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
};

export const getAcceptedProofTemplate = ({
    authorName,
    paperTitle,
    deadlineDate,
    portalUrl,
    submissionId,
    journalName
}) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .wrap { max-width: 650px; margin: 20px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; }
    p { margin-bottom: 16px; }
    .signature { margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 14px; color: #475569; }
  </style>
</head>
<body>
  <div class="wrap">
    <p>Dear ${authorName},</p>
    <p>Greetings.</p>
    <p>The email has been sent regarding the accepted paper entitled "<strong>${paperTitle}</strong>" in <strong>${journalName}</strong>.</p>
    <p>Please review and answer the comments in the final corrected proof of the manuscript within 2 days. If the authors do not reply by this deadline, we will move the manuscript to the next issue.</p>
    <p>So please make the comments and reply no later than <strong>${deadlineDate}</strong>. Please find the draft in the portal dashboard.</p>
    <p>Thanks.</p>
    
    <p style="color: #475569; line-height: 1.4; margin-top: 24px;">
      Best regards,<br>
      Your ${journalName} team<br>
      Eye-Innovations Scientific Research (EISR) | Editorial Office - Collaborative Peer Review Team<br>
      <a href="https://www.eye-isr.com" style="color: #005f96; text-decoration: none;">www.eye-isr.com</a>
    </p>

    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
      <a href="${portalUrl}/dashboard/submissions/${submissionId}" style="display: inline-block; padding: 10px 20px; background-color: #005f96; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">View Manuscript &rarr;</a>
    </div>
  </div>
</body>
</html>`;
};

