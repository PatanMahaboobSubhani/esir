import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const originalExt = path.extname(file.name);

    // Clean filename
    const baseName = path
      .basename(file.name, originalExt)
      .replace(/[^a-zA-Z0-9]/g, '_');

    // Final filename
    const filename = `${baseName}_${timestamp}_${randomStr}${originalExt}`;

    // First letter folder
    let folderName = baseName.charAt(0).toUpperCase();

    // Fallback if no valid first letter
    if (!folderName || !/^[A-Z]$/.test(folderName)) {
      folderName = 'OTHER';
    }

    // e.g., public/uploads/A
    const uploadDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      folderName
    );

    // Auto create folder if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}

    // Final file path
    const filePath = path.join(uploadDir, filename);

    // Save file
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      name: filename,
      // Public URL to access the file
      path: `/uploads/${folderName}/${filename}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Upload failed',
        error: error.message
      },
      { status: 500 }
    );
  }
}
