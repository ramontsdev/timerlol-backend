export function response(statusCode: number, body?: Record<string, any>) {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
  };
}
