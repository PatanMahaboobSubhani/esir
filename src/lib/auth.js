import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_eisr_123';

export function verifyRequestUser(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // { userId, email, name, ... }
  } catch (error) {
    return null;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
}
