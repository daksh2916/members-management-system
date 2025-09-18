# 🏛 Solis Backend API Documentation

## Project Overview

Solis Backend is a **NestJS** application for **membership and event management**.

It supports:
- Multi-step member creation: personal → membership → business → banking.
- Temporary storage of draft data using **Redis**.
- Final storage in **PostgreSQL**.
- Event creation and member registration.
- Validation, authentication, and authorization.

---

## 🛠 Project Setup with Docker

Instead of manually running `npm install` and `npm run start`, you can build and run the project using **Docker Compose**:

### Docker Compose Setup

1. Build all services (Postgres, Redis, NestJS app):

    ```bash
    docker compose build
    ```

2. Start all services in detached mode:

    ```bash
    docker compose up -d
    ```

- **Backend URL:** [http://localhost:3000](http://localhost:3000/)
- **Redis:** Port 6379
- **Postgres:** Port 5432

---

## Docker Setup for S3 Credentials

To integrate **Amazon S3** for file storage (profilePic, panPhoto, aadharPhoto), follow these steps:

1. Create a `.env` file in your project root with the following AWS credentials:

```env
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket-name

> Docker ensures all services start consistently with the correct environment.

---

## 🗄 Database Schema Overview

### Member
- Stores personal information like name, mobile, email, etc.
- Related tables: `MembershipInfo`, `BusinessInfo`, `BankingInfo`, `MemberEvent`.

### MembershipInfo
- Stores membership details like type (GOLD, PLATINUM, TITANIUM), registration date, validity, etc.
- Linked to a **Member** via `memberId`.

### BusinessInfo
- Stores business-related information like company name, category, designation, etc.
- Linked to a **Member** via `memberId`.

### BankingInfo
- Stores banking details like account number, bank name, IFSC code, etc.
- Linked to a **Member** via `memberId`.

---

## 🔑 API Endpoints

All endpoints require `Content-Type: application/json`.

### **Joi Validation**

All endpoints use **Joi** to validate request bodies. If required fields are missing or data is invalid, you will receive a **400 Bad Request** error with a descriptive message.

---

# 🏛 Solis Backend API Documentation

## API Endpoints

### 1. **Start Member Draft**
**POST** `/members/start`

### 2. **Save Personal Info**
**POST** `/members/:draftId/personal`

### 3. **Save Membership Info**
**POST** `/members/:draftId/membership`

### 4. **Save Business Info**
**POST** `/members/:draftId/business`

### 5. **Save Banking Info**
**POST** `/members/:draftId/banking`

### 6. **Complete Member Draft**
**POST** `/members/:draftId/complete`

### 7. **Get All Members**
**GET** `/members`

### 8. **Get Members by Membership Type**
**GET** `/members?type=GOLD`

### 9. **Events API**
- **Get Upcoming Events:** `/events/upcoming`
- **Get Current Events:** `/events/current`
- **Create Event:** `/events` (POST JSON body)
- **Get All Events:** `/events`
- **Get Event by ID:** `/events/:eventId`
- **Add Member to Event:** `/events/:eventId/add-member/:memberId`


