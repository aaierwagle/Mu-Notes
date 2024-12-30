"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Mail, User, GraduationCap, Edit, RefreshCcw, Loader2, X, Check } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Image from 'next/image'

interface UserData {
  email: string
  name: string
  semester: string
  department?: string
  studentId?: string
  joinedDate?: string
  image?: string
}

interface ProfileFieldProps {
  icon: React.ElementType
  label: string
  value: string
  isEditing: boolean
  onValueChange: (value: string) => void
  error?: string
  children?: React.ReactNode
}

const ProfileField = ({
  icon: Icon,
  label,
  value,
  isEditing,
  onValueChange,
  error,
  children
}: ProfileFieldProps) => (
  <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <Label className="text-sm text-muted-foreground">{label}</Label>
    </div>
    {isEditing ? (
      <div>
        {label === 'Semester' ? (
          <select 
            value={value} 
            onChange={(e) => onValueChange(e.target.value)} 
            className="mt-2 p-2 border rounded"
          >
            <option value="">Select Semester</option>
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
            <option value="3rd Semester">3rd Semester</option>
            <option value="4th Semester">4th Semester</option>
            <option value="5th Semester">5th Semester</option>
            <option value="6th Semester">6th Semester</option>
            <option value="7th Semester">7th Semester</option>
            <option value="8th Semester">8th Semester</option>
          </select>
        ) : (
          <Input
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        )}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        {children}
      </div>
    ) : (
      <>
        <p className="font-medium">{value}</p>
        {children}
      </>
    )}
  </div>
)

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
    {[1, 2, 3, 4].map((i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
)

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [editedData, setEditedData] = useState<UserData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const fetchUserProfile = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/profile')
      if (!response.ok) throw new Error('Failed to fetch user profile')

      const data = await response.json()
      setUserData(data)
      setEditedData(data)
    } catch (err: unknown) {  // Changed to 'unknown' to be more type-safe
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!editedData?.name?.trim()) errors.name = 'Name is required'
    if (!editedData?.email?.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(editedData.email)) errors.email = 'Invalid email format'
    if (!editedData?.semester?.trim()) errors.semester = 'Semester is required'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      })
      if (!response.ok) throw new Error('Failed to update profile')

      const updatedData = await response.json()
      setUserData(updatedData)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (err: unknown) {  // Changed to 'unknown' to be more type-safe
      if (err instanceof Error) {
        toast.error('Failed to update profile')
        setError(err.message)
      } else {
        toast.error('An unexpected error occurred')
        setError('An unexpected error occurred')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedData(userData)
    setIsEditing(false)
    setValidationErrors({})
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingSkeleton />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !isEditing) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button variant="outline" size="sm" className="mt-4" onClick={fetchUserProfile}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Alert>
      </div>
    )
  }

  if (!userData || !editedData) return null

  return (
    <motion.div className="max-w-7xl mx-auto p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  {userData.image ? (
                    <Image
                      src={userData.image}
                      alt={userData.name}
                      className="h-full w-full rounded-full object-cover"
                      width={96}  // 24 * 4 for better optimization
                      height={96} // 24 * 4 for better optimization
                      priority // Adds priority loading for images above the fold
                    />
                  ) : (
                    <User className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl">{userData.name}</CardTitle>
                <p className="text-muted-foreground">{userData.studentId}</p>
              </div>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <ProfileField
              icon={Mail}
              label="Email"
              value={editedData.email}
              isEditing={isEditing}
              onValueChange={(value) => setEditedData({ ...editedData, email: value })}
              error={validationErrors.email}
            />
            <ProfileField
              icon={GraduationCap}
              label="Semester"
              value={editedData.semester}
              isEditing={isEditing}
              onValueChange={(value) => setEditedData({ ...editedData, semester: value })}
              error={validationErrors.semester}
            >
              {/* Semester dropdown */}
            </ProfileField>
            {userData.department && (
              <ProfileField
                icon={User}
                label="Department"
                value={editedData.department || ''}
                isEditing={isEditing}
                onValueChange={(value) => setEditedData({ ...editedData, department: value })}
                error={validationErrors.department}
              />
            )}
          </div>
          {userData.joinedDate && (
            <p className="text-sm text-muted-foreground mt-6">
              Member since {new Date(userData.joinedDate).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default Profile
