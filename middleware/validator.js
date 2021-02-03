const {
    check,
    header,
    validationResult
} = require('express-validator');


module.exports.signInValidator = [
    check("email").isEmail().withMessage("Email is invalid!"),
    check("password").isLength({ min: 6 }).withMessage("Password is invalid!")
]

module.exports.addEmployeeValidator = [
    check("firstName").isAlpha().withMessage("First name is invalid!"),
    check("lastName").isAlpha().withMessage("Last name is invalid!"),
    check("email").isEmail().withMessage("Email is invalid!"),
    check("password").isLength({ min: 6 }).withMessage("Password is invalid!"),
    check("mobile").isMobilePhone().isLength({ min: 10, max: 10 }).withMessage("Mobile is invalid!"),
    check("employeeId").isLength({ min: 3, max: 3 }).withMessage("Employee Id is invalid!"),
    check("departments").isIn(["Admin", "Management", "Android Team", "iSO Team", "QA", "Engg", "Product"]).withMessage("Team is invalid!"),
    check("position").isIn(["CEO", "CTO", "CFO", "VP", "Principal", "Director Engg", "Director QA", "Manager", "Designer", "Developer", "Lead Developer", "iSO Developer"]).withMessage("Position is invalid!"),
    check("ACL").not().isEmpty().withMessage("ACL is invalid!")
]

module.exports.createRoomValidator = [
    check("roomName").not().isEmpty().withMessage("Room name shouldn't Empty!").isLength({ min: 1, max: 15 }).withMessage("Room name shouldn't greater then 15 Characters!"),
    check("email").not().isEmpty().withMessage("Email shouldn't Empty!").isEmail().withMessage("Email is invalid!"),
    check("roomId").not().isEmpty().withMessage("Room Id shouldn't Empty!").isLength({ min: 5, max: 5 }).withMessage("Room Id Should be 5 Characters!"),
    check("status").isIn(["Booked", "Available"]).withMessage("Status is invalid!"),
    check("sitting").isNumeric().withMessage("Sitting Limit should be numeric!").isInt({ gt: 0, lt: 21 }).withMessage("Sitting Limit should be less than 20!")
]

module.exports.updateRoomValidator = [
    check("_id").not().isEmpty().withMessage("Room Id shouldn't Empty!").isMongoId().withMessage("Room Id is inavlid!"),
    check("roomName").not().isEmpty().withMessage("Room name shouldn't Empty!").isLength({ min: 1, max: 15 }).withMessage("Room name shouldn't greater then 15 Characters!"),
    check("email").not().isEmpty().withMessage("Email shouldn't Empty!").isEmail().withMessage("Email is invalid!"),
    check("status").isIn(["Booked", "Available"]).withMessage("Status is invalid!"),
    check("sitting").isNumeric().withMessage("Sitting Limit should be numeric!").isInt({ gt: 0, lt: 21 }).withMessage("Sitting Limit should be less than 20!")
]

module.exports.updateProfileValidator = [
    check("_id").not().isEmpty().withMessage("Employee Id shouldn't Empty!").isMongoId().withMessage("Employee Id is inavlid!"),
    check("firstName").isAlpha().withMessage("First Name is invalid"),
    check("lastName").isAlpha().withMessage("Last Name is required"),
    check("email").isEmail().withMessage("Email is required"),
    check("mobile").notEmpty().withMessage("Mobile number is required"),
    check("departments").isIn(["Admin", "Management", "Android Team", "iSO Team", "QA", "Engg", "Product"]).withMessage("Team is invalid!"),
    check("position").isIn(["CEO", "CTO", "CFO", "VP", "Principal", "Director Engg", "Director QA", "Manager", "Designer", "Developer", "Lead Developer", "iSO Developer"]).withMessage("Position is invalid!"),
    check("ACL").not().isEmpty().withMessage("ACL is invalid!")
]


module.exports.idValidator = [
    check("id").not().isEmpty().withMessage("Id shouldn't Empty!").isMongoId().withMessage("Id is inavlid!"),

]

module.exports.jwtTokenValidator = [
    header("Authorization").isJWT().withMessage("Token is invalid!")
]