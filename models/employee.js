const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config")
const cryptoRandomString = require("crypto-random-string");

const employeeSchema = new Schema(
  {
    firstName: {
      trim: true,
      type: String,
      required: [true, "firstName is required!"],
      validate(value) {
        if (value.length < 2) {
          throw new Error("firstName is invalid!");
        }
      }
    },
    lastName: {
      trim: true,
      type: String,
      required: [true, "lastName is required!"],
      validate(value) {
        if (value.length < 1) {
          throw new Error("lastName is invalid!");
        }
      }
    },
    email: {
      trim: true,
      type: String,
      unique: [true, "Email already registered"],
      required: [true, "Email is required"],
      validate(value) {
        if (value.length < 10) {
          throw new Error("Email is invalid!");
        }
      }
    },
    mobile: {
      trim: true,
      type: String,
      unique: [true, "Mobile Number already available"],
      required: [true, "Mobile Number is required"],
      validate(value) {
        if (value.length !== 10) {
          throw new Error("Mobile Number is invalid!");
        }
      }
    },
    employeeId: {
      trim: true,
      type: String,
      unique: [true, "Employee Id already available"],
      required: [true, "Employee Id is required"],
      validate(value) {
        console.log(value.length)
        if (value.length !== 3) {
          throw new Error("Employee Id is invalid!");
        }
      }
    },
    password: {
      trim: true,
      type: String,
      require: [true, "Password is required"],
      validate(value) {
        if (value.length < 6) {
          throw new Error("Password should be atleast 6 characters");
        }
      }
    },
    refreshToken: {
      trim: true,
      type: String,
    },
    position: {
      trim: true,
      enum: ["CEO", "CTO", "CFO", "VP", "Principal", "Director Engg", "Director QA", "Manager", "Designer", "Developer", "Lead Developer", "iSO Developer"],
      type: String,
      required: [true, "Department is required"],
    },
    departments: {
      trim: true,
      enum: ["Admin", "Management", "Android Team", "iSO Team", "QA", "Engg", "Product"],
      type: String,
      required: [true, "Department is required"],
    },
    ACL: {
      adminAccess: {
        type: Boolean,
        default: false
      },
      enggManagerAccess: {
        type: Boolean,
        default: false
      },
      officeManagerAccess: {
        type: Boolean,
        default: false
      },
      employeeAccess: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    timestamps: true
  }
);

// Profile without password
employeeSchema.methods.getPublicProfile = function () {
  const admin = this;
  const userObject = admin.toObject();
  delete userObject.password;
  delete userObject.token;
  return userObject;
};

// Generate jwt token
employeeSchema.methods.generateAuthToken = async function () {
  const admin = this;
  const randomNumber = Math.floor(Math.random() * 150 + 100);
  const randomString = cryptoRandomString({
    length: randomNumber,
    type: "base64"
  });
  const token = jwt.sign(
    {
      _id: admin._id.toString(),
      randomString
    },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "6h"
    }
  );
  return token;
};

// Generate Refreshjwt token
employeeSchema.methods.generateRefreshToken = async function () {
  const empolyee = this;
  const randomNumber = Math.floor(Math.random() * 150 + 100);
  const randomString = cryptoRandomString({
    length: randomNumber,
    type: "base64"
  });
  const token = jwt.sign(
    {
      _id: empolyee._id.toString(),
      randomString
    },
    config.REFRESH_TOKEN_SECRET,
  );
  return token;
};

employeeSchema.methods.comparePassword = async function (password) {
  const empolyee = this;
  const isMatch = await bcrypt.compare(password, empolyee.password);
  if (!isMatch) {
    return false;
  } else {
    return true;
  }
};

// Check password match
employeeSchema.statics.findByCredentials = async (email, password) => {
  const employee = await Employees.findOne({
    email: email
  });
  if (!employee) {
    throw new Error("Email is not registered!");
  }
  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) {
    throw new Error("Invalid password!");
  }
  return employee;
};

// Find admin user by _id
employeeSchema.statics.findAdminById = async _id => {
  const employee = await Employees.findById({
    _id: _id
  });
  if (!employee) {
    throw new Error("Admin user not found");
  }
  return employee;
};

// Hash the plain text password before saving
employeeSchema.pre("save", async function (next) {
  const employee = this;
  try {
    if (employee.isModified("password")) {
      employee.password = await bcrypt.hash(employee.password, 8);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Employees = mongoose.model("Employees", employeeSchema);

module.exports = Employees;
