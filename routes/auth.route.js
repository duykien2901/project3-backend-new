var express = require("express");
var verifySignUp = require("../middlewares/verifySignUp");
var authController = require("../controllers/users/auth.controler");

module.exports = () => {
  var router = express.Router();
  const { signup, acceptMail, resendMail, login, resetPassword } =
    authController();
  const { checkDuplicateMail } = verifySignUp();

  router.route("/signup").post(checkDuplicateMail, signup);

  router.post("/signup/accept", acceptMail);

  router.post("/resend-mail", checkDuplicateMail, resendMail);

  router.post("/login", login);

  router.post("/reset-password", resetPassword);
  return router;
};
