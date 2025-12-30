import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    phone: "123456789",
    email: "support@edoctor.com",
    whatsapp: "123456789",
    version: "1.0.0",
    status: "All systems operational"
  });
});

export default router;
