'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaGoogle } from 'react-icons/fa'

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  
  const handleGoogleSignIn = async () => {
    const response = await signIn('google', {
      redirect: false,
    })

    if (response?.error) {
      setError('Error signing in with Google')
    } else {
      router.push('/') // Redirect to dashboard after login
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={handleGoogleSignIn} className="mt-4 flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
        <FaGoogle className="h-5 w-5" />
        <span>Log in with Google</span>
      </button>
    </div>
  )
} 