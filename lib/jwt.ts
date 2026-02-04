import jwt from 'jsonwebtoken'

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
    throw new Error ("401: Unauthorized")
  }

  const token = authHeader.split(' ')[1];

  try {
    const jwt = verifyJwt(token);
    if (typeof jwt === 'string') {
      throw new Error (jwt)
    } else {
      return jwt
    }
  } catch (err) {
    throw err
  }
}