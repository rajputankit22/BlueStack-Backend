const Employees = require("../../../models/employee");
const { check, validationResult } = require("express-validator");

/* Add new employee */
module.exports.addEmployee = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  try {
    const employee = new Employees({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      mobile: req.body.mobile,
      employeeId: req.body.employeeId,
      position: req.body.position,
      departments: req.body.departments,
      ACL: (req.body.ACL.adminAccess || req.body.ACL.enggManagerAccess || req.body.ACL.officeManagerAccess || req.body.ACL.employeeAccess) ? req.body.ACL : { adminAccess: false, enggManagerAccess: false, officeManagerAccess: false, employeeAccess: true }
    });
    const savedEmployee = await employee.save();
    res.status(200).send({
      success: true,
      message: "Successfully added employee!",
      admin: savedEmployee.getPublicProfile(),
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Employee already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

/* Update employee profile */
module.exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }
  try {
    const findEmployee = await Employees.findAdminById(req.body._id);
    findEmployee.firstName = req.body.firstName;
    findEmployee.lastName = req.body.lastName;
    findEmployee.email = req.body.email;
    findEmployee.mobile = req.body.mobile;
    // findEmployee.employeeId = req.body.employeeId;
    findEmployee.position = req.body.position;
    findEmployee.departments = req.body.departments;
    findEmployee.ACL = req.body.ACL;
    const saveAdmin = await findEmployee.save();
    res.status(200).json({
      success: true,
      admin: saveAdmin.getPublicProfile()
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "User already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

/* Fetch all employee */
module.exports.fetchEmployees = async (req, res, next) => {
  try {
    const employees = await Employees.find({}, { password: 0, createdAt: 0, updatedAt: 0, refreshToken: 0 });
    res.status(200).json({
      success: true,
      employees: employees
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch employee */
module.exports.fetchEmployee = async (req, res, next) => {
  try {
    const employee = await Employees.findById({ _id: req.params.id }, { password: 0, createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      employees: employee
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Remove any employee */
module.exports.removeEmployee = async (req, res, next) => {
  try {
    if (req.employee._id == req.params.id) {
      res.status(501).json({
        success: false,
        error: "You can't delete yourself!",
      });
    } else {
      const deletedEmployee = await Employees.deleteOne({ _id: req.params.id });
      res.status(200).json({
        success: true,
        message: "Successfully deleted!",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch all employee list */
module.exports.fetchEmployeesList = async (req, res, next) => {
  try {
    const employees = await Employees.find({}, { password: 0, createdAt: 0, updatedAt: 0, refreshToken: 0 });
    res.status(200).json({
      success: true,
      employees: employees
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};