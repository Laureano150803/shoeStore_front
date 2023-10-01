import { useEffect, useRef } from "react"
import { useNavigate} from "react-router-dom"
import { Link as Anchor } from "react-router-dom"
import axios from "axios"
import apiUrl from "../../api"
import GoogleLogin from "react-google-login"
import { gapi } from "gapi-script"
import showSwalAlert from "../showAlert"

export default function SignIn() {
    let email = useRef()
    let password = useRef()
    const navigate = useNavigate()
    const clientID = import.meta.env.VITE_CLIENT_ID
    useEffect(() => {
        const start = () => {
            gapi.auth2.init({
                clientId: clientID
            })
        }
        gapi.load("client:auth2", start)
    }, [])
    const onSuccess = (response) => {
        const { email, googleId } =response.profileObj;
        let data = {
            email: email,
            password: googleId
        }
        axios.post(apiUrl + 'auth/signin', data)
            .then(res => {
            const token = res.data.token
            const role = res.data.user.role
            localStorage.setItem('token', token)
            localStorage.setItem('role',role)
            showSwalAlert('success', "You are SignIn!")
            navigate('/')})
            .catch(err =>showSwalAlert("error", "err.data.response"))
    }
    const onFailure = () => {
        console.log("something went wrong");
    }
    async function handleSignIn(e){
        e.preventDefault()
        let data={
            email:email.current.value,
            password:password.current.value
        }
      axios.post(apiUrl + 'auth/signin', data).then(res=>{
        const token = res.data.token
        const role = res.data.user.role
        localStorage.setItem('token', token)
        localStorage.setItem('role',role)
        showSwalAlert('success', "You are Sign In!")
        navigate('/')
    }).catch(res =>showSwalAlert("error", "Bad Credentials"))
    }
  return (
    <>
    <div className='min-h-screen flex justify-center bg-gray-200'>
        <div className='border h-[95vh]  w-[100vh] flex justify-center items-center flex-col'>
            <h4 className='font-mono font-bold mb-4'>ENTER YOUR ACCOUNT</h4>
            <form className='flex flex-col' method="post" onSubmit={handleSignIn} >
                <input ref={email} type="text" placeholder='Email *' className='text-center font-mono font-bold outline-none border border-black h-[2.5rem] w-[20rem] xsm:w-[13rem]' />
                <input ref={password} type="password" placeholder='Password *' className='text-center font-mono font-bold outline-none border border-black mt-2 h-[2.5rem] w-[20rem] xsm:w-[13rem]' />
                       
                <input type="submit" className="cursor-pointer my-3 py-2 rounded-md bg-black text-white xsm:w-[13rem]" value="SignIn!" />
                
                <GoogleLogin
                        className="flex space-x-2 justify-center items-end hover:scale-105 border border-gray-300 text-gray-600 py-2 transition duration-100 w-[20rem] xsm:w-[13rem]"
                        clientId={clientID}
                        buttonText="Sign in with Google"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookiePolicy={"single_host_policy"}
                    />
                    <p>Create Account <Anchor className="font-mono hover:underline" to={'/signup'}>Here </Anchor> </p>
            </form>
        </div>
        <div className='bg-signin h-[95vh] w-[100vh] bg-cover bg-no-repeat bg-bottom xsm:hidden xxsm:hidden' ></div>
    </div>
</>
  )
}
