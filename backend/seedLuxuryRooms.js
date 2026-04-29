const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');

dotenv.config();

const rooms = [
  {
    roomNumber: '101',
    roomType: 'Standard',
    price: 150,
    bedrooms: 1,
    sqm: 25,
    bedType: 'Queen Bed',
    guestCount: 2,
    description: 'Elevate your stay in our signature suites, where contemporary design meets timeless elegance.',
    features: ['Private balcony', 'Work desk'],
    facilities: ['High-speed Wi-Fi', 'In-room safe'],
    amenities: ['Complimentary bottled water'],
    images: ['/assets/room_standard.png'],
    status: 'available'
  },
  {
    roomNumber: '202',
    roomType: 'Deluxe',
    price: 250,
    bedrooms: 1,
    sqm: 35,
    bedType: 'King Bed',
    guestCount: 2,
    description: 'Our Deluxe rooms offer a blend of comfort and sophistication. Featuring floor-to-ceiling windows.',
    features: ['Panoramic city view', 'Marble bathroom'],
    facilities: ['High-speed Wi-Fi', 'Personal safe'],
    amenities: ['Artisanal bath salts'],
    images: ['/assets/room_deluxe.png'],
    status: 'available'
  },
  {
    roomNumber: '303',
    roomType: 'Suite',
    price: 450,
    bedrooms: 2,
    sqm: 60,
    bedType: 'King Bed',
    guestCount: 4,
    description: 'The pinnacle of luxury living. Our Presidential Suites provide an expansive environment.',
    features: ['Grand living room', 'Dining area'],
    facilities: ['Butler service', 'Private bar'],
    amenities: ['Champagne arrival'],
    images: ['/assets/room_suite.png'],
    status: 'available'
  },
  {
    roomNumber: '404',
    roomType: 'Family',
    price: 350,
    bedrooms: 2,
    sqm: 50,
    bedType: '2 Queen Beds',
    guestCount: 4,
    description: 'Perfect for families, this room offers ample space and comfort for everyone.',
    features: ['Connecting doors', 'City view'],
    facilities: ['Wi-Fi', 'Kitchenette'],
    amenities: ['Family bundle'],
    images: ['/assets/room_standard.png'],
    status: 'available'
  },
  {
    roomNumber: '505',
    roomType: 'Penthouse',
    price: 850,
    bedrooms: 3,
    sqm: 120,
    bedType: 'King Beds',
    guestCount: 6,
    description: 'The ultimate luxury experience with panoramic views and exclusive services.',
    features: ['Private terrace', 'Hot tub'],
    facilities: ['Full kitchen', 'Private elevator'],
    amenities: ['VVIP treatment'],
    images: ['/assets/room_penthouse.png'],
    status: 'available'
  },
  {
    roomNumber: '102',
    roomType: 'Standard',
    price: 155,
    bedrooms: 1,
    sqm: 26,
    bedType: 'Queen Bed',
    guestCount: 2,
    description: 'Comfortable and elegant standard room for business or leisure.',
    features: ['Courtyard view'],
    facilities: ['Wi-Fi', 'Smart TV'],
    amenities: ['Tea/Coffee'],
    images: ['/assets/room_standard.png'],
    status: 'available'
  },
  {
    roomNumber: '203',
    roomType: 'Deluxe',
    price: 265,
    bedrooms: 1,
    sqm: 38,
    bedType: 'King Bed',
    guestCount: 2,
    description: 'Upgraded deluxe room with premium features and more space.',
    features: ['High floor'],
    facilities: ['Nespresso', 'Safe'],
    amenities: ['Bathrobe'],
    images: ['/assets/room_deluxe.png'],
    status: 'available'
  },
  {
    roomNumber: '304',
    roomType: 'Suite',
    price: 480,
    bedrooms: 2,
    sqm: 65,
    bedType: 'King Bed',
    guestCount: 4,
    description: 'Executive suite with separate lounge and elegant decor.',
    features: ['Executive lounge access'],
    facilities: ['Minibar', 'Wi-Fi'],
    amenities: ['Fruit platter'],
    images: ['/assets/room_suite.png'],
    status: 'available'
  },
  {
    roomNumber: '103',
    roomType: 'Standard',
    price: 160,
    bedrooms: 1,
    sqm: 27,
    bedType: 'Double Bed',
    guestCount: 2,
    description: 'Modern standard room with all essential amenities.',
    features: ['Street view'],
    facilities: ['AC', 'Wi-Fi'],
    amenities: ['Toiletries'],
    images: ['/assets/room_standard.png'],
    status: 'available'
  },
  {
    roomNumber: '204',
    roomType: 'Deluxe',
    price: 275,
    bedrooms: 1,
    sqm: 40,
    bedType: 'King Bed',
    guestCount: 2,
    description: 'Sophisticated deluxe room with a touch of luxury.',
    features: ['Art decor'],
    facilities: ['Smart TV', 'Wi-Fi'],
    amenities: ['Premium towels'],
    images: ['/assets/room_deluxe.png'],
    status: 'available'
  },
  {
    roomNumber: '305',
    roomType: 'Suite',
    price: 500,
    bedrooms: 2,
    sqm: 70,
    bedType: 'King Bed',
    guestCount: 4,
    description: 'Grand suite with breathtaking views and premium services.',
    features: ['Balcony'],
    facilities: ['Butler service'],
    amenities: ['Champagne'],
    images: ['/assets/room_suite.png'],
    status: 'available'
  },
  {
    roomNumber: '405',
    roomType: 'Family',
    price: 380,
    bedrooms: 2,
    sqm: 55,
    bedType: '2 Queen Beds',
    guestCount: 5,
    description: 'Spacious family room designed for a perfect group stay.',
    features: ['Play area'],
    facilities: ['Kitchenette', 'Wi-Fi'],
    amenities: ['Kids welcome kit'],
    images: ['/assets/room_standard.png'],
    status: 'available'
  }
];

const seedRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing rooms to avoid duplicates during this demo
    await Room.deleteMany({});
    
    await Room.insertMany(rooms);
    console.log('Luxury rooms seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding rooms:', error);
    process.exit(1);
  }
};

seedRooms();
