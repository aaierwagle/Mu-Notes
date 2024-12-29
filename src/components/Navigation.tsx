'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import LoginForm from './LoginForm'

export default function Navigation() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-7">
            <Link href="/" className="flex items-center py-4 px-2">
              <span className="font-semibold text-gray-500 text-lg">
                Your Logo
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {status === 'authenticated' ? (
              <>
                <Link
                  href="/profile"
                  className="py-2 px-4 text-gray-500 hover:text-gray-700"
                >
                  Profile
                </Link>
                {session.user.role === 'admin' && (
                  <>
                    <Link
                      href="/admin/Assignments"
                      className="py-2 px-4 text-gray-500 hover:text-gray-700"
                    >
                      Assignments
                    </Link>
                    <Link
                      href="/admin/Notes"
                      className="py-2 px-4 text-gray-500 hover:text-gray-700"
                    >
                      Notes
                    </Link>
                  </>
                )}
                <button
                  onClick={() => signOut()}
                  className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <LoginForm/>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 