import {createBrowserRouter } from "react-router-dom";
import Layout from '../layouts/Main'
import Shoes from "../pages/Shoes";
import Index from "../pages/Index";
import SignUp from '../pages/SignUp'
import SignIn from "../pages/SignIn";
import Cart from "../pages/Cart";
import AboutUs from "../pages/AboutUs";
const router = createBrowserRouter([
    {
      path: "/",   element: <Layout/>,
      children:[
        {path:'/shoes', element:<Shoes/>},
        {path:'/', element:<Index/>},
        {path:'/signin', element:<SignIn/>},
        {path:'/signup', element:<SignUp/>},
        {path:'/cart', element:<Cart/>},
        {path:'/about', element:<AboutUs/>}
      ]
    }
  ])

export default router