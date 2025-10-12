/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      transitionTimingFunction: {
        'soft': 'cubic-bezier(.2,.6,.2,1)',
        'snappy': 'cubic-bezier(.25,.8,.25,1)',
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out 3',
        pulsedot: 'pulsedot 1.5s ease-in-out infinite',
      },
      backgroundImage: {
        'fallback': 'url(src/public/images/fallbacks/fallbackImage.svg)'
      },
      screens: {
        'xs': '375px',   // e.g., iPhone SE
        'sm': '640px',   // Tailwind's default
        'md': '768px',   // Tailwind's default
        'lg': '1024px',  // Tailwind's default
        'xl': '1280px',  // Tailwind's default
        '2xl': '1536px', // Tailwind's default
      },
      spacing: {
        '18': '72px',
        '22': '88px',
        '28': '7.3rem',
        '48': '12rem',
        '76': '310px',
        '88': '22rem',
        '168': '656px',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
      },
      width: {

      },
      minWidth: {
        '128': '32rem',
      },
      typography: {
        DEFAULT: {
          css: {
            ':focus': {
              outline: 'none',
              boxShadow: 'none',
            },
            h1: {
              color: '#ffffff',
              fontFamily: {
                serif: ["Open Sans", "sans-serif"]
              },
              fontWeight: {
                thin: '50'
              },
              fontSize: '24px'
            },
            h2: {
              color: '#ffffff',
              fontFamily: {
                serif: ["Open Sans", "sans-serif"]
              },
              fontWeight: {
                thin: '50'
              },
            }
          }
        }
      },
      height: {
        '380': '23.75rem'
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Open Sans", "sans-serif"],

      },
      fontWeight: {
        thin: '100'
      },
      backgroundImage: (theme) => ({
        // Blue Gradient
        gradientdown:
          "radial-gradient(140% 107.13% at 50% 10%,transparent 37.41%,#364ef580 69.27%,#6698ff 100%);",
        gradientup:
          "radial-gradient(131.66% 109.77% at 50% 97.75%, transparent 37.41%,#364ef580   69.27%,  #6698ff 100%);",
      }),
      animation: {
        marquee: "marquee 25s linear infinite",
        marquee2: "marquee2 25s linear infinite",
        scroller3: "scroller3 25s linear infinite",
        "spin-fast": "spin .3s linear infinite",
        "spin-slow": "spin 4s linear infinite",
        "spin-slower": "spin 6s linear infinite",
        "spin-reverse": "spin-reverse 1s linear infinite",
        "spin-reverse-slow": "spin-reverse 4s linear infinite",
        "spin-reverse-slower": "spin-reverse 6s linear infinite",
        scroller: "scroller 35s linear infinite",
        scroller2: "scroller2 25s linear infinite",
        "fade-in": "fade-in 0.5s linear forwards",
        "shimmer": "shimmer 3s infinite linear",
        "fade-up": "fadeUp 0.3s linear forwards",
        "fade-blur": "fadeBlur 0.5s linear forwards",
        "fade-skew": "fadeBlur 0.5s linear forwards",
        "fade-clip": "fadeBlur 0.5s linear forwards"
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeBlur: {
          '0%': { opacity: '0', filter: 'blur(6px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        fadeScale: {
          '0%': { opacity: '0', transform: 'scale(0.985)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeClip: {
          '0%': { opacity: '0', clipPath: 'inset(0 0 100% 0)' },
          '100%': { opacity: '1', clipPath: 'inset(0 0 0 0)' },
        },
        fadeSkew: {
          '0%': { opacity: '0', transform: 'translateY(8px) skewY(2deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) skewY(0)' },
        },
        fadeLong: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },

        pulsedot: {
          '0%': {
            transform: 'scale(0.8)',
            backgroundColor: '#b3d4fc',
            boxShadow: '0 0 0 0 rgba(178, 212, 252, 0.7)',
          },
          '50%': {
            transform: 'scale(1.2)',
            backgroundColor: '#6793fb',
            boxShadow: '0 0 0 10px rgba(178, 212, 252, 0)',
          },
          '100%': {
            transform: 'scale(0.8)',
            backgroundColor: '#b3d4fc',
            boxShadow: '0 0 0 0 rgba(178, 212, 252, 0.7)',
          },
        },
        shimmer: {
          '0%': { 'background-position': '-200% -200%' },
          '100%': { 'background-position': '200% 200%' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        marquee: {
          "0%": {
            transform: "translateX(0%)",
          },
          "100%": {
            transform: "translateX(-100%)",
          },
        },
        marquee2: {
          "0%": {
            transform: "translateX(100%)",
          },
          "100%": {
            transform: "translateX(0%)",
          },
        },
        scroller: {
          from: { transform: 'translate3d(0, var(--scroll-start, 10em), 0)' },
          to: { transform: 'translate3d(0, calc(var(--scroll-end, -20em)), 0)' },
        },
        scroller2: {
          from: { transform: 'translate3d(0, var(--scroll-start, 10em), 0)' },
          to: { transform: 'translate3d(0, calc(var(--scroll-end, -20em)), 0)' },
        },
        "fade-in": {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
        scroller3: {
          "100%": {
            transform: "translateY(-50%)",
          },
        },
        "spin-reverse": {
          to: {
            transform: "rotate(-360deg)",
          },
        },
      },
      boxShadow: {
        "drops": "rgba(0, 0, 0, 0.16) 0px 1px 4px;",
        'elev-1': `
      0 1px 0 0 rgba(255,255,255,0.06) inset, /* hairline */
      0 2px 8px rgba(0,0,0,0.35),              /* ambient */
      0 1px 2px rgba(0,0,0,0.5)                /* key */
    `,
        // hovered/active
        'elev-2': `
      0 1px 0 0 rgba(255,255,255,0.08) inset,
      0 6px 20px rgba(0,0,0,0.45),
      0 2px 6px rgba(0,0,0,0.6)
    `,
        "material": 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
        "material_2": "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;",
        "blue-top": "0 -10px 20px -2px rgba(59, 130, 246, 0.5), 0 -6px 12px -4px rgba(59, 130, 246, 0.5)",
        "blue-bottom": "0 4px 6px -1px rgba(59, 130, 246, 0.5), 0 6px 4px -2px rgba(59, 130, 246, 0.5)",
        thick: "0px 7px 32px rgb(0 0 0 / 35%);",
        inset:
          "inset 6px 84px 79px -40px hsla(0,0%,100%,.025), inset 0 -4px 1px -3px hsla(0,0%,100%,.25), inset 0 4px 1px -3px hsla(0,0%,100%,.25);",
      },
      colors: {

        outline: 'rgba(255,255,255,0.06)',
        button_gray: '#374151',
        gray_map: '#323B49',
        pearl: "#EDEADE",
        button_blue: '#2563eb',
        black: "#0f1014",
        astro_black: "linear-gradient(180deg, #13151A 0%, rgba(19, 21, 26, 0.88) 100%)",
        loader_black: "#0f101b",
        inner_loader_black: "#26272B",
        border_gray: "#343841",
        bone_white: "#F9F6EE",
        ebony: "#1a1c23",
        rich_black: '#010203',
        mirage: "#27292D",
        google_bg: "#1f1f1f",
        blue: {
          50: "#ECEEFE",
          100: "#D8DDFD",
          200: "#ACB7FB",
          300: "#8695F9",
          400: "#5F73F7",
          500: "#364EF5",
          600: "#0B28E4",
          700: "#081EAA",
          800: "#061470",
          900: "#030A3A",
          950: "#01051D",
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
        "6xl": "5rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar-hide"),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar')({ nocompatible: true, preferredStrategy: 'pseudoelements' }),
    function ({ addBase }) {
      addBase({
        ".ProseMirror": {
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          wordBreak: "break-all",
        },
      });
    },
    function ({ addUtilities }) {
      const newUtilities = {
        '.animation-paused': {
          'animation-play-state': 'paused',
        },
        '.animation-running': {
          'animation-play-state': 'running',
        },
        '.scroll-shadow': {
          position: 'relative',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          isolation: 'isolate',
        },
        '.scroll-shadow::before': {
          content: '""',
          top: 0, left: 0, right: 0,
          height: '16px',
          pointerEvents: 'none',
          zIndex: '50',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.30), transparent)',
        },
        '.scroll-shadow::after': {
          content: '""',
          bottom: 0, left: 0, right: 0,
          height: '16px',
          pointerEvents: 'none',
          zIndex: '50',
          background: 'linear-gradient(to top, rgba(255,255,255,0.30), transparent)',
        },
        /* Optional: pad content so shadows don't cover it */
        '.scroll-shadow-content': {
          paddingTop: '16px',
          paddingBottom: '16px',
        },
        '.animation-delay-200ms': {
          'animation-delay': '200ms'
        },
        '.animation-delay-300ms': {
          'animation-delay': '300ms'
        },
        '.no-scrollbar': {
          /* Hide scrollbar for Chrome, Safari, and Opera */
          '-webkit-overflow-scrolling': 'touch',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          /* Hide scrollbar for IE, Edge, and Firefox */
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-gutter': {
          'scrollbar-gutter': 'stable',
        },
        '.scrollbar-gutter-stable-both': {
          'scrollbar-gutter': 'stable both-edges',
        },
        '.show-scrollbar': {
          /* Re-enable scrollbar behavior */
          '-webkit-overflow-scrolling': 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '16px',
            // You can also set width, color, etc. here if desired
            display: 'initial',
          },
          /* Re-enable scrollbar for IE, Edge, and Firefox */
          '-ms-overflow-style': 'auto',
          'scrollbar-width': 'auto',
        },
        '.thin-gray-scrollbar': {
          // Enable smooth scrolling behavior if desired
          '-webkit-overflow-scrolling': 'auto',
          /* For Chrome, Safari and Opera */
          '&::-webkit-scrollbar': {
            width: '8px',  // sets the scrollbar width
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#a0aec0', // a Tailwind gray (gray-400) or any gray color you prefer
            borderRadius: '9999px', // makes it fully rounded for a smooth look
          },
          '&::-webkit-scrollbar-track': {
            opacity: 0.2,
            backgroundColor: 'transparent'
          },
          /* For Firefox */
          'scrollbar-width': 'thin',
          /* For Internet Explorer 10+ */
          '-ms-overflow-style': 'auto',
        },

      }

      addUtilities(newUtilities, ['responsive'])
    }
  ],
  variants: {
    scrollbar: ['rounded', 'hover'], // Enable variants as needed
  }
};
