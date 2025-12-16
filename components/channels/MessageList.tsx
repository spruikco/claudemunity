"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface Message {
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

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No messages yet. Start the conversation!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const initials = message.user.displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()

        return (
          <div key={message.id} className="flex space-x-3">
            <Avatar>
              <AvatarImage src={message.user.avatarUrl || ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm">
                  {message.user.displayName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}
