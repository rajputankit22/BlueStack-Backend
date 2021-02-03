const Rooms = require("../../../models/room");
const { check, validationResult } = require("express-validator");

/* Add new Room */
module.exports.createRoom = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  try {
    const room = new Rooms({
      roomName: req.body.roomName,
      email: req.body.email,
      roomId: req.body.roomId,
      status: req.body.status,
      sitting: req.body.sitting,
    });
    const savedRoom = await room.save();
    res.status(200).send({
      success: true,
      message: "Successfully added room!",
      room: savedRoom
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Room already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

/* Update Room */
module.exports.updateRoom = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }
  try {
    const findRoom = await Rooms.findById(req.body._id);

    findRoom.roomName = req.body.roomName;
    findRoom.email = req.body.email;
    findRoom.status = req.body.status;
    findRoom.sitting = req.body.sitting;

    const saveRoom = await findRoom.save();
    res.status(200).json({
      success: true,
      room: saveRoom
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Room already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

/* Fetch room */
module.exports.fetchRoom = async (req, res, next) => {
  try {
    const room = await Rooms.findById({ _id: req.params.id }, { createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      room: room
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Remove any room */
module.exports.removeRoom = async (req, res, next) => {
  try {
    const deletedRoom = await Rooms.deleteOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      message: "Successfully deleted!",
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch all rooms list */
module.exports.fetchRoomsList = async (req, res, next) => {
  try {
    const rooms = await Rooms.find({}, { createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      rooms: rooms
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};