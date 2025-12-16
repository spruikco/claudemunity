import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...")

  // Create admin user
  const adminPassword = await hash("password123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: adminPassword,
      displayName: "Admin User",
      username: "admin",
      role: "ADMIN",
      bio: "Platform administrator",
    },
  })
  console.log("Created admin user:", admin.email)

  // Create regular users
  const user1Password = await hash("password123", 12)
  const user1 = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      passwordHash: user1Password,
      displayName: "John Doe",
      username: "johndoe",
      bio: "Just a regular community member",
    },
  })
  console.log("Created user:", user1.email)

  const user2Password = await hash("password123", 12)
  const user2 = await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      email: "jane@example.com",
      passwordHash: user2Password,
      displayName: "Jane Smith",
      username: "janesmith",
      bio: "Developer and tech enthusiast",
    },
  })
  console.log("Created user:", user2.email)

  // Create spaces
  const generalSpace = await prisma.space.upsert({
    where: { slug: "general" },
    update: {},
    create: {
      name: "General",
      slug: "general",
      description: "General discussions and announcements",
      icon: "💬",
      sortOrder: 0,
    },
  })
  console.log("Created space:", generalSpace.name)

  const introSpace = await prisma.space.upsert({
    where: { slug: "introductions" },
    update: {},
    create: {
      name: "Introductions",
      slug: "introductions",
      description: "Introduce yourself to the community",
      icon: "👋",
      sortOrder: 1,
    },
  })
  console.log("Created space:", introSpace.name)

  const techSpace = await prisma.space.upsert({
    where: { slug: "tech-talk" },
    update: {},
    create: {
      name: "Tech Talk",
      slug: "tech-talk",
      description: "Discuss technology, programming, and development",
      icon: "💻",
      sortOrder: 2,
    },
  })
  console.log("Created space:", techSpace.name)

  const offTopicSpace = await prisma.space.upsert({
    where: { slug: "off-topic" },
    update: {},
    create: {
      name: "Off Topic",
      slug: "off-topic",
      description: "Anything goes! Non-tech discussions welcome",
      icon: "🎉",
      sortOrder: 3,
    },
  })
  console.log("Created space:", offTopicSpace.name)

  // Create channels for General space
  const generalChannel = await prisma.channel.upsert({
    where: { spaceId_slug: { spaceId: generalSpace.id, slug: "general" } },
    update: {},
    create: {
      name: "general",
      slug: "general",
      description: "General chat",
      spaceId: generalSpace.id,
    },
  })

  const announcementsChannel = await prisma.channel.upsert({
    where: { spaceId_slug: { spaceId: generalSpace.id, slug: "announcements" } },
    update: {},
    create: {
      name: "announcements",
      slug: "announcements",
      description: "Important announcements",
      spaceId: generalSpace.id,
    },
  })
  console.log("Created channels for General space")

  // Create channels for Tech Talk space
  const helpChannel = await prisma.channel.upsert({
    where: { spaceId_slug: { spaceId: techSpace.id, slug: "help" } },
    update: {},
    create: {
      name: "help",
      slug: "help",
      description: "Get help with tech problems",
      spaceId: techSpace.id,
    },
  })

  const showoffChannel = await prisma.channel.upsert({
    where: { spaceId_slug: { spaceId: techSpace.id, slug: "show-off" } },
    update: {},
    create: {
      name: "show-off",
      slug: "show-off",
      description: "Show off your projects",
      spaceId: techSpace.id,
    },
  })
  console.log("Created channels for Tech Talk space")

  // Create sample messages
  await prisma.channelMessage.create({
    data: {
      content: "Welcome to the community! Feel free to introduce yourself.",
      channelId: generalChannel.id,
      userId: admin.id,
    },
  })

  await prisma.channelMessage.create({
    data: {
      content: "Hi everyone! Excited to be here!",
      channelId: generalChannel.id,
      userId: user1.id,
    },
  })

  await prisma.channelMessage.create({
    data: {
      content: "Hello! Looking forward to connecting with you all.",
      channelId: generalChannel.id,
      userId: user2.id,
    },
  })
  console.log("Created sample messages")

  // Create sample threads
  const welcomeThread = await prisma.thread.create({
    data: {
      title: "Welcome to the Community Platform!",
      content:
        "Welcome everyone! We're excited to have you here. This is a place for meaningful discussions and connections. Please read the community guidelines and introduce yourself in the Introductions space!",
      spaceId: generalSpace.id,
      userId: admin.id,
    },
  })

  await prisma.threadReply.create({
    data: {
      content: "Thanks for creating this platform! It looks great.",
      threadId: welcomeThread.id,
      userId: user1.id,
    },
  })

  await prisma.thread.update({
    where: { id: welcomeThread.id },
    data: {
      replyCount: 1,
      lastActivityAt: new Date(),
    },
  })

  const introThread = await prisma.thread.create({
    data: {
      title: "Hey everyone, I'm John!",
      content:
        "Just wanted to introduce myself. I'm a software developer passionate about building great products. Looking forward to connecting with you all!",
      spaceId: introSpace.id,
      userId: user1.id,
    },
  })

  await prisma.threadReply.create({
    data: {
      content: "Welcome John! Great to have you here.",
      threadId: introThread.id,
      userId: admin.id,
    },
  })

  await prisma.threadReply.create({
    data: {
      content: "Hi John! I'm Jane, nice to meet you!",
      threadId: introThread.id,
      userId: user2.id,
    },
  })

  await prisma.thread.update({
    where: { id: introThread.id },
    data: {
      replyCount: 2,
      lastActivityAt: new Date(),
    },
  })

  const techThread = await prisma.thread.create({
    data: {
      title: "What's your favorite programming language?",
      content:
        "Curious to know what everyone's favorite programming language is and why. I'll start: I love TypeScript for its type safety and great tooling support!",
      spaceId: techSpace.id,
      userId: user2.id,
    },
  })

  await prisma.threadReply.create({
    data: {
      content:
        "I'm a big fan of Python! It's so versatile and has amazing libraries.",
      threadId: techThread.id,
      userId: user1.id,
    },
  })

  await prisma.thread.update({
    where: { id: techThread.id },
    data: {
      replyCount: 1,
      lastActivityAt: new Date(),
    },
  })

  console.log("Created sample threads and replies")

  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
