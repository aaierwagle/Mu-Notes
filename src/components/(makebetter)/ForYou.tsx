'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, FileText, Eye } from 'lucide-react'
import Link from 'next/link'
import LoginForm from '../LoginForm'
import Favourite from './Favourite '

interface ContentItem {
  _id: string
  title: string
  description: string
  subject: string
  semester: number
  fileUrl: string
  fileType: string
}

interface ApiResponse {
  notes: ContentItem[]
  assignments: ContentItem[]
}

const handlePreview = (fileUrl: string) => {
  window.open(fileUrl, "_blank");
};


export default function PersonalizedContent() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/personalize')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result: ApiResponse = await response.json()
        setData(result)
      } catch (err) {
        setError('An error occurred while fetching data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const renderContent = (items: ContentItem[], icon: React.ReactNode) => (
    <ScrollArea className="w-full whitespace-nowrap rounded-xl border bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex w-max space-x-4 p-4">
        {items.map((item) => (
          <Card key={item._id} className="w-[300px] shrink-0 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
            <CardHeader className="p-0">
              <AspectRatio ratio={16 / 9}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-10" />
                <Image
                  src="/placeholder.svg?height=225&width=400"
                  alt={item.title}
                  width={400}
                  height={225}
                  className="object-cover"
                />
              </AspectRatio>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                {icon}
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </div>
              <div className="text-sm font-medium text-primary mb-1">{item.subject}</div>
              <div className="text-xs text-muted-foreground mb-2">Semester {item.semester}</div>
              <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
            </CardContent>
            <CardFooter className="p-4 flex justify-between bg-gray-50 dark:bg-gray-700">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePreview(item.fileUrl)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Favourite itemId={item._id} type={items === data?.notes ? "note" : "assignment"} />
            </CardFooter>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )

  const renderSkeleton = () => (
    <div className="flex space-x-4 overflow-x-auto py-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="w-[300px] shrink-0">
          <CardHeader className="p-0">
            <AspectRatio ratio={16 / 9}>
              <Skeleton className="h-full w-full" />
            </AspectRatio>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
          <CardFooter className="p-4 flex justify-between">
            <Skeleton className="h-8 w-[45%]" />
            <Skeleton className="h-8 w-[45%]" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 space-y-8">
          <div>
            <Skeleton className="h-10 w-48 mb-4" />
            {renderSkeleton()}
          </div>
          <div>
            <Skeleton className="h-10 w-64 mb-4" />
            {renderSkeleton()}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center  text-center py-12">
      <FileText className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Login For Get Persanalize Notes And Assignments</h2>
        <p className="text-muted-foreground">One Step Away to get Persalize notes and Assignments</p>
        <LoginForm/> 
      </div>
    )
  }

  if (!data || (data.notes.length === 0 && data.assignments.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <FileText className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">To Get Persanalize Notes And Assignments</h2>
        <p className="text-muted-foreground">Add Your Semester from Profile By Click Here </p>
      <Link href="/profile"> <Button>Profile</Button> </Link> 
      </div>
    )
  }

  return (
    <section className="py-12 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 space-y-12">
        {data.notes.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center">
              <BookOpen className="w-8 h-8 mr-2 text-primary" />
              Latest Notes
            </h2>
            {renderContent(data.notes, <BookOpen className="w-5 h-5 text-primary" />)}
          </div>
        )}
        {data.assignments.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center">
              <FileText className="w-8 h-8 mr-2 text-secondary" />
              Latest Assignments
            </h2>
            {renderContent(data.assignments, <FileText className="w-5 h-5 text-secondary" />)}
          </div>
        )}
      </div>
    </section>
  )
}

