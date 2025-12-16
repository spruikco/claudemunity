"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { MessageList } from "@/components/channels/MessageList"
import { MessageInput } from "@/components/channels/MessageInput"

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

interface Channel {
  id: string
  name: string
  description: string | null
}

export default function ChannelPage() {
  const params = useParams()
  const [channel, setChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchChannel = async () => {
    try {
      const response = await fetch(`/api/spaces/${params.slug}`)
      const space = await response.json()
      const foundChannel = space.channels?.find(
        (c: Channel) => c.name.toLowerCase().replace(/\s+/g, "-") === params.channel
      )
      if (foundChannel) {
        setChannel(foundChannel)
      }
    } catch (error) {
      console.error("Failed to fetch channel:", error)
    }
  }

  const fetchMessages = async () => {
    if (!channel) return

    try {
      const response = await fetch(`/api/channels/${channel.id}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchChannel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug, params.channel])

  useEffect(() => {
    if (channel) {
      fetchMessages()

      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000)
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Channel not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold"># {channel.name}</h1>
        {channel.description && (
          <p className="text-muted-foreground text-sm mt-1">
            {channel.description}
          </p>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <MessageList messages={messages} />
        </div>
        <div className="border-t p-4">
          <MessageInput channelId={channel.id} onMessageSent={fetchMessages} />
        </div>
      </Card>
    </div>
  )
}
