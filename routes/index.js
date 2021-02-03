var express = require("express");
var router = express.Router();
const validator = require("../middleware/validator");
const Employees = require("../models/employee");
const config = require("../config")
const jwt = require("jsonwebtoken");
const axios = require('axios');
const {
	check,
	validationResult
} = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.send("BlueStack Platform!");
});

// Sign In route for admin
router.post("/signIn", validator.signInValidator, async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}
	try {
		let employeeCount = await Employees.countDocuments({})
		if (employeeCount > 0) {
			// Redirect to login api
			const response = await axios.post(`http://localhost:${process.env.PORT || "5000"}/employees/signIn`, {
				email: req.body.email,
				password: req.body.password,
			})
			res.status(200).json({
				success: true,
				admin: response.data.admin,
				token: response.data.token,
				refreshToken: response.data.newRefreshToken
			});
		} else {
			const admin = new Employees({
				firstName: "administrator",
				lastName: "administrator",
				email: req.body.email,
				password: req.body.password,
				mobile: "0000000000",
				employeeId: "000",
				departments: "Admin",
				position: "Manager",
				ACL: {
					adminAccess: true
				}
			});
			const saveAdmin = await admin.save();
			const token = await saveAdmin.generateAuthToken();
			const newRefreshToken = await saveAdmin.generateRefreshToken();
			const updatedAdmin = await Employees.findByIdAndUpdate(saveAdmin._id, { refreshToken: newRefreshToken }, { new: true })
			res.status(200).send({
				success: true,
				message: "Successfully added admin!",
				admin: updatedAdmin.getPublicProfile(),
				token: token
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({
			error: "Internal server error"
		});
	}
});


module.exports = router;