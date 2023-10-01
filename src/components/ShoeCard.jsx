import React from 'react'
import axios from 'axios'
import { Link as Anchor } from 'react-router-dom'
import showSwalAlert from '../showAlert'
import apiUrl from '../../api'


export default function ShoeCart({ price, photo, model, brand, id }) {
   let token = localStorage.getItem("token")
    let headers = { headers: { "Authorization": `bearer ${token}` } }
  const handleComprar = async () => {
   
    try {
      await axios.post( apiUrl+'cart/' + id, null, headers).then(res => {
        showSwalAlert('success', 'Product added to cart')
      })
    } catch (error) {
      showSwalAlert('error', 'something went wrong');
    }
  }

  return (
    <>
      <div className='h-[18rem] xsm:h-[16rem] xxsm:h-[16rem] w-72 m-1 flex flex-col items-center bg-gray-200 rounded-md hover:bg-gray-400 duration-300'>
        <img src={photo} className='w-full h-[70%] xsm:h-[60%] xxsm:h-[60%]' />
        <div className='h-[20%] w-[90%]   flex flex-col justify-between mt-3'>
          <div className='flex flex-row justify-between'>
            <div>
              <p className='font-serif'>${price}</p>
              <p className='font-serif mt-2'>{model}</p>

            </div>
            <div className=' '>
              <p className='font-serif font-bold'>{brand}</p>
              {token? (<div onClick={handleComprar}
                className='font-serif cursor-pointer mt-2 flex bg-black text-white px-2 py-1 rounded-md hover:translate-y-1 duration-300'>Add
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>):(<Anchor to={'/signin'}
                className='font-serif cursor-pointer mt-2 flex bg-black text-white px-2 py-1 rounded-md hover:translate-y-1 duration-300'>Add
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </Anchor>)}
              

            </div>
              
              
           

          </div>

        </div>


      </div>
    </>

  )
}
