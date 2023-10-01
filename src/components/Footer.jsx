import React from 'react'
import logo_white from '../assets/img/logo-white.png'

function Footer() {
  return (
    <>
    <div className='flex justify-center  bg-gray-200 '>
        <div className=''>
            <img src={logo_white} alt="logo" />
            <p className='font-Fuggles text-gray-950 text-xl'>Made By Laureano</p>
        </div>
    </div>
    </>
    
  )
}

export default Footer