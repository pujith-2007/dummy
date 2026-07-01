import { type IRouter, Router } from "express";
import { getHealth } from "@/features/health/controllers/health-controller";

const router: IRouter = Router();

router.get("/", getHealth);

export { router as healthRouter };
