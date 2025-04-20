import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";
const SecrentKey = process.env.SecretKey;

export async function POST(req: Request) {

    try {
        const secretKey = req.headers.get("Authorization")?.split(" ")[1];
     

        if (!secretKey) {
            return NextResponse.json(
                { error: "Secret Key is required" },
                { status: 400 }
            );
        }
        if (SecrentKey !== secretKey) {
            return NextResponse.json(
                { error: "Invalid Secret Key" },
                { status: 401 }
            );
        }

        const expiration = "1h";

        const token = jwt.sign(
            { secretKey }, // Payload (data inside the token)
            JWT_SECRET, // Secret key to sign the token
            { expiresIn: expiration } // Set the expiration time for the token
        );

        return NextResponse.json({ message: "Token generated", token });

    } catch (error) {
    

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}