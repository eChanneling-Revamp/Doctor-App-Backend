// src/utils/ApiError.ts
export default class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;

    // Fix for extending built-in Error in TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}