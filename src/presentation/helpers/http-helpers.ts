import { HttpResponse } from '../protocols/http';

export function serverError(data?: any): HttpResponse {
  return {
    statusCode: 500,
    body: data ?? { error: 'Internal server error.' },
  };
}

export function badRequest(data?: any): HttpResponse {
  return {
    statusCode: 400,
    body: data,
  };
}

export function unauthorized(data?: any): HttpResponse {
  return {
    statusCode: 401,
    body: data,
  };
}

export function conflict(data?: any): HttpResponse {
  return {
    statusCode: 409,
    body: data,
  };
}

export function notFound(data?: any): HttpResponse {
  return {
    statusCode: 404,
    body: data,
  };
}

export function noContent(): HttpResponse {
  return {
    statusCode: 204,
  };
}

export function created(data?: any): HttpResponse {
  return {
    statusCode: 201,
    body: data
  }
}

export function ok(data?: any): HttpResponse {
  return {
    statusCode: 200,
    body: data,
  };
}
