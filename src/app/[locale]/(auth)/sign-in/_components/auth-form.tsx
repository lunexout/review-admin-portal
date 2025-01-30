'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export const AuthForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>

        {/* Custom Email & Password Login Form */}
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full mt-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled
          />
        </div>

        <div className="mb-6">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled
          />
        </div>

        <Button className="w-full mb-4" disabled>
          Login
        </Button>

        {/* Google Login Button */}
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              signIn('google', {
                redirect: true,
                callbackUrl: '/admin/businesses'
              })
            }
          >
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  )
}
