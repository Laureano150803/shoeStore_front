import {  createAsyncThunk } from "@reduxjs/toolkit";
import apiUrl from "../../../api";
import axios from "axios";

let carts =createAsyncThunk("carts",
async()=>{
    let token = localStorage.getItem("token");
    let headers = { headers: { Authorization: `Bearer ${token}` } };
    try {
        if(token){
            let res = await axios.get(apiUrl + 'cart', headers);
            return { cart: res.data.shoes }
        }else{return {cart:[]}}
        
    } catch (error) {
        return {cart:[]}
    }
}) 
const actions = { carts }

export default actions 