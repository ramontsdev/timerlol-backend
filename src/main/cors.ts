import { NextFunction, Request, Response } from 'express';

export function cors(request: Request, response: Response, next: NextFunction) {
  // const allowedOrigins = [];
  const allowedOrigins = process.env.ORIGIN_ALLOWED?.split('-') as string[];

  const origin = request.header('origin');
  const isAllowed = allowedOrigins.includes(origin!);

  if (isAllowed) {
    console.log("Caiu aqui!")
    response.setHeader('Access-Control-Allow-Origin', origin!);
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Allow-Max-Age', '10');
  };

  next();
};
