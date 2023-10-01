import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom"

export default function Main() {
  return (
    <>
    <Navbar/>
    <div>
        <Outlet/>
    </div>
    <Footer/>
    </>
   
  )
}
