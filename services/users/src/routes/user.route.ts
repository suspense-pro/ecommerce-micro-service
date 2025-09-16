import express from "express";
const router = express.Router();

// public routes
router.post("/signup", (req, res) => {
  // TODO: handle signup
  res.send("signup");
});

router.post("/login", (req, res) => {
  // TODO: handle login
  res.send("login");
});

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
