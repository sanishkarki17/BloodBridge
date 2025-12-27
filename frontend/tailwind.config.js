/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Professional Medical Theme
                primary: {
                    red: '#D32F2F',
                    'red-dark': '#B71C1C',
                    'red-light': '#EF5350',
                    blue: '#1976D2',
                    'blue-dark': '#0D47A1',
                    'blue-light': '#42A5F5',
                },
                background: {
                    DEFAULT: '#F9FAFB',
                    card: '#FFFFFF',
                },
                text: {
                    DEFAULT: '#1F2937',
                    secondary: '#6B7280',
                    light: '#9CA3AF',
                },
                accent: {
                    'blue-tint': '#E3F2FD',
                    'red-tint': '#FFCDD2',
                },
                status: {
                    available: '#10B981',
                    unavailable: '#6B7280',
                    urgent: '#DC2626',
                    blocked: '#EF4444',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'medical': '0 2px 8px rgba(25, 118, 210, 0.08)',
            },
            borderRadius: {
                'card': '0.75rem',
            },
        },
    },
    plugins: [],
}
