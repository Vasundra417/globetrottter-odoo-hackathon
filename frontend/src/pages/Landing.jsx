import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 1,
      icon: '✈️',
      title: 'Multi-City Itineraries',
      description: 'Add multiple stops and plan your entire journey effortlessly'
    },
    {
      id: 2,
      icon: '💰',
      title: 'Smart Budgeting',
      description: 'Track expenses and visualize cost breakdowns by category'
    },
    {
      id: 3,
      icon: '📅',
      title: 'Timeline View',
      description: 'See your entire trip at a glance with calendar and timeline'
    },
    {
      id: 4,
      icon: '👥',
      title: 'Share Plans',
      description: 'Share your trips with friends and family instantly'
    },
    {
      id: 5,
      icon: '🎯',
      title: 'Activity Discovery',
      description: 'Find and add activities, restaurants, and attractions'
    },
    {
      id: 6,
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Get detailed analytics about your travel spending and patterns'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Travelers' },
    { number: '150+', label: 'Countries' },
    { number: '500K+', label: 'Trips Planned' }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      quote: 'GlobeTrotter made planning my 3-week Europe trip so easy!',
      avatar: '👩‍🦰'
    },
    {
      id: 2,
      name: 'Mark Chen',
      location: 'Singapore',
      quote: 'Best travel planning app. Saved me so much money on budgeting.',
      avatar: '👨‍💼'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      location: 'Mexico City, Mexico',
      quote: 'Love sharing my travel plans with friends. So convenient!',
      avatar: '👩‍🎤'
    }
  ];

  return (
    <div style={styles.pageContainer}>
      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.navLogo}>
            <span style={styles.globe}>🌍</span>
            <span>GlobeTrotter</span>
          </div>
          <div style={styles.navLinks}>
            <button onClick={() => navigate('/login')} style={styles.navLink}>
              Sign In
            </button>
            <button onClick={() => navigate('/signup')} style={styles.navSignUp}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Your Perfect Trip
            <br />
            <span style={styles.gradient}>Starts Here</span>
          </h1>
          
          <p style={styles.heroSubtitle}>
            Plan, budget, and share your travel adventures with ease.
            <br />
            All-in-one platform for modern travelers.
          </p>

          <div style={styles.heroButtons}>
            <button
              onClick={() => navigate('/signup')}
              style={styles.primaryButton}
            >
              Start Planning → 
            </button>
            <button
              onClick={() => navigate('/login')}
              style={styles.secondaryButton}
            >
              Sign In
            </button>
          </div>

          {/* Quick Stats */}
          <div style={styles.statsBar}>
            {stats.map((stat) => (
              <div key={stat.label} style={styles.statItem}>
                <div style={styles.statNumber}>{stat.number}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Illustration */}
        <div style={styles.heroIllustration}>
          <div style={styles.illustrationBox}>
            🗺️ 📍 ✈️ 🏖️ 🎒
            <br />
            🏨 🍽️ 📸 🗼 🌴
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Powerful Features</h2>
          <p style={styles.sectionDescription}>
            Everything you need to plan the perfect trip
          </p>
        </div>

        <div style={styles.featuresGrid}>
          {features.map((feature) => (
            <div
              key={feature.id}
              style={{
                ...styles.featureCard,
                transform: hoveredCard === feature.id ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hoveredCard === feature.id 
                  ? '0 20px 40px rgba(102, 126, 234, 0.3)'
                  : '0 10px 25px rgba(0, 0, 0, 0.08)'
              }}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
              <div style={styles.featureArrow}>→</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={styles.howItWorks}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionDescription}>
            Get started in 3 simple steps
          </p>
        </div>

        <div style={styles.stepsContainer}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <h3 style={styles.stepTitle}>Create Your Trip</h3>
            <p style={styles.stepDescription}>
              Set your destination, dates, and budget
            </p>
          </div>

          <div style={styles.stepArrow}>→</div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <h3 style={styles.stepTitle}>Plan Activities</h3>
            <p style={styles.stepDescription}>
              Add cities, activities, and organize your itinerary
            </p>
          </div>

          <div style={styles.stepArrow}>→</div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <h3 style={styles.stepTitle}>Share & Explore</h3>
            <p style={styles.stepDescription}>
              Share with friends and track your budget
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={styles.testimonials}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>What Travelers Say</h2>
          <p style={styles.sectionDescription}>
            Join thousands of happy travelers
          </p>
        </div>

        <div style={styles.testimonialGrid}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} style={styles.testimonialCard}>
              <div style={styles.testimonialStars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.testimonialQuote}>"{testimonial.quote}"</p>
              <div style={styles.testimonialAuthor}>
                <span style={styles.testimonialAvatar}>{testimonial.avatar}</span>
                <div>
                  <div style={styles.authorName}>{testimonial.name}</div>
                  <div style={styles.authorLocation}>{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Benefits Section */}
      <section style={styles.benefits}>
        <div style={styles.benefitsContent}>
          <h2 style={styles.benefitsTitle}>Why Choose GlobeTrotter?</h2>
          
          <div style={styles.benefitsList}>
            <div style={styles.benefitItem}>
              <span style={styles.benefitIcon}>✓</span>
              <div>
                <h4 style={styles.benefitItemTitle}>Free & Easy to Use</h4>
                <p style={styles.benefitItemDesc}>No credit card required to start planning</p>
              </div>
            </div>

            <div style={styles.benefitItem}>
              <span style={styles.benefitIcon}>✓</span>
              <div>
                <h4 style={styles.benefitItemTitle}>Real-Time Budgeting</h4>
                <p style={styles.benefitItemDesc}>Track expenses and stay within your budget</p>
              </div>
            </div>

            <div style={styles.benefitItem}>
              <span style={styles.benefitIcon}>✓</span>
              <div>
                <h4 style={styles.benefitItemTitle}>Instant Sharing</h4>
                <p style={styles.benefitItemDesc}>Share plans with friends via unique links</p>
              </div>
            </div>

            <div style={styles.benefitItem}>
              <span style={styles.benefitIcon}>✓</span>
              <div>
                <h4 style={styles.benefitItemTitle}>Smart Analytics</h4>
                <p style={styles.benefitItemDesc}>Get insights about your travel patterns</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Start Your Adventure?</h2>
        <p style={styles.ctaSubtitle}>
          Join thousands of travelers planning their perfect trips
        </p>
        
        <div style={styles.ctaButtons}>
          <button
            onClick={() => navigate('/signup')}
            style={styles.ctaPrimaryButton}
          >
            Create Free Account
          </button>
          <button
            onClick={() => navigate('/login')}
            style={styles.ctaSecondaryButton}
          >
            Already have an account?
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>GlobeTrotter</h4>
            <p style={styles.footerText}>Empowering personalized travel planning</p>
          </div>

          <div style={styles.authButtons}>
  <button
    onClick={() => navigate('/login')}
    style={styles.userLoginBtn}
  >
    👤 User Login
  </button>
  
  <button
    onClick={() => navigate('/admin/login')}
    style={styles.adminLoginBtn}
  >
    🔐 Admin Login
  </button>
</div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Features</h4>
            <ul style={styles.footerList}>
              <li>Trip Planning</li>
              <li>Budget Tracking</li>
              <li>Activity Discovery</li>
              <li>Trip Sharing</li>
            </ul>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Company</h4>
            <ul style={styles.footerList}>
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p>© 2024 GlobeTrotter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  pageContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f8f9fa',
    color: '#333'
  },
  authButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',},

  userLoginBtn: {
    padding: '14px 32px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  adminLoginBtn: {
    padding: '14px 32px',
    backgroundColor: '#1e3a8a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // NAVBAR
  navbar: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navLogo: {
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#667eea'
  },
  globe: {
    fontSize: '28px'
  },
  navLinks: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'color 0.3s'
  },
  navSignUp: {
    padding: '10px 20px',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },

  // HERO SECTION
  hero: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 20px',
    gap: '40px',
    alignItems: 'center'
  },
  heroContent: {
    zIndex: 2
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
    lineHeight: '1.2',
    color: '#1a1a1a'
  },
  gradient: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.6'
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    marginBottom: '40px',
    flexWrap: 'wrap'
  },
  primaryButton: {
    padding: '14px 32px',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s'
  },
  secondaryButton: {
    padding: '14px 32px',
    backgroundColor: 'transparent',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  statsBar: {
    display: 'flex',
    gap: '40px',
    paddingTop: '20px'
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#667eea'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginTop: '4px'
  },
  heroIllustration: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  illustrationBox: {
    fontSize: '48px',
    lineHeight: '1.8',
    textAlign: 'center',
    animation: 'float 3s ease-in-out infinite'
  },

  // FEATURES SECTION
  featuresSection: {
    maxWidth: '1200px',
    margin: '80px auto',
    padding: '0 20px'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px'
  },
  sectionTitle: {
    fontSize: '42px',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
    color: '#1a1a1a'
  },
  sectionDescription: {
    fontSize: '18px',
    color: '#666',
    margin: 0
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: '32px 24px',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative'
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'block'
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 12px 0',
    color: '#1a1a1a'
  },
  featureDescription: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 16px 0',
    lineHeight: '1.6'
  },
  featureArrow: {
    fontSize: '20px',
    color: '#667eea',
    fontWeight: 'bold'
  },

  // HOW IT WORKS
  howItWorks: {
    backgroundColor: '#f8f9fa',
    padding: '80px 20px',
    marginTop: '40px'
  },
  stepsContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap'
  },
  step: {
    flex: '1',
    minWidth: '250px',
    textAlign: 'center'
  },
  stepNumber: {
    width: '60px',
    height: '60px',
    backgroundColor: '#667eea',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 auto 16px'
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 12px 0'
  },
  stepDescription: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  stepArrow: {
    fontSize: '32px',
    color: '#667eea'
  },

  // TESTIMONIALS
  testimonials: {
    maxWidth: '1200px',
    margin: '80px auto',
    padding: '0 20px'
  },
  testimonialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  testimonialCard: {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
  },
  testimonialStars: {
    marginBottom: '16px'
  },
  testimonialQuote: {
    fontSize: '16px',
    color: '#333',
    fontStyle: 'italic',
    margin: '0 0 20px 0',
    lineHeight: '1.6'
  },
  testimonialAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  testimonialAvatar: {
    fontSize: '40px'
  },
  authorName: {
    fontWeight: '600',
    color: '#1a1a1a'
  },
  authorLocation: {
    fontSize: '12px',
    color: '#999'
  },

  // BENEFITS
  benefits: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '80px 20px',
    marginTop: '80px'
  },
  benefitsContent: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  benefitsTitle: {
    fontSize: '42px',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '60px',
    margin: 0
  },
  benefitsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px'
  },
  benefitItem: {
    display: 'flex',
    gap: '16px',
    color: '#fff'
  },
  benefitIcon: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff'
  },
  benefitItemTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0'
  },
  benefitItemDesc: {
    fontSize: '14px',
    margin: 0,
    opacity: 0.9
  },

  // CTA SECTION
  ctaSection: {
    maxWidth: '1000px',
    margin: '80px auto',
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.2)'
  },
  ctaTitle: {
    fontSize: '42px',
    fontWeight: 'bold',
    margin: '0 0 16px 0'
  },
  ctaSubtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '40px',
    margin: '0 0 40px 0'
  },
  ctaButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  ctaPrimaryButton: {
    padding: '16px 40px',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  ctaSecondaryButton: {
    padding: '16px 40px',
    backgroundColor: '#f0f0f0',
    color: '#667eea',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  // FOOTER
  footer: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: '60px 20px 20px',
    marginTop: '80px'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px'
  },
  footerSection: {
  },
  footerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    margin: '0 0 12px 0'
  },
  footerText: {
    fontSize: '14px',
    opacity: 0.8,
    margin: 0
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  footerBottom: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    opacity: 0.6,
    fontSize: '14px'
  }
};