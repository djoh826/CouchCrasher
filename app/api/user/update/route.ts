import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { checkIfLoggedIn, isAdmin, HttpError } from '@/lib/jwt';

// /user/update
// Updates own user
// If password entered, check if password meets requirements?
// Change so only updates fields that are given
export async function GET(req: Request) {

    const body = await req.json()
    const { uid, email, password, name, phone, dob, 
        pictureurl, address, emname, emrel, ememail, guest, host } = body

    try {
        const jwtPayload = checkIfLoggedIn(req)
        
        // check if uid is current user

        // update one user
        const response = await prisma.users.update({
            where: {
                uid: uid
            },
            data: {
                name: name,
                email: email,
                password: password,
                dob: dob,
                pictureurl: pictureurl,
                address: address,
                phone: phone,
                emname: emname,
                emrel: emrel,
                ememail: ememail,
                guest: guest,
                host: host
            },
        })
        return NextResponse.json(response);

    } catch (err) {
        if (err instanceof HttpError) {
        return NextResponse.json(
            { error: err.message },
            { status: err.status }
        );
        }
    }
}