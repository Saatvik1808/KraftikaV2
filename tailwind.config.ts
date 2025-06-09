import type { Config } from "tailwindcss";
import { fontFamily as defaultFontFamily } from "tailwindcss/defaultTheme"; // Renamed to avoid conflict

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
      fontFamily: {
        sans: ["'Regalia Monarch'", ...defaultFontFamily.sans], // Use Regalia Monarch for body text
        heading: ["'Regalia Monarch'", ...defaultFontFamily.serif], // Use Regalia Monarch for headings
      },
  		colors: {
        // Theme HSL variables defined in globals.css
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))', // Pastel Green
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))', // Soft Peach
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))', // Blush Pink
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))', // Lemon Yellow
          foreground: 'hsl(var(--accent-foreground))'
        },
         lilac: { // Added Lilac
           DEFAULT: 'hsl(var(--lilac))',
           foreground: 'hsl(var(--lilac-foreground))'
         },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
         // Raw HSL values for dynamic use (e.g., shadows)
         'primary-hsl': 'var(--primary-hsl)', // 145 50% 80%
         'secondary-hsl': 'var(--secondary-hsl)', // 25 100% 88% (Peach)
         'accent-hsl': 'var(--accent-hsl)', // 55 100% 85% (Yellow)
         'muted-hsl': 'var(--muted-hsl)', // 340 100% 92% (Pink)
         'lilac-hsl': 'var(--lilac-hsl)', // 275 60% 90% (Lilac)
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
         'glow': { // Keyframe for subtle glow animation
           '0%, 100%': { opacity: '0.7', filter: 'brightness(1)' },
           '50%': { opacity: '1', filter: 'brightness(1.1)' },
         },
          'float': { // Keyframe for floating animation
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
           'ripple': { // Basic ripple effect
             'to': { transform: 'scale(4)', opacity: '0' }
           }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
         'glow': 'glow 3s ease-in-out infinite', // Subtle glow animation
         'float': 'float 6s ease-in-out infinite', // Floating animation
         'ripple': 'ripple 600ms linear', // Ripple animation
  		},
       boxShadow: {
           'lg': '0 10px 15px -3px hsla(var(--foreground), 0.08), 0 4px 6px -2px hsla(var(--foreground), 0.04)', // Softer shadow using foreground HSL
           'xl': '0 20px 25px -5px hsla(var(--foreground), 0.1), 0 10px 10px -5px hsla(var(--foreground), 0.04)',
           'primary': '0 6px 20px -5px hsla(var(--primary-hsl), 0.3), 0 4px 8px -6px hsla(var(--primary-hsl), 0.25)', // Refined primary shadow
           'accent': '0 6px 20px -5px hsla(var(--accent-hsl), 0.3), 0 4px 8px -6px hsla(var(--accent-hsl), 0.25)',
           'secondary': '0 6px 20px -5px hsla(var(--secondary-hsl), 0.3), 0 4px 8px -6px hsla(var(--secondary-hsl), 0.25)',
           'glass': 'var(--glass-shadow)',
       },
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
