# Community Platform

A hybrid forum/chat community platform combining Discord-style channels with Discourse-style threaded discussions. Built with Next.js 14, PostgreSQL (Neon), and ready to deploy on Netlify.

## Features

- **Authentication**: Secure login and registration with NextAuth.js
- **Spaces**: Organized community spaces for different topics
- **Channels**: Real-time chat channels with message polling
- **Threads**: Forum-style discussions with replies
- **Member Profiles**: User profiles with activity history
- **Admin Panel**: Complete admin dashboard for managing content
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Hosting**: Netlify with CI/CD from GitHub

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database (sign up at https://neon.tech)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd community-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_neon_database_url_here
   NEXTAUTH_SECRET=your_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

   To generate a secure `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

4. **Initialize the database**
   ```bash
   npx prisma db push
   ```

5. **Seed the database with sample data**
   ```bash
   npx prisma db seed
   ```

   This creates:
   - Admin user: `admin@example.com` / `password123`
   - Sample users: `john@example.com` / `password123` and `jane@example.com` / `password123`
   - Sample spaces, channels, threads, and messages

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see your application.

## Deployment to Netlify

### Setup

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will auto-detect Next.js settings

3. **Configure environment variables in Netlify**

   Go to Site settings → Environment variables and add:
   ```
   DATABASE_URL=your_neon_database_url_here
   NEXTAUTH_SECRET=your_secret_here
   NEXTAUTH_URL=https://your-site.netlify.app
   ```

4. **Deploy**
   - Netlify will automatically deploy on every push to your main branch
   - Your site will be live at `https://your-site.netlify.app`

## Project Structure

```
community-platform/
├── app/                          # Next.js app directory
│   ├── (auth)/                  # Auth pages (login, register)
│   ├── (main)/                  # Main app layout
│   │   ├── spaces/              # Spaces and channels
│   │   ├── members/             # Member directory
│   │   ├── admin/               # Admin panel
│   │   └── settings/            # User settings
│   └── api/                     # API routes
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── layout/                  # Layout components
│   ├── spaces/                  # Space components
│   ├── channels/                # Channel components
│   ├── threads/                 # Thread components
│   └── members/                 # Member components
├── lib/                         # Utility functions
│   ├── prisma.ts               # Prisma client
│   ├── auth.ts                 # NextAuth config
│   └── utils.ts                # Utility functions
├── prisma/                      # Database
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
└── public/                      # Static files
```

## Default Credentials

After seeding the database, you can log in with:

- **Admin**: `admin@example.com` / `password123`
- **User 1**: `john@example.com` / `password123`
- **User 2**: `jane@example.com` / `password123`

⚠️ **Important**: Change these passwords in production!

## Key Features

### Spaces
Organize your community into different spaces (e.g., General, Tech Talk, Off Topic). Each space can contain:
- Multiple chat channels
- Forum-style discussion threads

### Channels
Real-time chat channels with:
- Message history
- Auto-polling every 5 seconds for new messages
- User avatars and timestamps

### Threads
Forum-style discussions with:
- Threaded replies
- Reply counts
- Last activity tracking
- Rich text content

### Admin Panel
Complete administrative control:
- Create and manage spaces
- View all users
- Platform statistics dashboard
- Content moderation tools

## Development

### Database Commands

```bash
# Push schema changes to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Run migrations (production)
npx prisma migrate deploy
```

### Build Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Customization

### Adding New Spaces

As an admin user:
1. Navigate to the Admin Panel
2. Click on "Spaces"
3. Click "Create Space"
4. Fill in the name, description, and icon

### Styling

The application uses Tailwind CSS with a custom theme. To customize:
- Edit `tailwind.config.ts` for theme changes
- Edit `app/globals.css` for CSS variables

## Security

- Passwords are hashed with bcryptjs
- Authentication handled by NextAuth.js
- Protected routes with middleware
- Role-based access control for admin features

## Support

For issues or questions:
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Check the [Prisma Documentation](https://www.prisma.io/docs)
- Check the [NextAuth Documentation](https://next-auth.js.org)

## License

MIT License - feel free to use this project for your own community! 
