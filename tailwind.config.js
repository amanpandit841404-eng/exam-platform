/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: [
    'md:grid-cols-3',
    'bg-[#1a237e]',
    'from-red-500',
    'to-red-600',
    'from-blue-500',
    'to-blue-600',
    'from-purple-500',
    'to-purple-600',
    'from-orange-500',
    'to-orange-600',
    'bg-gradient-to-br',
    'text-[#1a237e]',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
