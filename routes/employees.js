var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Employee Related Routes */
router.post("/signIn", validator.signInValidator, utility.employees.signIn); // Api to signIn
router.get("/loadEmployee", auth.loginAuth, utility.employees.loadEmployee); // Api to load employee
router.get("/signOut", auth.loginAuth, utility.employees.signOut); // Api to signOut
router.get("/refreshToken", validator.jwtTokenValidator, utility.employees.refreshToken); // Api to refresh token

module.exports = router;