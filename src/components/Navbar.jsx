import React, { useState } from 'react'
import { Link as Anchor } from 'react-router-dom'
import logo_white from '../assets/img/logo-white.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import apiUrl from '../../api'
import showSwalAlert from '../showAlert'
export default function Navbar() {
    const role = localStorage.getItem('role')
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    let headers = { headers: { 'authorization': `Bearer ${token}` } }
    function logOut() {
        axios.post(apiUrl + 'auth/signout', null, headers).then(res => {
            localStorage.clear()
            showSwalAlert('success', res.data.response)
            navigate('/')
        }).catch(res => res)
    }
    const [showNav, setShowNav]=useState(false)
    
    return (
        <>
            <div className='h-12 w-full border-b-2 rounded-b-md flex  items-center justify-between bg-gray-200'>
                <div className='flex items-center justify-evenly flex-wrap w-[15%] xsm:hidden xxsm:hidden '>
                    <img className='h-12 xxsm:hidden xsm:hidden' src={logo_white} alt="logo" />
                    <p className='font-Fuggles text-4xl font-bold'>Shoestore</p>
                </div>
                <div className='flex items-center justify-evenly w-[15%] xxsm:w-[20%] md:hidden '>
                    <svg onClick={()=> setShowNav(!showNav)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </div>
                {showNav && (
                <div className='text-xs flex justify-evenly items-center w-[100%]'>
                    <Anchor to={'/'} className='hover:border-b-2 hover:border-black  xxsm:border-b-2 xxsm:border-black '>
                        HOME
                    </Anchor>
                    <Anchor to={'/shoes'} className='text-red-500 hover:border-b-2 hover:border-red-500 xxsm:border-b-2 xxsm:border-red-500'>
                        SHOES
                    </Anchor>
                    <Anchor to={'/about'} className='hover:border-b-2 hover:border-black xxsm:border-b-2 xxsm:border-black'>
                        COMMUNITY
                    </Anchor>
                    {!role ? (<Anchor to={'/signin'} className='hover:border-b-2 hover:border-black xxsm:border-b-2 xxsm:border-black'>
                        SIGN IN
                    </Anchor>) : ('')}
                </div>)}
                <div className=' w-[30%] md:w-[60%] xxsm:w-[60%] flex justify-evenly flex-wrap font-mono font-bold h-full items-center xsm:hidden xxsm:hidden'>
                    <Anchor to={'/'} className='hover:border-b-2 hover:border-black  xxsm:border-b-2 xxsm:border-black '>
                        HOME
                    </Anchor>
                    <Anchor to={'/shoes'} className='text-red-500 hover:border-b-2 hover:border-red-500 xxsm:border-b-2 xxsm:border-red-500'>
                        SHOES
                    </Anchor>
                    <Anchor to={'/about'} className='hover:border-b-2 hover:border-black xxsm:border-b-2 xxsm:border-black'>
                        COMMUNITY
                    </Anchor>
                    {!role ? (<Anchor to={'/signin'} className='hover:border-b-2 hover:border-black xxsm:border-b-2 xxsm:border-black'>
                        SIGN IN
                    </Anchor>) : ('')}
                </div>
                <div className=' w-[20%] flex justify-center'>
                    {role ? (<Anchor to={'/cart'} className=' hover:rounded-xl hover:bg-slate-300 w-7 h-7 flex justify-center items-center cursor-pointer mr-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                    </Anchor>) : (<Anchor to={'/signin'} className=' hover:rounded-xl hover:bg-slate-300 w-7 h-7 flex justify-center items-center cursor-pointer mr-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                    </Anchor>)}
                    {role ? (<div className='flex justify-center items-center'>
                        <svg onClick={logOut} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                    </div>
                    ) : ('')}
                </div>
            </div>
        </>
    )
}
