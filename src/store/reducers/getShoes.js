import { createReducer } from "@reduxjs/toolkit";
import actions from "../actions/getShoes.js";

const {getShoes}=actions

let initialState={
    shoes:[]
}
const reducer =createReducer(
    initialState,
    (builder)=>builder
    .addCase(
        getShoes.fulfilled,
        (state, action)=>{
            let newState={
                ...state,
                shoes:action.payload.shoes
            }
            return newState
        }
    )
)
export default reducer