type Body = Record<string, any>;

export function bodyParser(body?: string): Body {
  let parsedBody = {};

  try {
    if (body)
      parsedBody = JSON.parse(body);
  } catch (error) {}

  return parsedBody;
}
