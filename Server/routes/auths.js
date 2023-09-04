import Express from "express";
import { signup, signin } from "../controllers/auth.js";

const router = new Express.Router();

router.post("/signup", signup );
router.post("/signin", signin );

export default router;