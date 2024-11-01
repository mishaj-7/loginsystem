// src/lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface UserToken {
  id: string;
  username: string;
  role: string;
}

export async function getToken(request: NextRequest): Promise<UserToken | null> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserToken;
    return decoded;
  } catch (error) {
    return null;
  }
}