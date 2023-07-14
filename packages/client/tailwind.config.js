/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    backgroundImage: {
      'welcome-image': "url('/assets/RPG_40_square_masterpiece_best_quality_ultradetailed_illustrat_0.jpg')",
      'action-section': "url('/assets/bg_actions.png')",
      'player-nav': "url('/assets/bg_nav.png')",
      'avatar-frame': "url('/assets/bg_avatarFrame.png')",
      'content-bg-gray': "url('/assets/background/bg_gray.jpg')",
      'main-bg-neutral': "url('/assets/background/main_bg_neutral.jpg')",
      'avatar-outer-frame': "url('/assets/avatar/frames/outer_frame.png')",
      'avatar-inner-frame': "url('/assets/avatar/frames/frame_bg.png')",
      'avatar-karma-gauge-evil': "url('/assets/avatar/frames/bg_karmaMeter_evil.svg')",
      'avatar-karma-gauge-good': "url('/assets/avatar/frames/bg_karmaMeter_good.svg')",
      'transparent-to-dark': 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(34, 46, 55, 1))',
      'gold-to-dark': 'linear-gradient(to right, rgba(193, 157, 93, 1), rgba(193, 157, 93, 0.2))',
      'header-gradient': 'linear-gradient(90deg, rgba(23, 19, 3, 1), rgba(41, 31, 11, 1))',
      "mainNeutral": "url('/assets/background/main_bg_neutral.jpg')",
      "mainGood": "url('/assets/background/main_bg_good.jpg')",
      "mainEvil": "url('/assets/background/main_bg_evil.jpg')",
      "btnNeutral": "url('/assets/background/btn_neutral.png')",
      "btnNeutralHover": "url('/assets/background/btn_neutral_hover.png')",
      "btnGood": "url('/assets/background/btn_good.png')",
      "btnGoodHover": "url('/assets/background/btn_good_hover.png')",
      "btnEvil": "url('/assets/background/btn_evil.png')",
      "btnEvilHover": "url('/assets/background/btn_evil_hover.png')",
      "modal": "url('/assets/background/bg_gray.jpg')",
      "lining": "url('/assets/minigame/bg_lining.svg')",
      "liningBig": "url('/assets/minigame/bg_lining_big.svg')",
      "noLining": "url('/assets/minigame/bg_lining_noFrames.svg')",
      "battleBtn": "url('/assets/minigame/bg_battleButton.svg')",
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
        'option-7': "hsl(var(--option-7))",
        'option-8': "hsl(var(--option-8))",
        'option-9': "hsl(var(--option-9))",
        'option-10': "hsl(var(--option-10))",
        'option-11': "hsl(var(--option-11))",
        'option-12': "hsl(var(--option-12))",
        'option-13': "hsl(var(--option-13))",
        'option-14': "hsl(var(--option-14))",
        dangerAccent: "hsl(var(--dangerAccent))",
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
        amiri: ['Amiri', 'sans-serif'],
        inkFree: ['Inkfree', 'sans-serif'],
        segoe: ['Segoe UI', 'sans-serif'],
        segoeBold: ['Segoe UI Bold', 'sans-serif']
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
        "custom-spin": {
          '0%, 25%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '50%, 75%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "custom-spin": "custom-spin 3s infinite"
      },
      spacing: {
        sm: '15px',
        md: '30px',
        lg: '60px'
      }
    },
  },
  plugins: [import("tailwindcss-animate"), import('tailwind-scrollbar')],
}
