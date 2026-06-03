# 👔 E-commerce Clothing Store


<div align="center">
  <img src="public/imgs/Imagen1.png" alt="Homepage Screenshot" width="45%" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="public/imgs/Imagen2.png" alt="Admin Panel Screenshot" width="45%" />
    &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="public/imgs/Imagen3.png" alt="Admin Panel Screenshot" width="45%" />
</div>
<br />


A modern, full-stack e-commerce platform for clothing retail built with Next.js, featuring a comprehensive admin panel for inventory management and integrated PayPal payment processing.

## 🚀 Features

- **Product Catalog**: Browse and search through clothing collections
- **Shopping Cart**: Add, remove, and update items in cart
- **User Authentication**: Secure login and registration system
- **Payment Integration**: Seamless checkout with PayPal
- **Admin Dashboard**: Complete inventory management system
  - Product CRUD operations
  - Order management
  - Stock control
  - Sales analytics
- **Responsive Design**: Mobile-first approach for all devices
- **Image Management**: Cloud-based image storage with Cloudinary

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) - React framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Relational database
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Media Storage**: [Cloudinary](https://cloudinary.com/) - Cloud-based image management
- **Payments**: [PayPal](https://www.paypal.com/) - Payment processing
- **Containerization**: [Docker](https://www.docker.com/) - Development environment

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose
- Git

## 🔧 Installation & Setup

### Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/camiloAVN/E-commerce.git
   cd ecommerce-clothing
   ```

2. **Set up environment variables**
   
   Create a copy of `.env.template` and rename it to `.env`:
   ```bash
   cp .env.template .env
   ```
   
   Update the variables in `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   
   # PayPal
   PAYPAL_CLIENT_ID="your-client-id"
   PAYPAL_CLIENT_SECRET="your-client-secret"
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the database with Docker**
   ```bash
   docker compose up -d
   ```

5. **Run Prisma migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database**
   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Clear browser localStorage**
   
   Open your browser's developer tools and clear the localStorage to ensure a clean start.

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (shop)/            # Public shop routes
│   ├── admin/             # Admin panel routes
│   └── api/               # API routes
├── components/            # React components
├── prisma/               # Database schema and migrations
│   ├── migrations/       # Database migrations
│   └── schema.prisma     # Prisma schema
├── public/               # Static files
│   └── img/             # Images
├── lib/                  # Utility functions and configurations
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── docker-compose.yml    # Docker configuration
```

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:
- **User**: Customer and admin accounts
- **Product**: Clothing items with variations
- **Order**: Purchase records
- **Category**: Product categorization
- **Cart**: Shopping cart management

## 🔐 Admin Panel

Access the admin panel at `/admin` with administrator credentials.

Features include:
- Product management (CRUD operations)
- Order processing and tracking
- Inventory control
- User management
- Sales reports and analytics

## 💳 Payment Integration

PayPal integration allows for:
- Secure payment processing
- Order confirmation
- Refund management
- Transaction history

## 🖼️ Image Management

Cloudinary integration provides:
- Automatic image optimization
- Responsive image delivery
- Image transformations
- CDN distribution

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:studio` - Open Prisma Studio

## 🐳 Docker Commands

- `docker compose up -d` - Start containers in detached mode
- `docker compose down` - Stop and remove containers
- `docker compose logs -f` - View container logs
- `docker compose ps` - List running containers

## 🚀 Deployment

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Start the production server:
   ```bash
   npm start
   ```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the powerful ORM
- All contributors and open-source maintainers

Made with ❤️ by camiloAVN