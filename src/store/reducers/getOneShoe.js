import { createReducer } from "@reduxjs/toolkit";
import actions from "../actions/getShoes.js";

const {getOneShoe}=actions
let initialState={
    shoe:[]
}
const reducer =createReducer(
    initialState,
    (builder)=>builder
    .addCase(
        getOneShoe.fulfilled,
        (state, action)=>{
            let newState={
                ...state,
                shoe:action.payload.shoe
            }
            return newState
        }
    )
)
export default reducer