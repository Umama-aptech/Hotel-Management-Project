import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    guests: '1'
  });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(searchParams).toString();
    navigate(`/explore-rooms?${query}`);
  };

  const facilities = [
    { icon: 'fas fa-wifi', title: 'Free Wi-Fi', desc: 'High-speed internet in all areas.' },
    { icon: 'fas fa-swimming-pool', title: 'Infinity Pool', desc: 'Rooftop pool with skyline view.' },
    { icon: 'fas fa-utensils', title: 'Fine Dining', desc: 'Award-winning restaurant.' },
    { icon: 'fas fa-dumbbell', title: 'Modern Gym', desc: 'State-of-the-art equipment.' },
    { icon: 'fas fa-spa', title: 'Elegance Spa', desc: 'Premium relaxation treatments.' },
    { icon: 'fas fa-concierge-bell', title: '24/7 Concierge', desc: 'Personalized guest service.' },
    { icon: 'fas fa-car', title: 'Valet Parking', desc: 'Secure and convenient valet service.' },
    { icon: 'fas fa-briefcase', title: 'Business Center', desc: 'Full-service workspace for guests.' },
    { icon: 'fas fa-child', title: 'Kids Club', desc: 'Fun activities for our younger guests.' },
    { icon: 'fas fa-car-side', title: 'Chauffeur Service', desc: 'Luxury transportation on demand.' }
  ];

  const testimonials = [
    {
      name: "John Doe",
      role: "Business Traveler",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The most incredible stay! The service was impeccable and the views from the room were breathtaking. Truly a 5-star experience."
    },
    {
      name: "Alice Smith",
      role: "Leisure Guest",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Absolute perfection. From the infinity pool to the morning breakfast, everything was top-notch. Can't wait to return!"
    },
    {
      name: "Michael Chen",
      role: "Luxury Enthusiast",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "LuxuryStay redefined my expectations of hospitality. The attention to detail in the suite design is simply unmatched."
    },
    {
      name: "Sophia Rodriguez",
      role: "Frequent Guest",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "I've stayed in luxury hotels worldwide, but the warmth and personalized service here make it my favorite destination."
    },
    {
      name: "James Wilson",
      role: "Global Voyager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The culinary experience at the Fine Dining restaurant was the highlight of my stay. Truly world-class flavors."
    },
    {
      name: "Emma Thompson",
      role: "Wellness Advocate",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The Spa treatments were rejuvenating beyond words. A perfect sanctuary for mind and body."
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Calculate translateX based on screen width would be ideal, 
  // but for simplicity we'll use a fixed percentage.
  // In a real app, we might use a hook to get window width.
  const getTranslateX = () => {
    const itemWidth = 100 / (window.innerWidth > 1400 ? 4 : window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1);
    return -(currentTestimonial * itemWidth);
  };

  return (
    <div className="home-container fade-up">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Experience <span>Pure Luxury</span></h1>
          <p>Discover a world of elegance, comfort, and personalized service.</p>
          
          <div className="search-bar-container">
            <form className="search-bar" onSubmit={handleSearch}>
              <div className="search-item">
                <label>Check In</label>
                <input 
                  type="date" 
                  value={searchParams.checkIn}
                  onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                  required
                />
              </div>
              <div className="search-item">
                <label>Check Out</label>
                <input 
                  type="date" 
                  value={searchParams.checkOut}
                  onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                  required
                />
              </div>
              <div className="search-item">
                <label>Guests</label>
                <select 
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
                >
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>Family</option>
                </select>
              </div>
              <button type="submit" className="search-btn">
                <i className="fas fa-search"></i> Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="facilities-section">
        <div className="section-header">
          <h2>World-Class <span>Facilities</span></h2>
          <p>Everything you need for a perfect stay.</p>
        </div>
        <div className="facilities-grid">
          {facilities.map((f, i) => (
            <div key={i} className="facility-card">
              <div className="facility-icon">
                <i className={f.icon}></i>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Rooms Promo */}
      <section className="rooms-promo">
        <div className="promo-content">
          <h2>Our Extraordinary <span>Suites</span></h2>
          <p>Each room is designed to provide an unparalleled experience of luxury and tranquility.</p>
          <Link to="/explore-rooms" className="explore-btn">Explore All Rooms</Link>
        </div>
        <div className="promo-image">
           <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80" alt="Luxury Suite" />
        </div>
      </section>

      {/* Exclusive Offers Section */}
      <section className="offers-section">
        <div className="section-header">
          <h2>Exclusive <span>Offers</span></h2>
          <p>Luxury experiences at exceptional value.</p>
        </div>
        <div className="offers-grid">
          <Link to="/explore-rooms?offer=wellness-spa" className="offer-card-wrapper">
            <div className="offer-card">
              <div className="offer-image">
                <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80" alt="Spa Offer" />
                <div className="offer-tag">Limited Time</div>
              </div>
              <div className="offer-info">
                <h3>Wellness & Spa Retreat</h3>
                <p>Book a suite for 3+ nights and get a complimentary 60-min spa treatment for two.</p>
                <span className="offer-link">View Details</span>
              </div>
            </div>
          </Link>
          <Link to="/explore-rooms?offer=gourmet-dining" className="offer-card-wrapper">
            <div className="offer-card">
              <div className="offer-image">
                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" alt="Dining Offer" />
                <div className="offer-tag">VIP Direct</div>
              </div>
              <div className="offer-info">
                <h3>Gourmet Dining Package</h3>
                <p>Enjoy a 5-course tasting menu at our signature restaurant included with your stay.</p>
                <span className="offer-link">View Details</span>
              </div>
            </div>
          </Link>
          <Link to="/explore-rooms?offer=early-bird" className="offer-card-wrapper">
            <div className="offer-card">
              <div className="offer-image">
                <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80" alt="Early Bird" />
                <div className="offer-tag">Save 20%</div>
              </div>
              <div className="offer-info">
                <h3>Early Bird Special</h3>
                <p>Plan your escape 30 days in advance and enjoy exclusive savings on our best rates.</p>
                <span className="offer-link">View Details</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="reviews-section">
        <div className="section-header">
          <h2>Guest <span>Experiences</span></h2>
        </div>
        
        <div className="testimonials-container">
          <button className="carousel-btn prev" onClick={prevTestimonial}>
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="testimonials-wrapper">
            <div 
              className="testimonials-track" 
              style={{ transform: `translateX(-${currentTestimonial * (100 / (window.innerWidth > 1400 ? 4 : window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1))}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-slide">
                  <div className="review-card">
                    <div className="reviewer">
                      <div className="reviewer-img-container">
                        <img src={t.image} alt={t.name} className="reviewer-dp" />
                      </div>
                      <div className="reviewer-info">
                        <h4>{t.name}</h4>
                        <span className="reviewer-role">{t.role}</span>
                        <div className="rating">
                          {[...Array(t.rating)].map((_, idx) => (
                            <i key={idx} className="fas fa-star"></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p>"{t.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-btn next" onClick={nextTestimonial}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="carousel-dots">
          {testimonials.map((_, i) => (
            <span 
              key={i} 
              className={`dot ${i === currentTestimonial ? 'active' : ''}`}
              onClick={() => setCurrentTestimonial(i)}
            ></span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
