import { configureStore } from "@reduxjs/toolkit";
import shoesReducer from './reducers/getShoes'
import oneShoeReducer from './reducers/getOneShoe'
import cartReducer from './reducers/cartReducer'


const store=configureStore({
    reducer:{
        shoes:shoesReducer,
        shoe:oneShoeReducer,
        cart:cartReducer
    }
})
export default store