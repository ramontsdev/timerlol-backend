import { response } from "../utils/response";

export async function handler() {
  const res = await fetch('https://0879-200-23-153-249.ngrok-free.app/hello');
  const jsonResponse = await res.json();

  return response(200, jsonResponse)
}
