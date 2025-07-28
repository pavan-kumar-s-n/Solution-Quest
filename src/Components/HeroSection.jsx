export default function HeroSection({ onPostClick }) {
  return (
    <section id="hero" style={styles.hero}>
      <div style={styles.contentWrapper}>
        <h1 style={styles.heading}>
          <span style={styles.emoji}>🚀</span> Ask | Share | Grow | Connect <span style={styles.emoji}>🎓</span>
        </h1>
        <p style={styles.subheading}>
          Where curiosity meets community.<br />
          Got a thought? A question? A breakthrough?<br />
          This is your space to speak, learn, and belong.
        </p>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    padding: '1rem 0.5rem',
    background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f0ff 100%)',
    textAlign: 'center',
    borderRadius: '16px',
    marginBottom: '2rem',
    border: '1px solid rgba(0, 119, 255, 0.1)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    position: 'relative'
  },
  contentWrapper: {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1a365d',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
    letterSpacing: '-0.5px'
  },
  emoji: {
    display: 'inline-block',
    animation: 'float 3s ease-in-out infinite',
    margin: '0 8px'
  },
  subheading: {
    fontSize: '1.25rem',
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '2rem',
    fontWeight: '400'
  },

  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0)'
    },
    '50%': {
      transform: 'translateY(-8px)'
    }
  }
};