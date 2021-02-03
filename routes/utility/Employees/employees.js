const Employees = require("../../../models/employee");
const jwt = require("jsonwebtoken");
const config = require("../../../config")
const { check, validationResult } = require("express-validator");

/* SignIn */
module.exports.signIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  try {
    const findEmployee = await Employees.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await findEmployee.generateAuthToken();
    const newRefreshToken = await findEmployee.generateRefreshToken();
    let updatedEmployee = await Employees.findByIdAndUpdate(findEmployee._id, { refreshToken: newRefreshToken }, { new: true })
    res.status(200).json({
      success: true,
      admin: updatedEmployee.getPublicProfile(),
      token: token,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(401).send({
      error: error.message
    });
  }
};

/* load employee */
module.exports.loadEmployee = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      admin: req.employee,
      message: "Successfully loaded!"
    });
  } catch (error) {
    res.status(401).json({
      error: "Session Expired!"
    });
  }
};

/* SignOut */
module.exports.signOut = async (req, res, next) => {
  try {
    let updatedEmployee = await Employees.findByIdAndUpdate(req.employee._id, { $unset: { refreshToken: "" } }, { new: true })
    if (!updatedEmployee.refreshToken) {
      res.status(200).json({
        success: true,
        token: updatedEmployee,
        message: "Successfully signOut!"
      });
    } else {
      res.status(501).send({
        success: false,
        error: "Internal Server Error!"
      });
    }
  } catch (error) {
    res.status(401).json({
      error: "Session Expired!"
    });
  }
};

/* Get new auth token through refresh token */
module.exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("JWT ", "");
    const refreshToken = await Employees.findOne({
      refreshToken: token
    });
    if (!refreshToken) {
      throw new Error();
    }
    const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET, {
      algorithms: ["HS256"]
    });
    const employee = await Employees.findOne({
      _id: decoded._id
    });
    const newToken = await employee.generateAuthToken();
    if (!employee) {
      throw new Error();
    }
    res.status(200).send({
      success: true,
      token: newToken
    });
  } catch (error) {
    console.log(error)
    res.status(403).send({
      success: false,
      error: "Your session has expired!"
    });
  }
}