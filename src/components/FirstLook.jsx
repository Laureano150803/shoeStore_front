import React, { useState } from 'react'
import { Link as Anchor } from 'react-router-dom'

export default function FirtsLook() {
 
  return (
    <>
      <div className='min-h-screen w-full' >
        <div className='bg-first bg-contain bg-no-repeat bg-center h-[95vh] bg-gray-200 flex justify-center items-center bg-opacity-95 '>
        
          <Anchor to={'/shoes'} className='bg-white py-2 px-8  font-mono font-bold hover:rounded-md hover:translate-y-1 duration-300  '>
            EXPLORE!
          </Anchor>
          

        </div>
      </div>
    </>

  )
}
