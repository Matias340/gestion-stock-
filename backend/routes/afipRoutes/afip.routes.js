import express from "express";
import { facturarConAFIP } from "../../afip/afipController.js";

const router = express.Router();

router.post("/facturar", facturarConAFIP);

export default router;
