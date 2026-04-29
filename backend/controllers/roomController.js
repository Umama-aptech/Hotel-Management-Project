const Room = require('../models/Room');

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const { 
      roomNumber, roomType, price, bedrooms, 
      sqm, bedType, guestCount, description, 
      features, facilities, amenities, images 
    } = req.body;
    
    const roomExists = await Room.findOne({ roomNumber });
    
    if (roomExists) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    const room = new Room({ 
      roomNumber, roomType, price, bedrooms,
      sqm, bedType, guestCount, description,
      features, facilities, amenities, images
    });
    
    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRoomStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const room = await Room.findById(req.params.id);

    if (room) {
      room.status = status;
      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      room.roomNumber = req.body.roomNumber || room.roomNumber;
      room.roomType = req.body.roomType || room.roomType;
      room.price = req.body.price || room.price;
      room.bedrooms = req.body.bedrooms || room.bedrooms;
      room.status = req.body.status || room.status;
      room.sqm = req.body.sqm || room.sqm;
      room.bedType = req.body.bedType || room.bedType;
      room.guestCount = req.body.guestCount || room.guestCount;
      room.description = req.body.description || room.description;
      room.features = req.body.features || room.features;
      room.facilities = req.body.facilities || room.facilities;
      room.amenities = req.body.amenities || room.amenities;
      room.images = req.body.images || room.images;

      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRooms, getRoomById, createRoom, updateRoomStatus, updateRoom };
