import { useDispatch, useSelector } from 'react-redux';
import cartAction from '../store/actions/cartAction';
import { Link as Anchor } from 'react-router-dom';
import axios from 'axios';
import apiUrl from '../../api';
import priceActions from '../store/actions/change_price';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useEffect, useState } from 'react';

export default function Cart() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const headers = { headers: { authorization: `Bearer ${token}` } };

  // Cart state
  const [cart, setCart] = useState([]);
  const [quantityMap, setQuantityMap] = useState({});
  const [totalPrice, setTotalPrice] = useState(0); // Track total price separately
  const [preferenceId, setPreferenceId] = useState(null);
  initMercadoPago(import.meta.env.VITE_PUBLIC_KEY);
  // Fetch cart data
  const fetchCartData = async () => {
    try {
      const response = await axios.get(apiUrl + 'cart', headers);
      setCart(response.data.shoes);
      // Initialize quantityMap with default quantities
      const defaultQuantityMap = {};
      response.data.shoes.forEach((shoe) => {
        defaultQuantityMap[shoe._id] = 1;
      });
      setQuantityMap(defaultQuantityMap);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);


  // Handle item deletion
  const handleDeleteOne = async (productId) => {
    try {
      await axios.delete(apiUrl + 'cart/' + productId, headers);
      dispatch(cartAction.carts());
      dispatch(priceActions.changePrice());
      await fetchCartData();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // Calculate the total price when the cart or quantityMap changes
  useEffect(() => {
    const newTotalPrice = cart.reduce(
      (total, product) => total + product.price * quantityMap[product._id],
      0
    );
    setTotalPrice(newTotalPrice);
  }, [cart, quantityMap]);


  const createPreference = async () => {
    let data = {
      unit_price: totalPrice,
    }
    try {
      await axios.post(apiUrl + 'payment', data, headers)
        .then(response => setPreferenceId(response.data.preferenceId)).catch(res => console.log(res))

    } catch (error) {
      console.log(error);
    }
  }

  return (


    <>
      <div className='w-full min-h-screen flex justify-center font-serif xsm:flex-col xxsm:flex-col'>
        <div className="h-[100%] w-[50%]  xsm:w-[100%] xxsm:w-[100%]   flex flex-col">
          <div className='ml-3'>
            <h1 className="text-3xl font-sans font-bold">Your Cart</h1>
            <p>TOTAL:  ({cart.length} items): ${totalPrice}</p>
            <p>The items in your cart are not reserved. Finish the purchasing process now to get them</p>
          </div>
          {cart.length === 0 ? (<div className='text-center text-lg font-bold font-serif mt-8 '> Cart is Empty...</div>) : (cart.map((shoe) => (
            <div className='h-[15rem]  my-6 xsm:my-1 border flex border-black ' key={shoe._id}>
              <img className='h-[100%] w-[40%]' src={shoe.cover_photo} alt="" />
              <div className='ml-4 w-[100%]'>
                <div className='mt-4 flex flex-col    h-[70%]'>
                  <div className='flex justify-between'>
                    <div className='ml-2'>
                      <p>{shoe.product_name}</p>
                      <p>{shoe.color} </p>
                    </div>
                    <p className='mr-2'>${shoe.price}</p>
                  </div>
                  <div className='mt-4 ml-2'>
                    <p>size: {shoe.size}</p>
                    <form>
                      <input
                        id='unit'
                        className=' border border-black text-center h-10'
                        min={1}
                        max={shoe.stock}
                        type="number"
                        value={quantityMap[shoe._id]}
                        onChange={(e) =>
                          setQuantityMap({
                            ...quantityMap,
                            [shoe._id]: parseInt(e.target.value),
                          })
                        }
                      />
                    </form>

                  </div>
                </div>
              </div>
              <svg onClick={() => handleDeleteOne(shoe._id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-6 cursor-pointer ">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
          )))}

        </div>
        <div className='w-[30%]  xsm:w-[100%] xxsm:w-[100%] '>
          <div className='flex justify-center flex-col items-center'>
            <button
              className='mt-4 bg-black text-white w-[70%] h-[3rem] rounded-md'
              onClick={createPreference}
            >
              PROCESS TO PAY
            </button>
            <div>
              {preferenceId && <Wallet initialization={{ preferenceId }} />}
              <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or
                  <Anchor to={'/shoes'}
                    className="font-medium hover:text-indigo-500"

                  >
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </Anchor>
                </p>
              </div>
            </div>

          </div>
          <div className='flex  justify-center'>
            <div className=' flex  flex-col  w-[80%]'>
              <p className='text-center font-bold text-xl'>ORDER SUMMARY</p>
              <div className='flex justify-between mt-4'>
                <div>
                  <p>{cart.length} products</p>
                  <p className='font-bold'>Total: </p>

                </div>
                <div>
                  <p className='text-end'>{totalPrice}</p>
                  <p className='font-bold'>${totalPrice}.0</p>

                </div>
              </div>
              <div className='mt-6'>
                <h3 className='font-bold'>Payment methods:</h3>
                <div className='flex flex-wrap'>
                  <img className='w-12 mr-2' src='https://www.adidas.co/static/checkout/react/a624f35/assets/img/payment-methods/icon-adidas-visa.svg' alt="" />
                  <img className='w-12  mr-2' src="https://www.adidas.co/static/checkout/react/a624f35/assets/img/payment-methods/icon-adidas-master-card.svg" alt="" />
                  <img className='w-12  mr-2' src="https://www.adidas.co/static/checkout/react/a624f35/assets/img/payment-methods/icon-adidas-pse.png" alt="" />
                  <img className='w-12  mr-2' src="https://www.adidas.co/static/checkout/react/a624f35/assets/img/payment-methods/icon-adidas-efecty.png" alt="" />
                  <img className='w-12 ' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABIFBMVEX///8Au/4LAID///3//v////sAAH0AAHYAAHkAAH4Avf4AAG8Duv4AAHIAwf8AAHcAAGsLAIMAxP////gAAGEJAIYAAGbz8/PAv9MAxv/p6fMLdcn+//XJydDS0+LZ2OkLkN8QmukPoe1lY6W2tczg4u8Ns/wQZryoqsl0dapSUJgMgtS7us7FyNxBQIr49vw2NY2lo8OMirAnJIYrLX57fKy5t9SWmrNfXqMfGYVyb6zq6OxRUZALJJMQQ6cJVK8UbcEMHZMNWrQQTa8KqPQwLYuXlbqFgq4NMJ0OOaBOTYwWp/kZFn+rrs9+hKYMI5Y3OIRGRZyTkrRkZZvl4vZaWKWCgbecn7Y6O4IIjtonJYHQ0+uNibxqZ5ozKY+hn8eupUPwAAAazElEQVR4nO1diVvbRhaXR9LMSKORNHZkwE4NBtsYHGMghXKf5uqGJk3adDdJm///v9j3RjY2xJccSNLv0283KRB0vJl592HDSJEiRYoUKVKkSJEiRYoUKVKkSJEiRYoUKVKkSJEiRYoUKVKkSJEiRYoUKVKkSPEDwrLgz/d+iceEadrwB/62LNMwgTTbNO//s20blm3ZpgFfwS/ib3+3t50S8NL93xb+aJZ+itEsVVt9/4Jba/27yMPdyOmvCqXKxubK2kslnuUFY0wKygFMhELQn9e2Nusv5pFY09ab+q8B7kd1+5ed3WdhwCnCITGUwu/wK/w7opRTls+/3Lvc3v/eLz0WtgUMZeltqNa3XgrJgCylSEwNQO9dwAIAfEXx/12yCYXNZT9vbhc6N0M2NX80wWTGh+zjXwdMMA4vr2ngAZM0Ojw6Xj4pNhoLXTSKxZOz46PTiEoW7zKhSnEu+FJ9Xp8B+wcjL5YUhb92pCDUUXD8YL8YuT4rNhZrnp/1Y7iui3/5+j8+/tirlRvFs1MF24q7TAgHmlcqsJd27kcjsnS5C9Rx4C4acHZ43CjXsh2qvIzreW7G6yGTcTOZDPwnk0FS/SwQehzhbircTi7WN6rfm6AYtmnp01n9xBhFpqNUquPiopfNAmmZEfAefO/CjtYWi0cEyAT2daggGwXNkKb5HfcSRDwcztaGghOJsoSR82IbaMvEe5QIsNE+/N8vF4+ceDOd/Mu6Bfz9PVUl2i2zqyA1QSBydrpcdrM+EAfn0nu4RxOQiCcZ/vazmYVlIiUJIscRf380ct9TT7b+IpJyEILytNhGCeLhO2aQ6RJTCNvuxld5wL2Ly3gwAkXDi/p3IMzUpqRReC8Uh+PJopPO2Xw8uG528YwElHDF5KUFzJj7phSCgDEKf0tQd1EQnJdBHk6xZ6MBfDnnLtwIEK2E5t+3DPNb8iNImMIS6AZCBDmpoXqbgu/GUQiH3XOztRMuwRqg4qplfBN+7Hh5MysCj6d83QDm876U/Y8A1401qe8VTwMGeijcNJ7eBQHBrdXfZYj8x64X5h6X+QaT6vuNU4bqQ1biN3hC/Qj+as4ymqAdGJHX5TnfG63WHwOelq2NUx6oKFivAo3WE55WuLXdWsqD7cJOF7Kuh4rvG1CoJWsjAhudhFdGJ3jwNBSCwN4WTkQD1fA72iEZhdr07pnhE10SPwT4/QSsXrB2SsbzJ6LQBhFqHEgUMGdeMu0AQhHIiQ1scJvOj87PTooLbQ9MczgInjbNx1Lqzf3nXBLiiC2MjzwBhajiPzJ0Vg8XfT+Z3Ynn2a81ziLG0E0CFwn+MMGvlxvAY6j6JthPF351IeI84h/+yD2FsAH+vgwdHskT9BrGr/k9+JnGNYs9XfBAqCIOV/AF+sc3DfSyvElWDFYicyap4uJWs+Ij76Nt/Ar0cfWfOR/lS5I99L1lHqBtoiiXYah2X+06YShYHL3h8roxmU0EC+v65Qj8GLai/arHow4MJrPwCk0LUBNni5p7MvGfESvu6V+As7XMuQqow8OdjRfV7vkqNG9/+ydk3AFNx4Plmj4ZI4xb/Gcw6T3fPYL9Z2uW+ZixOTihpTyQJx0Mj0myXEZZqH2I4QR2iMyWgXdg1dlVE29ld+NLegNalS2GYQFFgvPFrDtK+2iXBfzkxTM43RgH2H9Mz9i2Z1lE+auPm4I5nEZcRmcLsOB6L0csOkZjztDiCgi4QGbOtHvMY+G6oYZtroCDCa8MhzUWO8Nuh9Kq+BqdUWAW5bDqYxo3twL4BQ6GaVRW8xRFBg/IeQN8pmEMCauddWvt8jW8kSPrnYCHtitjIpFWDOoDjeZtgIeVMnre8Aa7YXr3ijeMazEsLt9wotjHxyEOExC3IRyzvU6QvlX/R5vdhBN5eFLOoN+rpb0bMwtsK1DXbpwdRlJIkC7ynYn0DVlw/LlpzF5IPK2csZsiRgp0RM7T1jcG5eB2x5HE2IZyxG4FLluFFxAlfLmvpxDtmCgS7+/WHqTExnqIkb8A1p3jK6GF48VGHCx2rXGsmI4OomgSs4YxRkNbOdMorWAwC8OsgROdg0FQbtcA7YVG8ew1UM7hMERKhlfzRg7DxUssiMLS43hUFUGU+GR0LF4b00lI5KqgDtU8z+jhcqPtYVTQbTeWT0Gvw2oTpaP4pKDXeSSFOcuEm5u3qyHGyTFiB751IBEMjQSMikeKCbE1qwMMJsbDl+DZ4lF4sQSmkrjUBi9+a+kUCnKRVdkijMUZCY6hbSBHSS0biUOFswvf8jcdh2u07jJzccwcbkkF5Y5eGqI6UX+kWLK1X+Y1zwAr43KYxl5AVFgYed/xgDsVQEXwq2FvWK2vSrCGHRrpXAumW0BrcvFmY74JQpSt3icEc0ydWw21LQvbb3+nQohApzpYIEK2vlWff3gcYcWXYFFftb5K82OmRYJUWTEGa9d4b6ob72jIUL6CIGAszzab8NOfRKT40v2V0fs0X3/7dvO2FF/+BayONbY/P/sCMVsqWPGrfPFs21gNiLMGrsb0FMKlvzpUrQ0LHsAbW7HezZUq9bebv21u1ps632nMCxBE74yH3mp1RQgGZxh46nKwkOiGuG2ja3uaA21QzBobu4rSK+MrVL9tbHDihJg2G0iiqV0O8/4C60BDNQThsPRwlwoHEozTWARRJQcGQpGynI0vfSe7dbb8i2dbIJ9mJFdhc8o9RNFpVkMSyUKiO+DpsQsS7LDVuyMa5+qNzdBBLmUMzFEw4gn/fR/+4StUmmk0gUQ2Yw3hojFXownygZDw1kgWiwXOb2GMc8248+Is28oZhQtwClQU7tSbf5Tqf+ZhG6moaLmY/O269zWuQEz8iQ9IfjWsu3FJmVoykskqVCM/w1793KchcF8rAuQtDd/G34Np9D4EA1fsgbWa/OW694WFuwgiMWtPFZ2yjUJeOcFMwhMAFH4AJtud6Q/D28YK6g6x0ikqQd419tcxU/yyNb2gMDVDcCW/kGgTXW0ZByD8t5Nel0OTUYmZ7ve2DtBdOHCaXn0078ueSzDoHVZCLT79Rl7G8jT5habxUVBgpsTY4SQSPemEHFIKwEUUW5gnu/8mJekoLuqGOXUMFDU2IflW8uvhSjhEcj4xC/8VgJFX7VECJ+mzcKIo3wQ6rPs8bZqtDwycjxXj+VcUXswyxVeSX2bB+iryLnlNhKPAq+kSqLX/QUAj9qEQa4x7a40G146IOP11+nwErOAFcEVr/G9+gVWqgkJi78R8RugnI1Zy2uYGjQXO6tLwKy5lRPhuQQvcKQAc3BSKbiY/6aDs6bspIq+RQ+Tt3XeFHa4UFZ+Hv33OmBWOUuH8lOfUglUETSuSr9AmjUQpl1xGVZgikl/Vm83mi79WwafijIx8e1AbDEhklSm9WRD6FcJ4PbFdwxTbfVheOBE2Bdpm6JWDo4fh2z3QBsPVumnkzNZL0JZyM/GjEBa6qxJNqCS8bKKAInRjqicapQsOLmOkPVgq16vjV8k0DiiP5FLHf0/8ROM3h7D9JFfCr15RIqbzn2Ep9zdW5TMhw2fqtxJYp2NPD8ilTRkQ/saCDZ1GqoK3TetJzhu8E1f0YopHaa/ZwmdZf8zrFbImkFYoem8ZVu/tT5VVMg2h+E4SPrbNQkjU2+SP6lzdySlgaMeayDvCWumSQGejNJ39tUIVS3ZFhRKOoToTTP/HiElO8swCCt7wVkdoJ98PXEvTqKP9lehpV5yLbTSbLcua3n9LBPDr/wvKX2yiV5zkQjwxVUF4ktop01jHXLZYqhcMc1wk8JEA/JszdiScnYNET9SatlAB1fQ+wdNMI1AgahzqCLlTn49/9MQAdxJE1KeQBM76JNLp7o2q9R0pMJK5nuBpZgsDSXHFuQqEXNVUgrLK6YDwk1ELd96WSnG6H4ech71eHHfH9EJ9iUuH69Cxk0jUgCilx+eRDmCjEOeB1KXJuNLW01Vfmc9NoyTAEJIlY1B8LYat4945o7K5G8IuBDzSqTDCkhi2H6ViC3O+zvhg+gjDDTR/cVkynrTa00JfvyAj7ogXpjXkSdr8LNR3dPSfxxmF1yfHYKEk8aC2uWJlTJtns7X/LV9jCbDCXgnJrkpPUunRfXnYHLu1TrkSl8MjYPsbF3nuKB4nNK5PyplstsFJL3IyAcAqRQp1+YPrZ72F5UNMTiogkrPfqk9bl2SYO/Dy4PjDQ3plJWYnzF29BNfFQWYF1nm9vODp2iW/ERCWnMK7ZKzn+n6tcY5JQTCpqfxQnzHG5pOmB5goIYkwotzn1er1LGy8lJhIxb0j540aptExczkthb0cM/7Pz7rl5UgiTzqOWCnp8P3T7KNpbAiugouW8bzvp9btqtDkkYCp5TLSpos9vAxSyJNT+L++OiVdm46VB/7iSQReAObm17aNex11j0grKMYmVg6wak9u6xwxuGScy8NiO5uN6zawZgyLUNxiUgrh9xv+kAqE8nEQYAZTvpxFK1sHsPerBZ3ntHXtjZYYCbfX1FZ676J5cIqdoKTj2kZrA5PcQF0gr4u1L4oZXM9fTk4hPxlIoa6EzDQOJbyAkh8+osSr7+YpC8NPdl/+wLQTqpWfNmfsezmMmVfY2IZe3/zfAisCKEXy5txBZUr+GU1IIbij59nBFOpj7y+e58HoUeGSOY85exJh1eALuLT0dvWfNyt1NA8SbeLvjM3bffFUoHZNKUe+3b4Q2ATH2elJG0vm3QEFLq5/SIlMQuFHUICnQyjUHSOwkbXjgAbE2QXZAypEMjBF2OfmBwbKDLvQDhIWETTDKNw2enYMhl/eSawMcLDqg2OxmYf9UwPLbbJwhhPtITgjhI2uP8R6zyOsNlWErW/PzDSXhC6rVNhgAs9zwg3Deq5LAcAvmiAO1gyV2EBm7EaUYIE+CcIijuVSmZH9HF5bkihMsqIz4OKzxZH1h7iR2QVYXiI+G7q6/CehsP4w/8/e3kWekUh+NjoVHKY9Pr+E4pMynWLp0/K3qB9u2tnRpZCe32AgeRMQaBggR4LiEFHTuSuyg9+WEV1BAp+DKbwNV4lNbR1av4BDky+0Zre3S2Al58Z3vMAavZBKLBk5o1/Lg8yjJOuNqbbOngFrvExAn4WRa34ztobUc4sBCTHhEufzX1I23zUEqkwRHjLKmNiZqADNRBI5/b1PQIHWMa54JBfGtfr52F68k4RCexVYidV0Y+TItTumTi9db1zKbr8yHLQNirVMBOQEFQct1JHjH1yRhK/P2P3Vsa2Q8OKYImm3DKeHXyag0DQuUb82dJH5KPjXlH/qXVev905YzsCeRAHuCAhEKlvmBHUvljEriHpVsK0+33DXocdjSojdZSwlTJLMNY0K+M30cJi+6FF4RPurgvb7pT0mr16AAC98lo7CVOv4PYSdAxKJrPZ7TrsOH0thBPaASNRXa86AXCTyP+Oqr/0TqrM+3cv66m5sY/ONGQ9WsFZ5hImXASRa9+kG/t0OwY7oqzlsibGnFCQpdQhLFL/KGWiw8OPsGBLdMnjaddy5nDGqKOWCkzcDMid2nOW3+jKnFvCig7rf1nUIOWPFISBpRshS18teYzndahIK4YlboMlpUBtNoOfNnSoHQ8eo1AtXQ24HZ4/ysDXAFDftGb5jm/2lFJb5QgYqxNw+qphNHlA159aGb6Kn5QylG4koBKkWwDHlZ6M5EUzEMpg1chMdiw0ph93PMvIRnR0QwTLt1jPlFHJmn8luYLwtkHtNLHT/wIHa8kiJ587dYLhMVJPlnsyWQFkja2NY3MsWRRQ4oSKg+v4ZvmKEAiMOOqVYQh5+tHtMilbbre7+CWXe4RGRDX9U2wNsodA1qInjRwe6u+VoLjOmeytblHq+Bbg3Lw1zcKTRxiLCihEbqQ8zhG8Z1mnoc95ZX9PYczrDQSijjeHCQEeSsodY0Uo/JaawEmCoji2M7WD220c4ygPrEYwhKsE2wIa7WPpFayzrfhzUNlaEAr/LuqMcSxth1fSkELJcG90x5GaL2MtAsO4oGYGmEepIcuQO8sf6oJu2FopFeJCoYlR8EAr5CN6YSLGJXRcPampQccoXve0Hm88SET8vnhTLGX9ci1VNnyD6KkG6qgusRINLz/3R6tbVnTqu74J+WTGGWNh1yh0ALLUz/6DKDsMgbxylm7XufgKmGluYc0d30eAp9bJHHDnE2ZgijFvVDAzKyI1vNhqefxxgqRA2jljdyuE7HPD8xfulQCjguXk7rvntRe1NU4KWv419sBxWNWw4nLXHPBEfimdUCwFhJS5WsdDqitm9NlmjWhsWE0iMQ8Wl+3s5W9c+1fwqDZTYx0k9M0Z/x3JLKFSBlq3n+BgFMMCjSUYYuIssLuYfpopHwTQ/xlKYvp6sdc4HoRqFe1jctH/wbPbecukSfTTgNsH/X4XfqD6Tf/SMIMusChqBJ53THWnzjAR8tHfaeaYXNywokayOuUOhZax1einOs5nxPZ6gGpcxHh3u/rkr6f2eJOwKQn2Qs8AIo6IEX4RENPv+HZYziOQWJmSrKyyI6M0EBKJrE7/hyjQFVbZpzwvt4RG2nJ2oxzNbDDAgjo2TcrsrM+1+yQJMGhK1BZs4H1KxYdzN97KMbQHyInz1O8dYCH899oEemIznmJzBYNXMNLF37J7bo/EpkMXJ5nr4tXNs4glArK52Y6dmfz0UfPWJgxcAh3E2JPKy3xrfwzL+OI8nz8c/D87MmW7YUZx/mmqGDTbqFPLxKQDLaayrGJPoeo2T5ZPjIIIN6jx15r4qboLIbWGetS5o8N54fne8mlxP8SFcXJezE3DFnGYKnKBFjZGOzTBo7+Uz6zQeiYlIxOSG7u+KuGJbMYHN/FWvmhbuuc+pnNHdM5cBFXu95zU55Udnx8uNdnZgWPsBgOtJnIbH5rjpy+HX4ZzqNLksZvUEoEl2MuOXJaUOu2wWmn8LtdJXL2zaJU6Fzs2BuUa53NOpD4w5/gkySHffTsAQnjt3JuPF5/zPaYkzdGGkzmeRWNxgYGoyEt0F3QfFBKORs3t3P1TydY5ugK2/3qGRXIndCWMLzuehP+n9/XPWbWxjM1/RoQdru8FIhxfZedYfY6PevYDrt6/j4VicY3Fsb8nMNcdZ0xYWytg1IGsJnEtr9g0QztujfPk++N5N0HkrIptfldeDN1mKNQZsZHBdy05GIWYXsuVjJbiM4OKDXv+23ZTUqejWPDiyOWMNViEfsjxKGV72J+nz9zy/TXiXQL41jZC5B2v3br4hdRZ1cmSidcb+3Vq7NrccEPapo/EtG+wxQnfmtczBmr5P8Qw7+FuetscqeZ2ndecW7ugjzpuvJA/XfV/0ejlZcSI513slIFRRHIEQ+zZNGeFcPnERj9RrLmE3MUNH8LQxAQ/q+Rru2R0Lgtc1TY3+Q9glQe7AbmqTT/3QLjgax5yyt9vNZn0VjAE4uNjTxYLdV4ICr8rGYrHRaI8ap3AHPPzt18Hd26jwMWYPYghT9kjkpDEmEdRHXtzbXUYfXDHBHRzLcNw+x8Z0DtYd6CEO5pIuqHDHJV9iZIu9E0rQtH2k+qXPYa/rmMgbz493ZxJCQTBkazeSx554QBrg17ZPIokxiiBgR4uTWNhxLg8nfx2yHn0Ko6qPVR9xqaNNndWjQREnDEzIkPBr2Wz5TEkp6U0xniPgZ9uN4tlZsVHzJ7MG9Y18d5k5fQSKW9N6LApNILFTqqgRnJb1lKhJXkwrACSsVsOohKdnlGU6k0wnO5oavt+IOOlDWOmLXn01hTaW8PSdVMowLzsZP+K80nhCiKvtPj0zyY1nTEx40jGktnitB1DeLbPYNsznU3XHDgN4O7RvDcHDqXUnQT7dvK94DA7OUDySfRIG5FT40ZgoI5kE84Jg4XDfPh6342krTzazrRNqy5aP5L0DSpxg3370+vPnRmsddlH1PYfKo3J2shFPU1JY0zVYN/f2Dx/839ZTFPICU6/Ie88hWN3ZeOy5nvdIxKmJrF/IIdhWPKn+8Wt5TQNTJkT1nxjK1Ik+rI85f68z6cb14xGmffyncAxa4t7kyQH+4gfe8RfvWAIeedPw5mLn8RG2E5mvlvH8bK14yB4cTyz+Wp95wr4BvPWlcCLyAJwFR42Mn/EnNXRGUwjGy1ytcS0D+vA5FMumnhTo8BTe3ONGLCdBLcXYUaM9WQxiNMBOrRWvmdTjy2m/ZCMqWJu6m3ZywD7eMjTv1cMVplg+uODFkQAvjunoQeUjtsvt2rfxEUfqFs4iye/fO9Jzb4jDB2RZn4BCrHl6L/QguYenVTt71ycLNT3ZUtfuZkbNRIxnummvSM/ErDWWX/MvziacD9xJXfT2LT4hwtJlePs7UqkvCXT0BwYwFh0XF9rZOT3SbcTka70MGR+ngLcbJ+eRDPiAVYubUcW7Qty18+SwdamGaVR/Db9cbDxKREcl8DMRDsF7KNfcbHdcqRtTFA+Xi5F1a4uN4vFrjrOYKBmwaJ2jsVPVLb/fdj77/LsQhz0Ofa14OyWLXp8vF/GzH8qLizU9oWyxvNBoFE+Wj15HMv74hyF3wHJOLHd69z0+RwCzhIUtyRXhw97vjlI9nQxUSnc8Gf6Fn+LR++ySYQQCiU64Vfgun3dh5nI4V2xjV36hHgdTGZOqP6qEPrTDhl2kJH9Vf5Dd+XYUdhNnpXeCj96K7kbSeEbdIBE1+BIu90q6r3i6Du9HAnZWbB+A9og626LIQHk4CbofSxPRSFGeP/gm6m88dCekVdkJdbPivVl5UxGpP6ckyC9V9N1/jE9IMuOQ14tP2PGo7oUCkgI9Mi5ebeoygCftV00E3aqHnz5m7FdWuBgnIUdsIGViN25WxXEZaFr8GBR20JHnrdlffmcCJyPjZEhdHRdn2+N8ZodbuboLKsVFLQEXbO1yVkfpzR/6U+jiuoRCc+NqXQrJ4w/sinRVu9LBb0DUmW2JJxrNn1C82fzc1C0vPwbfjYTZaedF2NXZ+tut1X9oPg/ESh7oD7ni+KFd7NmzZ5JeHFy9vZ2N50PraqHv+blAk0OPBrZz3TKhGIX5ZnN2tlKpbFe2t2dnS80/epNT4myiLlr8N326XDwheDT+fZ94mCJFihQpUqRIkSJFihQpUqRIkSJFihQpUqRIkSJFihQpUqRIkSJFihQpUqRIkeJfj/8DPv0bQ5ME0z0AAAAASUVORK5CYII=" alt="" />

                </div>

              </div>
            </div>

          </div>



        </div>
      </div>
    </>
  );
}



