/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#070A13',
        surface: {
          50: '#0F1629',
          100: '#131B32',
          200: '#18223F',
          300: '#1E2C52',
          card: 'rgba(19, 27, 50, 0.75)',
        },
        brand: {
          purple: '#8B5CF6',
          indigo: '#6366F1',
          blue: '#3B82F6',
          cyan: '#06B6D4',
          orange: '#F97316',
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'card-glow': 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), transparent 70%)',
        'accent-gradient': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon-blue': '0 0 20px -3px rgba(59, 130, 246, 0.4)',
        'neon-purple': '0 0 20px -3px rgba(139, 92, 246, 0.4)',
        'neon-orange': '0 0 20px -3px rgba(249, 115, 22, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};
