import { Router } from "express";
import { prismaClient } from "../../infra/database/postgresDb";

export const plansRoutes = Router();

plansRoutes.get('/plans', async (request, response) => {
  const plans = await prismaClient.plan.findMany();

  return response.status(200).json(plans);
});
