/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens:{
        'xsm': {'min': '320px', 'max': '427px'},
        'xxsm':{'min': '427px', 'max': '886px'},
        'md': {'min': '886px', 'max': '4000px'}
      },
      fontFamily:{
        Fuggles:['Fuggles', 'cursive']
      },
      backgroundImage: {
        'first': "url('/src/assets/img/first.jpg')",
        'second': "url('/src/assets/img/second.jpg')",
        'third':"url('/src/assets/img/third.jpg')",
        'signup':"url('/src/assets/img/signup.jpg')",
        'signin':"url('/src/assets/img/signin.jpg')",
        'about':"url('/src/assets/img/about.jpg')"
      }
    },
  },
  plugins: [],
}

