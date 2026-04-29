const ChatMessage = require('../models/ChatMessage');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const User = require('../models/User');

/**
 * @desc    Process chat message
 * @route   POST /api/chat
 * @access  Public (or Private if logged in)
 */
const processChat = async (req, res) => {
  const { message, userId, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  // Save user message
  await ChatMessage.create({ userId, sessionId, role: 'user', message });

  const lowerMessage = message.trim().toLowerCase();
  
  // Get chat history for context
  const queryObj = userId ? { userId } : { sessionId };
  const history = await ChatMessage.find(queryObj).sort({ createdAt: -1 }).limit(10);
  
  // Last bot message helps determine current state
  const lastBotMessage = history.find(m => m.role === 'bot');
  const context = lastBotMessage ? lastBotMessage.message : '';

  console.log(`[DEBUG] Message: "${lowerMessage}"`);
  console.log(`[DEBUG] Context: "${context}"`);

  let botResponse = '';

  // --- Multi-language Detection ---
  const langs = {
    es: ['hola', 'habitacion', 'reserva', 'si', 'confirmar', 'gracias'],
    fr: ['bonjour', 'chambre', 'reservation', 'oui', 'confirmer', 'merci'],
    ar: ['مرحبا', 'غرفة', 'حجز', 'نعم', 'تأكيد', 'شكرا'],
    en: ['hello', 'room', 'book', 'yes', 'confirm', 'thanks']
  };

  let detectedLang = 'en';
  for (const [lang, keywords] of Object.entries(langs)) {
    if (keywords.some(k => lowerMessage.includes(k))) {
      detectedLang = lang;
      break;
    }
  }

  const t = {
    en: {
      askCheckIn: 'I can help with your booking! 📅 What is your preferred check-in date? (YYYY-MM-DD)',
      askCheckOut: 'Great! Check-in on {date}. And when would you like to check out? (YYYY-MM-DD)',
      noRooms: 'I am sorry, but we have no rooms available for those dates. Would you like to try a different date range?',
      selectRoom: 'Excellent. For {checkIn} to {checkOut}, we have these rooms available. Which one would you like?',
      summary: 'Perfect choice! Here is your booking summary:\n\n• Room: {room}\n• Dates: {checkIn} to {checkOut}\n• Total Price: ${total}\n\nShall I confirm this booking for you?',
      confirmed: '✨ Congratulations! Your booking is confirmed. We look forward to seeing you!',
      loginRequired: 'You need to be logged in to confirm a booking. Please log in first!',
      askName: "We'd love your feedback! ⭐ First, may I know your name?",
      askRating: 'Thanks, {name}! How would you rate your stay (1-5)?',
      askComment: 'Got it! Any specific comments or suggestions?',
      feedbackThanks: 'Thank you for your feedback! 🌟 We appreciate it.',
      welcome: 'Hello! 🏨 I am your LuxuryStay Assistant. How can I help you today?\n\nI can help you:\n• Book a room\n• Check facilities\n• View breakfast times\n• Leave feedback',
      fallback: "I'm not quite sure I got that. I can help with booking rooms, hotel facilities, or feedback. What would you like to do?"
    },
    es: {
      welcome: '¡Hola! 🏨 Soy su asistente de LuxuryStay. ¿Cómo puedo ayudarle hoy?',
      askCheckIn: '¡Puedo ayudarle! 📅 ¿Cuál es su fecha de entrada? (AAAA-MM-DD)',
      confirmed: '¡Felicidades! Su reserva está confirmada.'
    }
  };

  const getT = (key, params = {}) => {
    let str = t[detectedLang]?.[key] || t.en[key] || t.en.fallback;
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, v);
    });
    return str;
  };

  const roomImages = {
    'Standard': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80',
    'Deluxe': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80',
    'Suite': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
    'Family': 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=400&q=80',
    'Penthouse': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'
  };

  const datePattern = /(\d{4}-\d{2}-\d{2})/;
  const isAffirmative = lowerMessage.includes('yes') || lowerMessage.includes('confirm') || lowerMessage.includes('si') || lowerMessage.includes('oui') || lowerMessage.includes('ok');

  // --- STATE MACHINE ---

  // 1. Initial Booking Intent
  if (lowerMessage.includes('book') || lowerMessage.includes('reserva')) {
    botResponse = getT('askCheckIn');
  } 
  
  // 2. Handling Check-in Date
  else if (context.includes('check-in date') && datePattern.test(message)) {
    const checkIn = message.match(datePattern)[1];
    botResponse = getT('askCheckOut', { date: checkIn });
  }

  // 3. Handling Check-out Date -> Show Room Cards
  else if (context.includes('check out?') && datePattern.test(message)) {
    const checkOut = message.match(datePattern)[1];
    const checkInMatch = context.match(/on (\d{4}-\d{2}-\d{2})/);
    const checkIn = checkInMatch ? checkInMatch[1] : 'selected dates';

    const availableRooms = await Room.find({ status: 'available' }).limit(4);
    
    if (availableRooms.length > 0) {
      const cards = availableRooms.map(r => ({
        type: 'card',
        title: `${r.roomType} Room ${r.roomNumber}`,
        image: roomImages[r.roomType] || roomImages.Standard,
        price: r.price,
        id: r.roomNumber
      }));
      
      botResponse = JSON.stringify({
        text: getT('selectRoom', { checkIn, checkOut }),
        cards: cards
      });
    } else {
      botResponse = getT('noRooms');
    }
  }

  // 4. Room Selection
  else if (context.includes('Which one would you like') && /\d+/.test(message)) {
    const roomNum = message.match(/\d+/)[0];
    const room = await Room.findOne({ roomNumber: roomNum });

    if (room) {
      // Find dates from history
      const checkOutBotMsg = history.find(m => m.role === 'bot' && m.message.includes('check-out date'));
      const checkInDate = checkOutBotMsg ? (checkOutBotMsg.message.match(/on (\d{4}-\d{2}-\d{2})/) || [])[1] : '...';
      const userDateMsgs = history.filter(m => m.role === 'user' && datePattern.test(m.message));
      const checkOutDate = userDateMsgs.length > 0 ? userDateMsgs[0].message.match(datePattern)[1] : '...';

      const nights = (checkInDate !== '...' && checkOutDate !== '...') 
        ? Math.max(1, Math.round((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)))
        : 1;
      const total = room.price * nights;

      botResponse = getT('summary', { room: room.roomNumber, checkIn: checkInDate, checkOut: checkOutDate, total });
    } else {
      botResponse = `Room ${roomNum} not found. Please select from the list.`;
    }
  }

  // 5. Booking Confirmation
  else if (context.includes('Shall I confirm') && isAffirmative) {
    const summaryMsg = history.find(m => m.role === 'bot' && m.message.includes('booking summary'));
    
    if (summaryMsg && userId) {
      const roomNumMatch = summaryMsg.message.match(/Room: (\w+)/);
      const datesMatch = summaryMsg.message.match(/Dates: ([\d-]+) to ([\d-]+)/);
      const totalMatch = summaryMsg.message.match(/Total Price: \$(\d+)/);
      
      if (roomNumMatch && datesMatch && totalMatch) {
         const room = await Room.findOne({ roomNumber: roomNumMatch[1] });
         if (room) {
           await Booking.create({
             guestId: userId,
             roomId: room._id,
             checkInDate: new Date(datesMatch[1]),
             checkOutDate: new Date(datesMatch[2]),
             totalPrice: parseInt(totalMatch[1]),
             bookingStatus: 'confirmed'
           });
           room.status = 'occupied';
           await room.save();
           botResponse = getT('confirmed');
         }
      }
    } else if (!userId) {
      botResponse = getT('loginRequired');
    }
  }

  // 6. Feedback Flow
  else if (lowerMessage.includes('feedback')) {
    botResponse = getT('askName');
  } else if (context.includes('may I know your name')) {
    botResponse = getT('askRating', { name: message.trim() });
  } else if (context.includes('rate your stay') && /[1-5]/.test(message)) {
    botResponse = getT('askComment');
  } else if (context.includes('comments or suggestions')) {
    // Save review
    const ratingMsg = history.find(m => m.role === 'user' && /^[1-5]$/.test(m.message.trim()));
    const nameBotMsg = history.find(m => m.role === 'bot' && m.message.includes('rate your stay'));
    const guestName = nameBotMsg ? (nameBotMsg.message.match(/Thanks, (\w+)!/) || [])[1] : 'Guest';
    const rating = ratingMsg ? parseInt(ratingMsg.message) : 5;

    await Review.create({ guestName, rating, message });
    botResponse = getT('feedbackThanks');
  }

  // 7. Expanded FAQs
  else if (lowerMessage.includes('facilit') || lowerMessage.includes('amenities')) {
    botResponse = "🏨 **Our Facilities:**\n• 🏊 Infinity Pool (6th floor, 6AM-10PM)\n• 🏋️ 24/7 Gym (2nd floor)\n• 💆 Luxury Spa (3rd floor)\n• 🍽️ Grand Hall Restaurant (Ground floor)\n• 🚗 Valet Parking";
  } else if (lowerMessage.includes('breakfast')) {
    botResponse = "☕ **Breakfast Info:** Served daily 7:00 AM – 10:30 AM at 'The Grand Hall'. We offer a full continental buffet and local specialties.";
  } else if (lowerMessage.includes('wifi') || lowerMessage.includes('internet')) {
    botResponse = "📶 **Wi-Fi:** High-speed internet is free for all guests. Connect to 'LuxuryStay_Guest' (no password required).";
  } else if (lowerMessage.includes('check-in') || lowerMessage.includes('checkin')) {
    botResponse = "🕒 **Check-in:** Standard time is 2:00 PM. Early check-in is subject to availability.";
  } else if (lowerMessage.includes('check-out') || lowerMessage.includes('checkout')) {
    botResponse = "🕒 **Check-out:** Standard time is 11:00 AM. Please contact the front desk for late check-out requests.";
  } else if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
    botResponse = "📍 We are located in the heart of the city at 123 Luxury Way. Close to the financial district and major tourist attractions!";
  } else if (lowerMessage.includes('pool')) {
    botResponse = "🏊 Our infinity pool is on the 6th floor with amazing city views! Open 6:00 AM to 10:00 PM.";
  }

  // 8. Greetings & Fallback
  else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    botResponse = getT('welcome');
  } else if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
    botResponse = "You're very welcome! 😊 Is there anything else I can help you with?";
  } else {
    botResponse = getT('fallback');
  }

  // Final validation and save bot message
  if (!botResponse) botResponse = getT('fallback');
  const botMsg = await ChatMessage.create({ userId, sessionId, role: 'bot', message: botResponse });
  res.status(200).json(botMsg);
};

const getChatHistory = async (req, res) => {
  const { userId, sessionId } = req.query;
  let query = {};
  if (userId) query = { userId };
  else if (sessionId) query = { sessionId };
  else return res.status(200).json([]);

  const history = await ChatMessage.find(query).sort({ createdAt: 1 });
  res.status(200).json(history);
};

module.exports = { processChat, getChatHistory };
