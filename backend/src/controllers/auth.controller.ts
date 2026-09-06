import { Request, Response } from "express";
import { AuthError, AuthService } from "../services/auth.service";
import {
  AuthResponse,
  LoginRequestBody,
  RegisterRequestBody,
} from "../types/auth.api";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (
    req: Request<unknown, AuthResponse, RegisterRequestBody>,
    res: Response<AuthResponse | { message: string }>,
  ): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      this.handleError(err, res);
    }
  };

  login = async (
    req: Request<unknown, AuthResponse, LoginRequestBody>,
    res: Response<AuthResponse | { message: string }>,
  ): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.json(result);
    } catch (err) {
      this.handleError(err, res);
    }
  };

  private handleError(err: unknown, res: Response): void {
    if (err instanceof AuthError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
