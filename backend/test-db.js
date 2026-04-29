const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const testConnection = async () => {
    try {
        console.log('Attempting to connect to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connection test successful!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection test failed:', err.message);
        process.exit(1);
    }
};

testConnection();
