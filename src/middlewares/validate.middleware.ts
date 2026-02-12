import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import ApiError from "../utils/ApiError";

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Collect all error messages
        const errorMessages = (error as any).errors.map((issue: any) => ({
             path: issue.path.join('.'),
             message: issue.message
        }));
        next(new ApiError(400, "Validation Error", errorMessages));
      } else {
          next(error);
      }
    }
  };
