import 'dotenv/config';

import express from "express";
import { cors } from "./cors";
import { authenticationRoutes } from './routes/authentication';

const server = express();

server.use(cors);
server.use(express.json());
server.use([
  authenticationRoutes
])

server.get('/hello', (request, response) => {
  const origin = request.header('origin');
  console.log({ hello: origin })
  return response.status(200).json({ message: 'Hello, word!' })
})

const port = process.env.PORT || 3001
server.listen(port, () => {
  console.log(`Server is running in port: ${port}`)
})
