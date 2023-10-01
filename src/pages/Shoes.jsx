import React, { useState, useEffect } from 'react';
import ShoeCart from '../components/ShoeCard';
import { useDispatch, useSelector } from 'react-redux';
import shoeAction from '../store/actions/getShoes';
import cartAction from '../store/actions/cartAction'
const{addItems}=cartAction
const { getShoes } = shoeAction;

export default function Shoes() {
  const allShoes = useSelector((store) => store.shoes.shoes);
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getShoes());
  }, []);
  return (
    <>
      <div className='w-full min-h-screen bg-gray-200'>
        <div className='flex justify-center'>
          <div className='w-[60%] flex justify-evenly items-center mb-6'>
            <form className='w-[30%] xsm:w-[100%]  xxsm:w-[100%]'>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 outline-none"
                  placeholder="Find your favorite brand!"
                  required
                  value={searchTerm}
                  onChange={(e) =>{
                    e.preventDefault()
                    setSearchTerm(e.target.value)
                  } }
                />
              </div>
            </form>
          </div>
        </div>
        <div className='flex justify-center '>
          <div className='w-[80%] min-h-screen flex justify-center flex-wrap bg-white rounded-md'>
            
            {allShoes
              .filter((shoe) =>
                shoe.brand.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((shoe) => (
                
                <ShoeCart
                  key={shoe._id}
                  id={shoe._id}
                  price={shoe.price}
                  photo={shoe.photo}
                  model={shoe.model}
                  brand={shoe.brand}
                  stock={shoe.stock}
                  color={shoe.color}
                  size={shoe.size}
                  company_id={shoe.company_id}
                />
                
                
              ))}

          
          </div>
        </div>
      </div>
    </>
  );
}
