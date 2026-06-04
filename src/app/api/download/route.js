import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

/**
 * API Route to securely download uploaded files.
 * This handles potential issues with static file serving on various hosting platforms.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileParam = searchParams.get('file');

    if (!fileParam) {
      return NextResponse.json({ success: false, message: 'File parameter is required' }, { status: 400 });
    }

    // Extract just the filename to prevent directory traversal attacks
    // even if the database stored a full path or relative path
    const filename = path.basename(fileParam);
    
    let folderName = filename.charAt(0).toUpperCase();
    if (!/^[A-Z]$/.test(folderName)) {
      folderName = 'OTHER';
    }

    // Define potential locations where the file might be stored
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'uploads', filename),
      path.join(process.cwd(), 'public', 'uploads', folderName, filename),
      path.join(process.cwd(), 'public', 'uploads', 'OTHER', filename),
      path.join(process.cwd(), 'uploads', filename),
      // Add other common paths if necessary
    ];

    let finalPath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        finalPath = p;
        break;
      }
    }

    if (!finalPath) {
      console.error(`Download failed: File not found. Tried paths: ${possiblePaths.join(', ')}`);
      return NextResponse.json({ 
        success: false, 
        message: 'File not found on server. Please ensure the file was uploaded correctly.' 
      }, { status: 404 });
    }

    // Read file content
    const fileBuffer = await readFile(finalPath);
    
    const inline = searchParams.get('inline') === 'true';

    // Determine Content-Type based on extension
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.txt': 'text/plain',
      '.zip': 'application/zip'
    };
    
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    const disposition = inline && ext === '.pdf' ? 'inline' : 'attachment';

    // Return the file as a response with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `${disposition}; filename="${filename}"`,
        'Cache-Control': 'no-store, max-age=0'
      },
    });

  } catch (error) {
    console.error('Download API Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error during download' }, { status: 500 });
  }
}
