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

const port = process.env.PORT || 3001
server.listen(port, () => {
  console.log(`Server is running in port: ${port}`)
})
