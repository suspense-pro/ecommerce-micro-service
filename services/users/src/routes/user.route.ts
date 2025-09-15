import express from "express";
const router = express.Router();

// public routes
router.post("/signup", () => {});
router.post("/login", () => {});

// protect routes

router.patch("/updatePassword", () => {});
router.route("/").get(() => {});
router
  .route("/:id")
  .get(() => {})
  .patch(() => {})
  .delete(() => {});

export default router;
