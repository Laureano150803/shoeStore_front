import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import apiUrl from "../../api"
import GoogleLogin from "react-google-login"
import showSwalAlert from "../showAlert"
import { gapi } from "gapi-script"


export default function SignUp() {
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
        axios.post(apiUrl + 'auth/signup', data)
            .then(res =>
                {console.log(res.data.response)
                navigate('/')})
            .catch(res => console.log(res))
            
    }
    const onFailure = () => {
        console.log("something went wrong");
    }

    async function handleSignUp(e) {
        e.preventDefault()
        let data = {
            email: email.current.value,
            password: password.current.value
        }
        axios.post(apiUrl + 'auth/signup', data).then(res=>{
            showSwalAlert('success', 'Sign Up Successfully!')
            navigate('/')})
            .catch(res =>  showSwalAlert('error', res.data.response))
        
    }

    return (
        <>
            <div className='min-h-screen flex justify-center bg-gray-200'>
                <div className='bg-signup h-[95vh] w-[100vh] bg-cover bg-no-repeat bg-bottom xsm:hidden xxsm:hidden' ></div>
                <div className='border h-[95vh]  w-[100vh] flex justify-center items-center flex-col'>
                    <h4 className='font-mono font-bold mb-4'>CREATE ACCOUNT</h4>
                    
                    <form className='flex flex-col xsm:items-center' >
                        <input ref={email} type="text" placeholder='Email *' className='text-center font-mono font-bold outline-none border border-black h-[2.5rem] w-[20rem] xsm:w-[13rem]' />
                        <input ref={password} type="password" placeholder='Password *' className='text-center font-mono font-bold outline-none border border-black mt-2 h-[2.5rem] w-[20rem] xsm:w-[13rem]' />
                        <input onClick={handleSignUp} type="submit" className="cursor-pointer my-3 py-2 rounded-md bg-black text-white xsm:w-[13rem]" value="SignUp!" />
                        <GoogleLogin
                        className="flex space-x-2 justify-center items-end hover:scale-105 border border-gray-300 text-gray-600 py-2 transition duration-100 w-[20rem] xsm:w-[13rem]"
                        clientId={clientID}
                        buttonText="Sign up with Google"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookiePolicy={"single_host_policy"}
                    />
                    </form>
                </div>
            </div>
        </>
    )
}

