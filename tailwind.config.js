module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          background: "var(--primary-background)",
          foreground: "var(--primary-foreground)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
        },
        secondary: {
          background: "var(--secondary-background)",
          foreground: "var(--secondary-foreground)",
          light: "var(--secondary-light)",
          dark: "var(--secondary-dark)",
        },
        accent: {
          DEFAULT: "var(--accent-color)",
          foreground: "var(--accent-foreground)",
          light: "var(--accent-light)",
          dark: "var(--accent-dark)",
        },
        border: {
          primary: "var(--border-primary)",
          secondary: "var(--border-secondary)",
          light: "var(--border-light)",
          dark: "var(--border-dark)",
        },
        blue: {
          500: '#008dd2',
          600: '#007bb8',
          700: '#006ba3',
        },
        gray: {
          100: '#f3f3f3',
          200: '#e5e5e5',
          300: '#d9d9d9',
          400: '#ababab',
          500: '#999999',
          600: '#666666',
          700: '#4b5563',
          800: '#374151',
          900: '#11181c',
        },
        slate: {
          800: '#0d2642',
        },
        yellow: {
          500: '#fbba14',
        },
        green: {
          500: '#22c55e',
        },
      },
      fontFamily: {
        manrope: ['var(--font-manrope)', 'sans-serif'],
        ibmplex: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      spacing: {
        '25': '100px',
        '30': '120px',
      },
      lineHeight: {
        '11': '44px',
      },
      backdropBlur: {
        'sm': '4px',
      },
    },
  },
  plugins: [],
};
