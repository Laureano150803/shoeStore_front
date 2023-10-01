import React from 'react'
import { Link as Anchor } from 'react-router-dom'

export default function AboutUs() {
    return (
        <>
            <div className='min-h-screen flex'>
                <div className='mt-4 w-[50%] xsm:flex xsm:flex-col xsm:items-center xxsm:flex xxsm:flex-col xxsm:items-center font-serif xsm:w-full xxsm:w-full'>
                    <h1 className='font-mono font-bold border-b-2 border-black'>About Us</h1>
                    <div className='ml-4  w-[80%]  xsm:ml-0 xxsm:ml-0 ' >
                        <h4 className='text-center font-mono font-bold'>Our history:</h4>
                        <p className=''>At ShoeStore, we have been walking alongside you since 2003. Since then, we've been obsessed with fashion and comfort in every step you take. Our mission is simple: provide you with the perfect shoes for every occasion, so you always feel confident and stylish.</p>
                        <h4 className='text-center font-mono font-bold mt-5'>Our Commitment:</h4>
                        <p>At ShoeStore, quality is our top priority. Each pair of shoes we create is the result of the dedication of artisans passionate about their work and the highest quality materials. We are committed to offering you style, durability and comfort with every step.</p>
                        <h4 className='text-center font-mono font-bold mt-5'>Our passion:</h4>
                        <p>At the heart of ShoeStore is a passion for footwear design. Each of our designs is carefully crafted to reflect the latest fashion trends, without compromising functionality or comfort. We are obsessed with details and believe that shoes should not only look good, but feel even better.</p>
                        <h4 className='text-center font-mono font-bold mt-5'>Contact:</h4>
                        <p>Do you have any questions or suggestions? We are here to help you. Contact us at <a className='font-bold' href="http://laureanohurtado1@gmail.com"> laureanohurtado1@gmail.com</a> Your satisfaction is our priority.</p>
                    </div>
                    <div className='ml-4 flex justify-center  w-[80%] mt-14'>
                        <Anchor className='bg-black text-white py-3 px-4 rounded-md hover:py-4 hover:px-6 duration-300' to={'/signup'}>Sign up for free!</Anchor>

                    </div>
                    <p className='ml-4 flex justify-center  w-[80%] mt-6 font-bold'>visit Us!</p>
                    <div className='ml-4 flex justify-center  w-[80%]  mb-2'>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15697.69576387679!2d-75.5160121!3d10.38786405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sco!4v1696191686090!5m2!1ses-419!2sco"
                            width="600"
                            height="450"
                            style={{ border: '0' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>

                    </div>



                </div>
                <div className='w-[50%] bg-cover bg-no-repeat bg-about bg-center xsm:hidden xxsm:hidden'>

                </div>
            </div>
        </>

    )
}
