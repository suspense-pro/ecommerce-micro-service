import express from "express";
import {
  login,
  refreshToken,
  registerUser,
} from "../controllers/user.controller";
const router = express.Router();

// public routes
router.post("/signup", registerUser);
router.post("/login", login);
router.get("/refresh-token", refreshToken);

// protect routes
router.patch("/updatePassword", (req, res) => {
  // TODO: handle password update
  res.send("updatePassword");
});

router.route("/").get((req, res) => {
  res.status(200).json({
    data: "data",
  });
});

router
  .route("/:id")
  .get((req, res) => {
    res.status(200).json({
      data: "data",
    });
  })
  .patch((req, res) => {
    res.send("update by id");
  })
  .delete((req, res) => {
    res.send("delete by id");
  });

export default router;
