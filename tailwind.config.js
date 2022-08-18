module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        open: 'menuOpen .7s ease-out forwards',
        close: 'menuClose 1s ease-in-out forwards',
      },
      keyframes: {
        menuOpen: {
          '0%': {'transform': 'translateX(100%)'},
          '100%':  {'transform': 'translateX(0)'}
        },
        menuClose: {
          '0%': {'transform': 'translateX(0)'},
          '100%':  {'transform': 'translateX(100%)'}
        },
      },
    },
  },
  plugins: [],
}