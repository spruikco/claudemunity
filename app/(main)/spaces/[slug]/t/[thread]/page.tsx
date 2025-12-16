"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReplyList } from "@/components/threads/ReplyList"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { Label } from "@/components/ui/label"

interface Thread {
  id: string
  title: string
  content: string
  createdAt: string
  replyCount: number
  user: {
    id: string
    displayName: string
    username: string
    avatarUrl: string | null
  }
  space: {
    id: string
    name: string
    slug: string
  }
}

interface Reply {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    displayName: string
    username: string
    avatarUrl: string | null
  }
}

export default function ThreadPage() {
  const params = useParams()
  const router = useRouter()
  const [thread, setThread] = useState<Thread | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [replyContent, setReplyContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchThread = async () => {
    try {
      const response = await fetch(`/api/threads/${params.thread}`)
      if (response.ok) {
        const data = await response.json()
        setThread(data)
      }
    } catch (error) {
      console.error("Failed to fetch thread:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReplies = async () => {
    try {
      const response = await fetch(`/api/threads/${params.thread}/replies`)
      if (response.ok) {
        const data = await response.json()
        setReplies(data)
      }
    } catch (error) {
      console.error("Failed to fetch replies:", error)
    }
  }

  useEffect(() => {
    fetchThread()
    fetchReplies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.thread])

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyContent.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/threads/${params.thread}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: replyContent }),
      })

      if (response.ok) {
        setReplyContent("")
        await fetchReplies()
        await fetchThread()
      }
    } catch (error) {
      console.error("Failed to submit reply:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Thread not found</p>
      </div>
    )
  }

  const authorInitials = thread.user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push(`/spaces/${params.slug}`)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to {thread.space.name}
      </Button>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">{thread.title}</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Avatar>
              <AvatarImage src={thread.user.avatarUrl || ""} />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{thread.user.displayName}</span>
                <span className="text-sm text-muted-foreground">
                  @{thread.user.username}
                </span>
                <span className="text-sm text-muted-foreground">
                  •{" "}
                  {formatDistanceToNow(new Date(thread.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{thread.content}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {thread.replyCount} {thread.replyCount === 1 ? "Reply" : "Replies"}
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <ReplyList replies={replies} />

          <form onSubmit={handleSubmitReply} className="space-y-4 pt-6 border-t">
            <div className="space-y-2">
              <Label htmlFor="reply">Your Reply</Label>
              <textarea
                id="reply"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" disabled={isSubmitting || !replyContent.trim()}>
              {isSubmitting ? "Submitting..." : "Submit Reply"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
