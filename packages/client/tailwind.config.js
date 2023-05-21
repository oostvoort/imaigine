/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    backgroundImage: {
      'welcome-image': "url('./assets/RPG_40_square_masterpiece_best_quality_ultradetailed_illustrat_0.jpg')",
      'action-section': "url('./assets/bg_actions.png')",
      'player-nav': "url('./assets/bg_nav.png')",
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        'option-1': "hsl(var(--option-1))",
        'option-2': "hsl(var(--option-2))",
        'option-3': "hsl(var(--option-3))",
        'option-4': "hsl(var(--option-4))",
        'option-5': "hsl(var(--option-5))",
        'option-6': "hsl(var(--option-6))",
        night: "hsl(var(--night))",
        'conversation-receiver': {
          DEFAULT: "hsl(var(--conversation-receiver))",
          foreground: "hsl(var(--conversation-receiver-foreground))"
        },
        'conversation-sender': {
          DEFAULT: "hsl(var(--conversation-sender))",
          foreground: "hsl(var(--conversation-sender-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        'accent-2': {
          DEFAULT: "hsl(var(--accent-2))",
          foreground: "hsl(var(--accent-2-foreground))",
        },
        'accent-3': {
          DEFAULT: "hsl(var(--accent-3))",
          foreground: "hsl(var(--accent-3-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
        rancho: ['Rancho', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [import("tailwindcss-animate")],
}
