var express = require("express");
var router = express.Router();
const utility = require("./utility");
const { loginAuth, adminAccessAuth, enggManagerAccess, officeManagerAccess, employeeAccess } = require("../middleware/auth");
const validator = require("../middleware/validator");

/* For HOD */
router.post("/addEmployee", validator.addEmployeeValidator, loginAuth, enggManagerAccess, utility.admins.addEmployee); // api to add new employee.
router.get("/removeEmployee/:id", validator.idValidator, loginAuth, adminAccessAuth, utility.admins.removeEmployee); //api to remove employee.
router.get("/fetchEmployeesList", loginAuth, employeeAccess, utility.admins.fetchEmployeesList); //api to fetch all employees.
router.post("/updateProfile", validator.updateProfileValidator, loginAuth, enggManagerAccess, utility.admins.updateProfile); //api to update employee profile.
router.get("/fetchEmployee/:id", validator.idValidator, loginAuth, enggManagerAccess, utility.admins.fetchEmployee); //fetch one employee.

module.exports = router;