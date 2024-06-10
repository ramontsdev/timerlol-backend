import 'dotenv/config';

import express from "express";
import { cors } from "./cors";
import { authenticationRoutes } from './routes/authentication';
import { paymentsRouter } from './routes/payments';
import { plansRoutes } from './routes/plans';
import { settingsRoutes } from './routes/settings';
import { usersRoutes } from './routes/users';

const server = express();

server.use(cors);
server.use(express.json());

server.use([
  authenticationRoutes,
  usersRoutes,
  settingsRoutes,
  paymentsRouter,
  plansRoutes
])

server.get('/hello', (request, response) => {
  const origin = request.header('origin');
  console.log({ hello: origin })
  return response.status(200).json({ message: 'Hello, word!' })
})

const port = process.env.PORT
server.listen(port, () => {
  console.log(`Server is running in port: ${port}`)
})
