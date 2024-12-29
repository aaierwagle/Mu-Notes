"use client";

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [cookies, setCookies] = useState<string[][]>([]);

  useEffect(() => {
    const cookiesArray = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    setCookies(cookiesArray);
  }, []);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    redirect('/');
  }

  if (!session?.user) {
    return <div>No session data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Session Information</h2>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-gray-500">User Details</h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{session.user.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{session.user.email}</p>
                </div>
                {session.user.role && (
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium">{session.user.role}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Session Details</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Session ID</p>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded mt-1 break-all">
                  {session.user?.id || 'Not available'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Cookies</h3>
              <div className="mt-2">
                <ul className="list-disc pl-5">
                  {cookies.map((cookie, index) => (
                    <li key={index}>{cookie[0]}: {cookie[1]}</li>
                  ))}
                </ul>
              </div>
            </div>

            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
