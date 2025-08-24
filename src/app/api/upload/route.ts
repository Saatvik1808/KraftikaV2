import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueId = uuidv4();
    const fileName = `${uniqueId}.${fileExtension}`;
    
    // Create path to public folder
    const publicDir = join(process.cwd(), 'public');
    const uploadDir = join(publicDir, 'uploads');
    const filePath = join(uploadDir, fileName);
    
    // Ensure uploads directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write file to public/uploads folder
    await writeFile(filePath, buffer);
    
    // Return success with file path
    const publicPath = `/uploads/${fileName}`;
    
    return NextResponse.json({
      success: true,
      fileName: fileName,
      publicPath: publicPath,
      fileSize: file.size,
      message: 'Image uploaded successfully to public folder'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
