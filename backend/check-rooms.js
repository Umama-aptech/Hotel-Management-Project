const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');

dotenv.config();

const checkRooms = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Room.countDocuments();
        console.log(`CURRENT_ROOM_COUNT:${count}`);
        const rooms = await Room.find().limit(5);
        console.log('SAMPLE_ROOMS:', JSON.stringify(rooms, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkRooms();
