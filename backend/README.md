# Jewelcca Backend API

A comprehensive Java Spring Boot backend for the Jewelcca online jewelry store with Docker support, PostgreSQL database, validation, and Razorpay payment gateway integration.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- User registration and login
- Password reset functionality
- Role-based access control (USER, ADMIN)

### 👤 User Management
- User profile management
- Password change functionality
- Admin user management

### 📦 Product Management
- Category management
- Product CRUD operations
- Product search and filtering
- Featured and top-rated products

### 🛒 Shopping Features
- Shopping cart management
- Wishlist functionality
- Order management
- Order tracking

### 💳 Payment & Orders
- Razorpay payment gateway integration
- Multiple payment methods (Card, UPI, COD)
- Order status tracking
- Order history
- Payment verification

### ⭐ Reviews & Ratings
- Product reviews and ratings
- Review management

### 🎁 Offers & Promotions
- Discount management
- Promotional codes
- Active offers

## 🛠 Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Database**: PostgreSQL 15
- **Security**: Spring Security with JWT
- **Payment Gateway**: Razorpay
- **Email**: Spring Mail
- **Containerization**: Docker & Docker Compose
- **Build Tool**: Maven
- **Java Version**: 17

## 🐳 Docker Setup

### Prerequisites
- Docker and Docker Compose installed
- Razorpay account for payment integration

### Quick Start with Docker

1. **Clone the repository**
```bash
git clone <repository-url>
cd jewelcca-backend
```

2. **Create environment file**
```bash
cp .env.example .env
```

3. **Update environment variables in .env**
```env
# Email Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

4. **Build and run with Docker Compose**
```bash
# Build the application
mvn clean package -DskipTests

# Start all services
docker-compose up -d
```

5. **Check service status**
```bash
docker-compose ps
```

The application will be available at:
- **Backend API**: http://localhost:9090
- **PostgreSQL**: localhost:5432

### Docker Services

- **postgres**: PostgreSQL 15 database with sample data
- **backend**: Spring Boot application

## 📊 Database Schema

The application automatically creates tables and populates sample data including:
- Categories (Rings, Necklaces, Earrings, Bracelets)
- Products with images, materials, and tags
- Offers and promotional codes

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register          - User registration
POST /api/auth/login             - User login
POST /api/auth/forgot-password   - Request password reset
POST /api/auth/reset-password    - Reset password
POST /api/auth/change-password   - Change password
```

### Products & Categories
```
GET    /api/categories           - Get all categories
GET    /api/products             - Get all products (paginated)
GET    /api/products/{id}        - Get product by ID
GET    /api/products/category/{slug} - Get products by category
GET    /api/products/search      - Search products
GET    /api/products/featured    - Get featured products
```

### Shopping Cart
```
GET    /api/cart                 - Get cart items
POST   /api/cart/add             - Add item to cart
PUT    /api/cart/update/{productId} - Update cart item
DELETE /api/cart/remove/{productId} - Remove from cart
DELETE /api/cart/clear           - Clear cart
```

### Orders
```
POST   /api/orders               - Create order
GET    /api/orders               - Get user orders
GET    /api/orders/{id}          - Get order by ID
```

### Payment
```
POST   /api/payment/create-order - Create Razorpay order
POST   /api/payment/verify       - Verify payment
POST   /api/payment/webhook      - Payment webhook
```

## 💳 Payment Integration

### Razorpay Setup

1. **Create Razorpay Account**
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
   - Get your Key ID and Key Secret from API Keys section

2. **Configure Webhook**
   - Go to Webhooks section in Razorpay Dashboard
   - Add webhook URL: `https://your-domain.com/api/payment/webhook`
   - Select events: `payment.captured`, `payment.failed`

3. **Update Environment Variables**
```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### Payment Flow

1. **Create Order**: Frontend calls `/api/payment/create-order`
2. **Razorpay Checkout**: Frontend opens Razorpay payment modal
3. **Payment Completion**: Razorpay calls success handler
4. **Verification**: Frontend calls `/api/payment/verify`
5. **Order Update**: Backend updates order status

## 🔒 Security Features

- JWT token-based authentication
- Password encryption using BCrypt
- Role-based authorization
- CORS configuration
- Input validation and sanitization
- SQL injection prevention

## 📧 Email Configuration

Configure SMTP settings for password reset emails:

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

For Gmail, use App Passwords instead of regular password.

## 🧪 Testing

```bash
# Run tests
mvn test

# Run with coverage
mvn test jacoco:report
```

## 📝 Validation

The application includes comprehensive validation:
- Bean Validation (JSR-303) annotations
- Custom validators for business rules
- Global exception handling
- Detailed error responses

## 🚀 Production Deployment

### Environment Variables for Production

```env
SPRING_PROFILES_ACTIVE=production
DB_HOST=your-production-db-host
DB_USERNAME=your-production-db-user
DB_PASSWORD=your-production-db-password
JWT_SECRET=your-super-secure-jwt-secret
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_live_key_secret
```

### Docker Production Build

```bash
# Build for production
mvn clean package -Pprod

# Build Docker image
docker build -t jewelcca-backend:latest .

# Run with production profile
docker run -d \
  --name jewelcca-backend \
  -p 8080:8080 \
  --env-file .env.prod \
  jewelcca-backend:latest
```

## 📊 Monitoring & Logging

- Application logs available in `/app/logs`
- Health check endpoint: `/actuator/health`
- Metrics endpoint: `/actuator/metrics`

## 🔧 Development

### Local Development Setup

1. **Install Prerequisites**
   - Java 17+
   - Maven 3.6+
   - PostgreSQL 15+

2. **Setup Database**
```sql
CREATE DATABASE jewelcca_db;
CREATE USER jewelcca_user WITH PASSWORD 'jewelcca_password';
GRANT ALL PRIVILEGES ON DATABASE jewelcca_db TO jewelcca_user;
```

3. **Run Application**
```bash
mvn spring-boot:run
```

### Hot Reload

```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "data": {...},
  "message": "Success",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": {...},
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🎯 Performance Optimization

- Database connection pooling
- JPA query optimization
- Caching for frequently accessed data
- Pagination for large datasets
- Async processing for email notifications

---

**Happy Coding! 💎✨**#   j e w e l c c a - b a c k e n d  
 