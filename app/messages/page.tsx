"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plane, Search, Send, Phone, Video, MoreVertical, Paperclip, Smile, ImageIcon, MapPin } from "lucide-react"

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [newMessage, setNewMessage] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Emma Rodriguez",
      lastMessage: "That sounds like an amazing itinerary! When are you planning to visit the temples?",
      time: "2h ago",
      unread: 2,
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
      destination: "Tokyo, Japan",
    },
    {
      id: 2,
      name: "Alex Chen",
      lastMessage: "I found this great yoga retreat in Ubud. Want to check it out together?",
      time: "5h ago",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
      destination: "Bali, Indonesia",
    },
    {
      id: 3,
      name: "Sophie Martin",
      lastMessage: "The hiking trails in Morocco look incredible! Are you experienced with mountain hiking?",
      time: "1d ago",
      unread: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
      destination: "Morocco",
    },
    {
      id: 4,
      name: "James Wilson",
      lastMessage: "Perfect! I'll book the ryokan for both of us then.",
      time: "2d ago",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
      destination: "Kyoto, Japan",
    },
  ]

  const messages = [
    {
      id: 1,
      senderId: 2,
      senderName: "Emma Rodriguez",
      content:
        "Hi! I saw your profile and we're both planning to visit Tokyo around the same time. Would love to connect!",
      timestamp: "10:30 AM",
      type: "text",
    },
    {
      id: 2,
      senderId: 1,
      senderName: "You",
      content: "Hey Emma! That's awesome! I'm planning to be there from March 15-25. What about you?",
      timestamp: "10:45 AM",
      type: "text",
    },
    {
      id: 3,
      senderId: 2,
      senderName: "Emma Rodriguez",
      content:
        "Perfect timing! I'll be there March 16-24. I'm really excited about visiting the traditional temples and trying authentic ramen.",
      timestamp: "11:00 AM",
      type: "text",
    },
    {
      id: 4,
      senderId: 1,
      senderName: "You",
      content:
        "That sounds amazing! I've been researching some great temple routes. Have you heard of the Golden Pavilion in Kyoto?",
      timestamp: "11:15 AM",
      type: "text",
    },
    {
      id: 5,
      senderId: 2,
      senderName: "Emma Rodriguez",
      content: "/placeholder.svg?height=200&width=300",
      timestamp: "11:20 AM",
      type: "image",
    },
    {
      id: 6,
      senderId: 2,
      senderName: "Emma Rodriguez",
      content: "Yes! I've been dreaming of visiting Kinkaku-ji. Look at this photo I found - isn't it breathtaking?",
      timestamp: "11:21 AM",
      type: "text",
    },
    {
      id: 7,
      senderId: 1,
      senderName: "You",
      content:
        "Wow, that's absolutely stunning! We should definitely plan a day trip to Kyoto together. I was thinking we could also check out some local food markets.",
      timestamp: "11:30 AM",
      type: "text",
    },
    {
      id: 8,
      senderId: 2,
      senderName: "Emma Rodriguez",
      content: "That sounds like an amazing itinerary! When are you planning to visit the temples?",
      timestamp: "2h ago",
      type: "text",
    },
  ]

  const currentChat = conversations.find((conv) => conv.id === selectedChat)

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">travel.W.me</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Messages</span>
                  <Badge variant="secondary">{conversations.filter((c) => c.unread > 0).length}</Badge>
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="space-y-1">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedChat(conversation.id)}
                        className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedChat === conversation.id ? "bg-blue-50 border-r-2 border-blue-600" : ""
                        }`}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {conversation.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 truncate">{conversation.name}</h4>
                            <span className="text-xs text-gray-500">{conversation.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                            {conversation.unread > 0 && (
                              <Badge className="bg-blue-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{conversation.destination}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={currentChat?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {currentChat?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{currentChat?.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Online</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{currentChat?.destination}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[calc(100vh-400px)] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 1 ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[70%] ${message.senderId === 1 ? "order-2" : "order-1"}`}>
                          {message.senderId !== 1 && (
                            <div className="flex items-center space-x-2 mb-1">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={currentChat?.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {currentChat?.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500">{message.senderName}</span>
                            </div>
                          )}
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.senderId === 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {message.type === "image" ? (
                              <img
                                src={message.content || "/placeholder.svg"}
                                alt="Shared image"
                                className="rounded-lg max-w-full h-auto"
                              />
                            ) : (
                              <p className="text-sm">{message.content}</p>
                            )}
                          </div>
                          <div
                            className={`text-xs text-gray-500 mt-1 ${message.senderId === 1 ? "text-right" : "text-left"}`}
                          >
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
