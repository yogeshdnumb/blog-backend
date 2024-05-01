const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");


router
  .get("/login", authController.login_get)
  .post("/login", authController.login_post);

router
  .get("/register", authController.register_get)
  .post("/register", authController.register_post);

router.get('/logout', authController.logout_get)

router.get('/refresh', authController.refresh_get)


module.exports = router;
