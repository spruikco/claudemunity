"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

interface Space {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  _count?: {
    channels: number
    threads: number
  }
}

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  })

  const fetchSpaces = async () => {
    try {
      const response = await fetch("/api/spaces")
      if (response.ok) {
        const data = await response.json()
        setSpaces(data)
      }
    } catch (error) {
      console.error("Failed to fetch spaces:", error)
    }
  }

  useEffect(() => {
    fetchSpaces()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/spaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: "", description: "", icon: "" })
        setIsOpen(false)
        fetchSpaces()
      }
    } catch (error) {
      console.error("Failed to create space:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Manage Spaces</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage community spaces
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Space
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Space</DialogTitle>
              <DialogDescription>
                Add a new space to organize your community discussions.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="General Discussion"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="A place for general discussions"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (emoji)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="💬"
                    maxLength={2}
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Space"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {spaces.map((space) => (
          <Card key={space.id}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                {space.icon && <span className="text-2xl">{space.icon}</span>}
                <div>
                  <CardTitle className="text-lg">{space.name}</CardTitle>
                  {space.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {space.description}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            {space._count && (
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {space._count.channels} channels • {space._count.threads}{" "}
                  threads
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {spaces.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No spaces yet. Create your first space!
          </p>
        </div>
      )}
    </div>
  )
}
