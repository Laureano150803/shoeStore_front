import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../../../api";


const getShoes = createAsyncThunk('getShoes', async()=>{
    try {
    let res = await axios.get(apiUrl + 'shoes')
    return{
        shoes:res.data.response
    }
        
    } catch (error) {
        return{
            signIn:res.data.response
        }
    }
    
})
const getOneShoe = createAsyncThunk('getOneShoe', async(id)=>{
    try {
        let res = await axios.get(apiUrl+ `shoes/${id}`)
        return{
            shoe:res.data.response
        }
    } catch (error) {
        return{
            shoe:res.data.response
        }
    }
})
const actions={getShoes, getOneShoe}
export default actions