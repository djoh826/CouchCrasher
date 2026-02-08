import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set')
}

export type JwtPayload = {
  uid: number
  email: string
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}

export function checkIfLoggedIn(req: Request) {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new HttpError(401, 'Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  const jwt = verifyJwt(token);

  if (typeof jwt === 'string') {
    throw new HttpError(401, jwt);
  }

  return jwt
}

export async function isAdmin(jwt: JwtPayload) {
  const user = await prisma.users.findUnique({
    where: { uid: jwt.uid },
  });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  if (!user.isadmin) {
    throw new HttpError(403, 'Forbidden: admin access required');
  }

  return true;
}


export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}