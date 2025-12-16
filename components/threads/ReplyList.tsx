import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

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

interface ReplyListProps {
  replies: Reply[]
}

export function ReplyList({ replies }: ReplyListProps) {
  if (replies.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No replies yet. Be the first to reply!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {replies.map((reply) => {
        const initials = reply.user.displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()

        return (
          <div key={reply.id} className="flex space-x-4">
            <Avatar>
              <AvatarImage src={reply.user.avatarUrl || ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{reply.user.displayName}</span>
                <span className="text-sm text-muted-foreground">
                  @{reply.user.username}
                </span>
                <span className="text-sm text-muted-foreground">
                  •{" "}
                  {formatDistanceToNow(new Date(reply.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
