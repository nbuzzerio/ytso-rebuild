import type { NextPage } from "next"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useState } from "react"
import signInSchema from '../../validations/signInSchema'
import signUpSchema from '../../validations/signUpSchema'

import { useUpdateAuth } from '../AuthContext/AuthContext'
import { useRouter } from "next/router"

type Props = yup.InferType<typeof signInSchema | typeof signUpSchema>
type User = {
  name?: string,
  email: string,
  password: string
}

const LoginForm: NextPage = () => {

  const [signUp, setSignUp] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showCnfrmPw, setShowCnfrmPw] = useState(false)

  const setAuth = useUpdateAuth();
  const router = useRouter()

  useEffect(() => {
    if (router.query?.signup) setSignUp(true)
    return () => { }
  }, [])

  function onSubmit(data) {
    let user: User = {
      email: data.email,
      password: data.password
    }
    if (signUp) user.name = data.name

    fetch(`http://localhost:3000/api/${signUp ? 'users' : 'auth'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }).then(res => {
      if (!res.ok) console.log('Respons status: ', res.status, res)
      return res.json()
    })
      .then(data => {
        if (data.error) setLoginError(data.error)
        else if (data.token) {
          document.cookie = `x-auth-token=${data.token}; expires=${new Date(new Date().setDate(new Date().getDate() + 30)).toUTCString()}`
          setAuth(data.token)
          router.push('/')
        }
      })
      .catch(er => console.log(er))
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Props>({
    resolver: yupResolver(signUp ? signUpSchema : signInSchema),
  })

  return (
    <div className="form-type w-10/12 lg:w-6/12 bg-zinc-400 my-20">
      <div className="header w-full flex justify-center items-center text-5xl py-10">{signUp ? 'Sign Up' : 'Sign In'}</div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col py-5 px-10'>
        {signUp && <div className="form-input-wrapper flex flex-col my-3">
          <input type="text" id="name" minLength={3} maxLength={50} placeholder="Name" {...register('name')} className={`p-3 ${errors["name"] ? 'bg-red-100' : ''}`} />
          <span className="text-red-600 text-center text-sm">
            {errors["name"]?.message}
          </span>
        </div>}
        <div className="form-input-wrapper flex flex-col my-3">
          <input type="text" id="email" minLength={3} maxLength={50} placeholder="Email" {...register('email')} className={`p-3 ${errors["email"] ? 'bg-red-100' : ''}`} />
          <span className="text-red-600 text-center text-sm">
            {errors["email"]?.message}
          </span>
        </div>
        <div className="form-input-wrapper relative flex flex-col my-3">
          <input type={showPw ? "text" : "password"} id="password" minLength={3} maxLength={50} placeholder="Password" {...register('password')} className={`p-3 ${errors["password"] ? 'bg-red-100' : ''}`} />
          <img src={`/images/eye-${showPw ? '' : 'off-'}filled.svg`} alt="eye-icon" className="eye-icon absolute w-8 py-2 right-3" onClick={() => { setShowPw(!showPw) }} />
          <span className="text-red-600 text-center text-sm">
            {errors["password"]?.message}
          </span>
        </div>
        {signUp && <div className="form-input-wrapper relative flex flex-col my-3">
          <input type={showCnfrmPw ? "text" : "password"} id="confirmPassword" minLength={3} maxLength={50} placeholder="Confirm Password" {...register('confirmPassword')} className={`p-3 ${errors["confirmPassword"] ? 'bg-red-100' : ''}`} />
          <img src={`/images/eye-${showCnfrmPw ? '' : 'off-'}filled.svg`} alt="eye-icon" className="eye-icon stroke-orange-900 absolute w-8 py-2 right-3" onClick={() => { setShowCnfrmPw(!showCnfrmPw) }} />
          <span className="text-red-600 text-center text-sm">
            {errors["confirmPassword"]?.message}
          </span>
        </div>}
        <span className="text-red-600 text-center text-sm">
          {loginError}
        </span>
        <input type="submit" value="submit" className="my-5 p-3 bg-white hover:bg-gray-800 hover:text-white" />
      </form>
      <div className="signup-wrapper flex justify-center">
        <input type="button" className={`signIn flex justify-center items-center p-10 border-transparent w-full ${!signUp ? 'pointer-events-none border-r-2' : 'border-t-2 cursor-pointer shadow-[inset_3px_0px_7px_#ccc8,inset_-4px_5px_5px_#ccc8]'}`} value="Sign In" onClick={() => { setSignUp(false) }} />
        <input type="button" className={`signUp flex justify-center items-center p-10 border-transparent w-full ${signUp ? 'pointer-events-none border-l-2' : 'border-t-2 cursor-pointer shadow-[inset_4px_5px_5px_#ccc8,inset_-3px_0px_7px_#ccc8]'}`} value="Sign Up" onClick={() => { setSignUp(true) }} />
      </div>
    </div>

  )
}


export default LoginForm