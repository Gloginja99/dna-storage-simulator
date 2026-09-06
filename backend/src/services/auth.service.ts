import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import {
  AuthResponse,
  LoginRequestBody,
  RegisterRequestBody,
} from "../types/auth.api";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-only-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";
const SALT_ROUNDS = 10;

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

export class AuthService {
  async register(body: RegisterRequestBody): Promise<AuthResponse> {
    const username = body.username?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!username || username.length < 3) {
      throw new AuthError("Username must be at least 3 characters", 400);
    }
    if (!email || !email.includes("@")) {
      throw new AuthError("A valid email is required", 400);
    }
    if (!password || password.length < 6) {
      throw new AuthError("Password must be at least 6 characters", 400);
    }

    const existing = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existing) {
      throw new AuthError("Username or email already in use", 409);
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserModel.create({ username, email, passwordHash });

    return this.buildAuthResponse(
      user._id.toString(),
      user.username,
      user.email,
    );
  }

  async login(body: LoginRequestBody): Promise<AuthResponse> {
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      throw new AuthError("Email and password are required", 400);
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new AuthError("Invalid email or password", 401);
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw new AuthError("Invalid email or password", 401);
    }

    return this.buildAuthResponse(
      user._id.toString(),
      user.username,
      user.email,
    );
  }

  private buildAuthResponse(
    id: string,
    username: string,
    email: string,
  ): AuthResponse {
    const token = jwt.sign({ sub: id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
    return { token, user: { id, username, email } };
  }
}

export function verifyToken(token: string): { sub: string } {
  return jwt.verify(token, JWT_SECRET) as { sub: string };
}
