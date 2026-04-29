const baseUrl = 'http://localhost:5001/api/chat';
const sessionId = 'test_session_' + Math.random().toString(36).substr(2, 9);

async function testChat() {
  console.log('🚀 Starting Chatbot Verification Test...');
  console.log('Session ID:', sessionId);

  try {
    const post = async (msg) => {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, sessionId })
      });
      return await response.json();
    };

    // 1. Test Greeting
    console.log('\n--- Test 1: Greeting ---');
    const res1 = await post('hello');
    console.log('Bot:', res1.message);

    // 2. Test FAQ - Breakfast
    console.log('\n--- Test 2: FAQ (Breakfast) ---');
    const res2 = await post('what time is breakfast?');
    console.log('Bot:', res2.message);

    // 3. Test Booking Flow - Step 1: Intent
    console.log('\n--- Test 3: Booking Flow (Start) ---');
    const res3 = await post('i want to book a room');
    console.log('Bot:', res3.message);

    // 4. Test Booking Flow - Step 2: Check-in Date
    console.log('\n--- Test 4: Booking Flow (Check-in) ---');
    const res4 = await post('2026-05-20');
    console.log('Bot:', res4.message);

    // 5. Test Booking Flow - Step 3: Check-out Date
    console.log('\n--- Test 5: Booking Flow (Check-out) ---');
    const res5 = await post('2026-05-25');
    console.log('Bot:', typeof res5.message === 'string' ? res5.message : JSON.stringify(res5.message));

    // 6. Test Feedback Flow
    console.log('\n--- Test 6: Feedback Flow ---');
    const res6 = await post('feedback');
    console.log('Bot:', res6.message);

    console.log('\n✅ Verification Script Completed.');
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  }
}

testChat();
