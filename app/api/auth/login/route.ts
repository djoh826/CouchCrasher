import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'


export async function POST(req: Request) {
    const { email, password } = await req.json()


    const user = await prisma.users.findFirst({
        where: { email: email },
    })


    if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }


    const valid = await verifyPassword(password, user.password)


    if (!valid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }


    (await cookies()).set('session', String(user.uid), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    })


    return NextResponse.json({ success: true })
}