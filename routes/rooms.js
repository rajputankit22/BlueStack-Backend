var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");
const { loginAuth, adminAccessAuth, enggManagerAccess, officeManagerAccess, employeeAccess } = require("../middleware/auth");

/* Rooms Related Routes */
router.post("/createRoom", validator.createRoomValidator, loginAuth, officeManagerAccess, utility.rooms.createRoom); // api to add new room.
router.get("/removeRoom/:id", validator.idValidator, loginAuth, adminAccessAuth, utility.rooms.removeRoom); //api to remove room.
router.get("/fetchRoomsList", loginAuth, employeeAccess, utility.rooms.fetchRoomsList); //api to fetch all rooms.
router.post("/updateRoom", validator.updateRoomValidator, loginAuth, officeManagerAccess, utility.rooms.updateRoom); //api to update room.
router.get("/fetchRoom/:id", validator.idValidator, loginAuth, officeManagerAccess, utility.rooms.fetchRoom); //fetch one employee.

module.exports = router;