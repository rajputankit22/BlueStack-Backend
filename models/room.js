const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    roomName: {
      trim: true,
      type: String,
      required: [true, "Room name is required!"],
      validate(value) {
        if (value.length > 16) {
          throw new Error("Room name is invalid!");
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
    roomId: {
      trim: true,
      type: String,
      unique: [true, "Employee Id already available"],
      required: [true, "Employee Id is required"],
      validate(value) {
        console.log(value.length)
        if (value.length !== 5) {
          throw new Error("Employee Id is invalid!");
        }
      }
    },
    status: {
      trim: true,
      enum: ["Booked", "Available"],
      default: "Booked",
      type: String,
      required: [true, "Status is required"],
    },
    sitting: {
      trim: true,
      type: Number,
      require: [true, "Number is required"],
      validate(value) {
        if (value > 20) {
          throw new Error("Number of sitting less then 20!");
        }
      }
    },
  },
  {
    timestamps: true
  }
);

const Rooms = mongoose.model("Rooms", roomSchema);

module.exports = Rooms;
