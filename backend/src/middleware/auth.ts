import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import jwt from "jsonwebtoken";


export interface AuthenticatedRequest extends Request {
  merchant?: {
    id: string;
    walletPubkey: string;
    keyType: "secret" | "publishable";
  };
}



export async function signupmerchantprofile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  
 try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existingUser = await prisma.merchantAccount.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.merchantAccount.create({
      data: {
        email,
       passwordHash: hashedPassword,
      },
    });
  const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!, // must be 32+ chars
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "User created",
      user: {
        id: user.id,
        email: user.email,
      },
      token:token

    })
  } catch (error) {
    next(error);
  }
}
export async function loginmerchant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try{
   const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // 2. Fetch user from DB
    const user = await prisma.merchantAccount.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3. Compare password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 4. Create JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!, // must be 32+ chars
      { expiresIn: "7d" }
    );

    // 5. Send token in response
    return res.json({
      message: "Login successful",
      token,
      AccountActivated:user.activated
    });
  } catch (error) {
    next(error);
  }
}


export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET not configured");
    }

    // Decode token
    const decoded = jwt.verify(token, secret) as { userId: string; email: string };

    // Attach to req
    req.userId = decoded.userId;
    req.email = decoded.email;

    return next(); // continue to route handler

  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
