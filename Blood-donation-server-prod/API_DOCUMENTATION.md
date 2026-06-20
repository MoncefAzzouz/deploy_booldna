# Blood Donation System API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Enums & Data Types](#enums--data-types)
6. [User Endpoints](#user-endpoints)
7. [Admin CTS Management](#admin-cts-management)
8. [Blood Alerts](#blood-alerts)
9. [Donations](#donations)
10. [Questionnaires & Questions](#questionnaires--questions)
11. [Hospitals](#hospitals)
12. [Notifications](#notifications)
13. [Health Check](#health-check)

---

## Overview

The Blood Donation System API provides endpoints for managing blood donation operations including user registration, blood alerts, donation scheduling, and administrative functions.

**Base URL:** `http://localhost:3000/api/v1`

**API Version:** v1

---

## Authentication

### Authentication Types

#### 1. User Authentication

- **Header:** `Authorization: Bearer <user_token>`
- **Token Type:** JWT
- **Expiration:** 7 days
- **Required for:** User operations (donations, viewing alerts)

#### 2. Admin Authentication

- **Header:** `Authorization: Bearer <admin_token>`
- **Token Type:** JWT
- **Expiration:** 24 hours
- **Required for:** Administrative operations

#### 3. Super Admin Only

- **Special permission level for:** Hospital management, Admin CTS management
- **Role Required:** `super_admin`

---

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  },
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

---

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Responses

#### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Detailed validation errors",
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

#### Authentication Error (401)

```json
{
  "success": false,
  "message": "Access denied. No token provided.",
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

---

## Enums & Data Types

### Blood Groups

```
A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG
```

### Gender

```
male, female, other
```

### Admin Roles

```
super_admin, admin_cts
```

### Urgency Levels

```
low, medium, urgent
```

### Alert Status

```
active, recovered
```

### Donation Status

```
planned, confirmed, cancelled
```

---

## User Endpoints

### 1. User Registration

**POST** `/users/register`

Register a new user in the system. An email verification link will be sent to the user's email address.

#### Request Body

```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "phoneNumber": "+1234567890",
  "address": "123 Main Street, City",
  "bloodGroup": "O_POS",
  "birthDate": "1990-01-01T00:00:00.000Z",
  "gender": "male"
}
```

#### Validation Rules

- `fullName`: 3-100 characters
- `email`: Valid email format, must be unique
- `password`: Min 8 characters, must contain uppercase letter
- `phoneNumber`: 10-15 digits, optional + prefix
- `address`: 5-255 characters (optional)
- `bloodGroup`: Valid blood group enum
- `birthDate`: User must be 18-100 years old
- `gender`: Valid gender enum

#### Success Response (201)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 1,
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "bloodGroup": "O_POS",
    "gender": "male",
    "createdAt": "2024-12-17T10:30:00.000Z"
    // ... other user fields (password excluded)
  },
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 2. Verify Email

**GET** `/users/verify-email/:token`

**Authentication:** None required

Verify user's email address using the token sent to their email.

#### Path Parameters

- `token`: Email verification token (string)

#### Success Response (200)

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": null,
  "timestamp": "2026-01-03T10:30:00.000Z"
}
```

#### Error Responses

- `401` - Invalid or expired token
- `404` - User not found

### 3. User Login

**POST** `/users/login`

Authenticate user and receive access token. Email must be verified before login.

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "userId": 1,
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "bloodGroup": "O_POS"
      // ... other user fields
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

#### Error Responses

- `401` - Invalid credentials or email not verified

### 4. Change Password

**PATCH** `/users/:id/change-password`

**Authentication:** User token required

Change user's password.

#### Path Parameters

- `id`: User ID (integer)

#### Request Body

```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

#### Validation Rules

- `currentPassword`: Required
- `newPassword`: Min 8 characters, must contain uppercase letter
- `confirmPassword`: Must match newPassword

#### Success Response (200)

```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": true,
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

---

## Admin CTS Management

### 1. Admin Login

**POST** `/admins/cts/login`

Authenticate admin and receive access token.

#### Request Body

```json
{
  "email": "admin@example.com",
  "password": "AdminPass123"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Admin CTS logged in successfully",
  "data": {
    "resAdmin": {
      "adminId": 1,
      "fullName": "Admin Name",
      "email": "admin@example.com",
      "phone": "0123456789",
      "lastLoginAt": "2024-12-17T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 2. Verify Admin Email

**GET** `/admins/cts/verify-email/:token`

**Authentication:** None required

Verify admin's email address using the token sent to their email.

#### Path Parameters

- `token`: Email verification token (string)

#### Success Response (200)

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": null,
  "timestamp": "2026-01-03T10:30:00.000Z"
}
```

#### Error Responses

- `401` - Invalid or expired token
- `404` - Admin not found

### 3. Create Admin CTS

**POST** `/admins/cts`

**Authentication:** Super Admin only

Create a new admin CTS user. An email verification link will be sent to the admin's email address.

#### Request Body

```json
{
  "fullName": "New Admin",
  "email": "newadmin@example.com",
  "passwordHash": "SecurePass123",
  "phone": "0123456789",
  "employeeId": "EMP001"
}
```

#### Validation Rules

- `fullName`: 1-255 characters
- `email`: Valid email format, must be unique
- `passwordHash`: Min 8 characters
- `phone`: 10 digits starting with 0 (optional)
- `employeeId`: Max 50 characters (optional)

### 4. Get All Admin CTS

**GET** `/admins/cts`

**Authentication:** Super Admin only

Retrieve all admin CTS users.

#### Success Response (200)

```json
{
  "success": true,
  "message": "Admin CTS list retrieved successfully",
  "data": [
    {
      "adminId": 1,
      "fullName": "Admin Name",
      "email": "admin@example.com",
      "phone": "0123456789",
      "employeeId": "EMP001",
      "role": "admin_cts",
      "lastLoginAt": "2024-12-17T10:30:00.000Z",
      "activatedAt": "2024-12-17T10:30:00.000Z",
      "deactivatedAt": null,
      "createdAt": "2024-12-17T10:30:00.000Z",
      "updatedAt": "2024-12-17T10:30:00.000Z"
    }
  ],
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 5. Get Admin CTS by ID

**GET** `/admins/cts/:id`

**Authentication:** Super Admin only

#### Path Parameters

- `id`: Admin ID (integer)

### 6. Update Admin CTS

**PUT** `/admins/cts/:id`

**Authentication:** Super Admin only

#### Request Body

```json
{
  "fullName": "Updated Admin Name",
  "email": "updated@example.com",
  "phone": "0987654321",
  "employeeId": "EMP002"
}
```

### 7. Activate Admin CTS

**PATCH** `/admins/cts/:id/activate`

**Authentication:** Super Admin only

### 8. Deactivate Admin CTS

**PATCH** `/admins/cts/:id/deactivate`

**Authentication:** Super Admin only

### 9. Delete Admin CTS

**DELETE** `/admins/cts/:id`

**Authentication:** Super Admin only

Returns 204 No Content on success.

---

## Blood Alerts

### 1. Create Blood Alert

**POST** `/alerts/admin/:adminId`

**Authentication:** Admin token required

Create a new blood alert.

#### Path Parameters

- `adminId`: Admin ID creating the alert

#### Request Body

```json
{
  "hospitalId": 1,
  "bloodGroup": "O_NEG",
  "quantityUnits": 5,
  "urgencyLevel": "urgent",
  "description": "Emergency blood needed for surgery"
}
```

#### Validation Rules

- `hospitalId`: Positive integer (optional)
- `bloodGroup`: Valid blood group enum
- `quantityUnits`: 1-50 (default: 1)
- `urgencyLevel`: low/medium/urgent (default: medium)
- `description`: Max 1000 characters (optional)

#### Success Response (201)

```json
{
  "success": true,
  "message": "Blood alert created successfully",
  "data": {
    "alertId": 1,
    "hospitalId": 1,
    "bloodGroup": "O_NEG",
    "quantityUnits": 5,
    "urgencyLevel": "urgent",
    "status": "active",
    "description": "Emergency blood needed for surgery",
    "createdBy": 2,
    "createdAt": "2024-12-17T10:30:00.000Z",
    "hospital": {
      "hospitalId": 1,
      "name": "City Hospital",
      "address": "123 Hospital St"
    },
    "createdByAdmin": {
      "adminId": 2,
      "fullName": "Admin Name"
    }
  },
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 2. Get All Blood Alerts

**GET** `/alerts`

**Authentication:** User token required

Retrieve all active blood alerts.

#### Success Response (200)

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": [
    {
      "alertId": 1,
      "bloodGroup": "O_NEG",
      "quantityUnits": 5,
      "urgencyLevel": "urgent",
      "status": "active",
      "description": "Emergency blood needed",
      "createdAt": "2024-12-17T10:30:00.000Z",
      "hospital": {
        "hospitalId": 1,
        "name": "City Hospital"
      },
      "createdByAdmin": {
        "fullName": "Admin Name"
      }
    }
  ],
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 3. Get Blood Alert by ID

**GET** `/alerts/:id`

**Authentication:** User token required

#### Path Parameters

- `id`: Alert ID (integer)

#### Success Response (200)

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "alertId": 1,
    "bloodGroup": "O_NEG",
    "quantityUnits": 5,
    "urgencyLevel": "urgent",
    "status": "active",
    "description": "Emergency blood needed",
    "hospital": {
      "hospitalId": 1,
      "name": "City Hospital"
    },
    "createdByAdmin": {
      "fullName": "Admin Name"
    },
    "donations": [
      {
        "donationId": 1,
        "donationDate": "2024-12-18T10:00:00.000Z",
        "status": "planned",
        "user": {
          "fullName": "John Doe",
          "bloodGroup": "O_NEG"
        }
      }
    ]
  },
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 4. Update Blood Alert

**PUT** `/alerts/admin/:adminId`

**Authentication:** Admin token required

#### Request Body

```json
{
  "alertId": 1,
  "bloodGroup": "A_POS",
  "quantityUnits": 3,
  "urgencyLevel": "medium",
  "status": "recovered",
  "description": "Updated description"
}
```

### 5. Delete Blood Alert

**DELETE** `/alerts/:id`

**Authentication:** Admin token required

Performs soft delete (sets deletedAt timestamp).

---

## Donations

### 1. Create Donation

**POST** `/donations`

**Authentication:** User token required

Create a new donation appointment with optional health questionnaire responses.

#### Request Body

```json
{
  "userId": 1,
  "alertId": 1,
  "donationDate": "2024-12-18T10:00:00.000Z",
  "questionnaireCompleted": true,
  "questionnaireId": 1,
  "questionResponses": [
    {
      "questionId": 1,
      "answer": "yes"
    },
    {
      "questionId": 2,
      "answer": "I take insulin daily"
    }
  ],
  "notes": "Available in the morning"
}
```

#### Validation Rules

- `userId`: Positive integer (required)
- `alertId`: Positive integer (required)
- `donationDate`: Future datetime (required)
- `questionnaireCompleted`: Boolean (required)
- `questionnaireId`: Positive integer (optional) - Links donation to a questionnaire
- `questionResponses`: Array of response objects (optional)
  - `questionId`: Positive integer (required)
  - `answer`: String, 1-5000 characters (required)
- `notes`: Max 1000 characters (optional)

#### Business Rules

- User can only donate once every 3 months
- User must complete health questionnaire
- Only 1 unit per donation
- Question responses are stored separately for each donation
- All authenticated users can see questions
- Response submission is the user's responsibility

#### Success Response (201)

```json
{
  "success": true,
  "message": "Donation created successfully",
  "data": {
    "donationId": 1,
    "userId": 1,
    "alertId": 1,
    "donationDate": "2024-12-18T10:00:00.000Z",
    "quantityUnits": 1,
    "status": "planned",
    "questionnaireCompleted": true,
    "questionnaireId": 1,
    "createdAt": "2024-12-17T10:30:00.000Z",
    "user": {
      "userId": 1,
      "fullName": "John Doe",
      "bloodGroup": "O_POS"
    },
    "alert": {
      "alertId": 1,
      "bloodGroup": "O_POS",
      "urgencyLevel": "medium"
    },
    "questionnaire": {
      "questionnaireId": 1,
      "name": "Health Questionnaire",
      "description": "Pre-donation health screening"
    },
    "questionResponses": [
      {
        "responseId": 1,
        "questionId": 1,
        "answer": "yes",
        "question": {
          "questionId": 1,
          "question": "Are you in good health?",
          "questionType": "yes_no"
        }
      }
    ]
  },
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 2. Get All Donations

**GET** `/donations`

**Authentication:** Admin token required

Retrieve all donations.

### 3. Get Donation by ID

**GET** `/donations/:id`

**Authentication:** Admin token required

#### Path Parameters

- `id`: Donation ID (integer)

#### Success Response (200)

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "donationId": 1,
    "userId": 1,
    "alertId": 1,
    "donationDate": "2024-12-18T10:00:00.000Z",
    "quantityUnits": 1,
    "status": "planned",
    "questionnaireCompleted": true,
    "questionResponses": [
      {
        "responseId": 1,
        "questionId": 1,
        "answer": "yes",
        "question": {
          "questionId": 1,
          "question": "Are you in good health?"
        }
      }
    ]
  },
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 4. Get Donations by Alert ID

**GET** `/alert/:alertId/donations`

**Authentication:** Admin token required

Get all donations for a specific blood alert.

#### Path Parameters

- `alertId`: Alert ID (integer)

### 5. Update Donation (Admin)

**PUT** `/donations/admin/:adminId`

**Authentication:** Admin token required

Update donation status and details.

#### Path Parameters

- `adminId`: Admin ID performing the update

#### Request Body

```json
{
  "donationId": 1,
  "status": "confirmed",
  "notes": "Blood donation completed successfully"
}
```

#### Validation Rules

- `donationId`: Positive integer (required)
- `status`: planned/confirmed/cancelled (optional)
- `notes`: Max 1000 characters (optional)

### 6. Validate Donation (Admin)

**POST** `/donations/validate/:adminId`

**Authentication:** Admin token required

Validate and transition donation status.

#### Path Parameters

- `adminId`: Admin ID performing validation

#### Request Body

```json
{
  "donationId": 1,
  "status": "confirmed",
  "notes": "Validation passed"
}
```

#### Status Transitions

- `planned` → `confirmed`, `rejected`, `cancelled`
- `confirmed` → `rejected`, `cancelled`
- `rejected` → `planned`
- `cancelled` → `planned`

### 7. Delete Donation

**DELETE** `/donations/:id`

**Authentication:** User token required

---

## Questionnaires & Questions

### 1. Create Questionnaire

**POST** `/questionnaires`

**Authentication:** Admin token required (Super Admin)

Create a new health questionnaire.

#### Request Body

```json
{
  "name": "Pre-Donation Health Screening",
  "description": "Health screening questions before blood donation",
  "isActive": true
}
```

#### Validation Rules

- `name`: 3-255 characters (required)
- `description`: Max 1000 characters (optional)
- `isActive`: Boolean (default: true)

#### Success Response (201)

```json
{
  "success": true,
  "message": "Questionnaire created successfully",
  "data": {
    "questionnaireId": 1,
    "name": "Pre-Donation Health Screening",
    "description": "Health screening questions before blood donation",
    "isActive": true,
    "createdAt": "2024-12-17T10:30:00.000Z",
    "questions": []
  },
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 2. Get All Questionnaires

**GET** `/questionnaires`

**Authentication:** User token required (All authenticated users can view)

Retrieve all active questionnaires with their questions.

#### Success Response (200)

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": [
    {
      "questionnaireId": 1,
      "name": "Pre-Donation Health Screening",
      "description": "Health screening questions before blood donation",
      "isActive": true,
      "createdAt": "2024-12-17T10:30:00.000Z",
      "questions": [
        {
          "questionId": 1,
          "questionnaireId": 1,
          "question": "Are you in good health?",
          "questionType": "yes_no",
          "isRequired": true,
          "order": 1,
          "isActive": true
        }
      ]
    }
  ],
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 3. Get Questionnaire by ID

**GET** `/questionnaires/:questionnaireId`

**Authentication:** User token required

Get a specific questionnaire with all its questions.

#### Path Parameters

- `questionnaireId`: Questionnaire ID (integer)

### 4. Update Questionnaire

**PUT** `/questionnaires/:questionnaireId`

**Authentication:** Admin token required (Super Admin)

Update questionnaire details.

#### Path Parameters

- `questionnaireId`: Questionnaire ID (integer)

#### Request Body

```json
{
  "name": "Updated Questionnaire Name",
  "description": "Updated description",
  "isActive": false
}
```

---

### 5. Create Question

**POST** `/questions`

**Authentication:** Admin token required (Super Admin)

Add a new question to a questionnaire.

#### Request Body

```json
{
  "questionnaireId": 1,
  "question": "Do you have any chronic diseases?",
  "questionType": "yes_no",
  "options": null,
  "isRequired": true,
  "order": 2,
  "isActive": true
}
```

#### Validation Rules

- `questionnaireId`: Positive integer (required)
- `question`: 5-500 characters (required)
- `questionType`: "yes_no", "text", "multiple_choice" (default: "yes_no")
- `options`: JSON stringified array for multiple_choice type (optional)
- `isRequired`: Boolean (default: true)
- `order`: Integer >= 0 (default: 0) - Controls question display order
- `isActive`: Boolean (default: true)

#### Success Response (201)

```json
{
  "success": true,
  "message": "Question created successfully",
  "data": {
    "questionId": 1,
    "questionnaireId": 1,
    "question": "Do you have any chronic diseases?",
    "questionType": "yes_no",
    "options": null,
    "isRequired": true,
    "order": 2,
    "isActive": true,
    "createdAt": "2024-12-17T10:30:00.000Z",
    "updatedAt": "2024-12-17T10:30:00.000Z"
  },
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 6. Get All Questions

**GET** `/questions`

**Authentication:** User token required (All authenticated users can view)

Retrieve all active questions ordered by questionnaire and order.

#### Success Response (200)

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": [
    {
      "questionId": 1,
      "questionnaireId": 1,
      "question": "Are you in good health?",
      "questionType": "yes_no",
      "isRequired": true,
      "order": 1,
      "isActive": true,
      "questionnaire": {
        "questionnaireId": 1,
        "name": "Pre-Donation Health Screening"
      }
    }
  ],
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 7. Get Questions by Questionnaire

**GET** `/questionnaires/:questionnaireId/questions`

**Authentication:** User token required (All authenticated users can view)

Get all questions for a specific questionnaire.

#### Path Parameters

- `questionnaireId`: Questionnaire ID (integer)

#### Success Response (200)

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": [
    {
      "questionId": 1,
      "question": "Are you in good health?",
      "questionType": "yes_no",
      "isRequired": true,
      "order": 1,
      "isActive": true
    },
    {
      "questionId": 2,
      "question": "Do you have diabetes?",
      "questionType": "yes_no",
      "isRequired": true,
      "order": 2,
      "isActive": true
    }
  ],
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 8. Get Question by ID

**GET** `/questions/:questionId`

**Authentication:** User token required

Get a specific question with its questionnaire details.

#### Path Parameters

- `questionId`: Question ID (integer)

### 9. Update Question

**PUT** `/questions/:questionId`

**Authentication:** Admin token required (Super Admin)

Update question details.

#### Path Parameters

- `questionId`: Question ID (integer)

#### Request Body

```json
{
  "question": "Updated question text",
  "questionType": "text",
  "isRequired": false,
  "order": 3
}
```

### 10. Delete Question (Soft Delete)

**DELETE** `/questions/:questionId`

**Authentication:** Admin token required (Super Admin)

Soft delete a question (marks as inactive).

#### Path Parameters

- `questionId`: Question ID (integer)

#### Success Response (200)

```json
{
  "success": true,
  "message": "Question deleted successfully",
  "data": {
    "questionId": 1,
    "isActive": false,
    "updatedAt": "2024-12-17T11:30:00.000Z"
  },
  "timestamp": "2024-12-17T11:30:00.000Z"
}
```

---

### 11. Submit Question Responses

**POST** `/donations/question-responses`

**Authentication:** User token required

Submit health questionnaire responses for a donation. Each donation maintains separate responses to the questions.

#### Request Body

```json
{
  "donationId": 1,
  "responses": [
    {
      "questionId": 1,
      "answer": "yes"
    },
    {
      "questionId": 2,
      "answer": "no"
    },
    {
      "questionId": 3,
      "answer": "I have been taking antibiotics for a week"
    }
  ]
}
```

#### Validation Rules

- `donationId`: Positive integer (required)
- `responses`: Array of response objects (required)
  - `questionId`: Positive integer (required)
  - `answer`: String, 1-5000 characters (required)

#### Business Rules

- User is responsible for providing accurate responses
- Responses are unique per donation per question (one-to-one mapping)
- Existing responses for the donation are replaced when new ones are submitted
- All authenticated users can submit their own responses

#### Success Response (201)

```json
{
  "success": true,
  "message": "Question responses saved successfully",
  "data": [
    {
      "responseId": 1,
      "donationId": 1,
      "questionId": 1,
      "answer": "yes",
      "createdAt": "2024-12-17T10:30:00.000Z",
      "question": {
        "questionId": 1,
        "question": "Are you in good health?",
        "questionType": "yes_no",
        "questionnaire": {
          "questionnaireId": 1,
          "name": "Pre-Donation Health Screening"
        }
      }
    },
    {
      "responseId": 2,
      "donationId": 1,
      "questionId": 2,
      "answer": "no",
      "createdAt": "2024-12-17T10:30:00.000Z",
      "question": {
        "questionId": 2,
        "question": "Do you have diabetes?",
        "questionType": "yes_no"
      }
    }
  ],
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 12. Get Question Responses for Donation

**GET** `/donations/:donationId/question-responses`

**Authentication:** User token required

Get all question responses submitted for a specific donation.

#### Path Parameters

- `donationId`: Donation ID (integer)

#### Success Response (200)

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": [
    {
      "responseId": 1,
      "donationId": 1,
      "answer": "yes",
      "question": {
        "questionId": 1,
        "question": "Are you in good health?",
        "order": 1,
        "questionnaire": {
          "questionnaireId": 1,
          "name": "Pre-Donation Health Screening"
        }
      }
    },
    {
      "responseId": 2,
      "donationId": 1,
      "answer": "no",
      "question": {
        "questionId": 2,
        "question": "Do you have diabetes?",
        "order": 2
      }
    }
  ],
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

### 13. Get Question Response by ID

**GET** `/question-responses/:responseId`

**Authentication:** User token required

Get a specific question response with all related details.

#### Path Parameters

- `responseId`: Response ID (integer)

### 1. Create Hospital

**POST** `/hospitals`

**Authentication:** Super Admin only

#### Request Body

```json
{
  "name": "City Hospital",
  "address": "123 Hospital Street",
  "city": "New York",
  "postalCode": "10001",
  "phone": "0123456789",
  "email": "info@cityhospital.com",
  "isActive": true
}
```

#### Validation Rules

- `name`: 1-255 characters (required)
- `address`: Max 500 characters (optional)
- `city`: Max 100 characters (optional)
- `postalCode`: Max 20 characters (optional)
- `phone`: 10 digits starting with 0 (optional)
- `email`: Valid email format (optional)
- `isActive`: Boolean (default: true)

### 2. Get All Hospitals

**GET** `/hospitals`

**Authentication:** Admin token required

### 3. Get Hospital by ID

**GET** `/hospitals/:id`

**Authentication:** Admin token required

### 4. Update Hospital

**PUT** `/hospitals/:id`

**Authentication:** Super Admin only

### 5. Delete Hospital

**DELETE** `/hospitals/:id`

**Authentication:** Super Admin only

---

## Notifications

### 1. Poll Notifications (Long Polling)

**GET** `/notifications/poll`

**Authentication:** User token required

Long polling endpoint for real-time notifications. The connection stays open until a notification is available or timeout occurs.

#### Query Parameters

- `timeout`: Timeout in milliseconds (default: 30000)

#### Success Response (200)

```json
{
  "success": true,
  "message": "Notifications polled successfully",
  "data": {
    "hasNewNotifications": false,
    "notifications": []
  },
  "timestamp": "2026-01-03T10:30:00.000Z"
}
```

#### Response with Notifications

```json
{
  "success": true,
  "message": "New notification available",
  "data": {
    "hasNewNotifications": true,
    "notifications": [
      {
        "notificationId": 1,
        "type": "blood_alert",
        "message": "New blood alert for your blood group",
        "bloodGroup": "O_POS",
        "urgencyLevel": "urgent",
        "createdAt": "2026-01-03T10:30:00.000Z"
      }
    ]
  },
  "timestamp": "2026-01-03T10:30:00.000Z"
}
```

#### Notes

- Connection remains open for up to 30 seconds (or specified timeout)
- Automatically closes when notification arrives
- Client should reconnect immediately after response
- Used for real-time notification delivery

### 2. Get Notifications

**GET** `/notifications`

**Authentication:** User token required

Retrieve all notifications for the authenticated user.

#### Success Response (200)

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "notifications": [
      {
        "notificationId": 1,
        "type": "blood_alert",
        "message": "New blood alert for your blood group",
        "bloodGroup": "O_POS",
        "isRead": false,
        "createdAt": "2026-01-03T10:30:00.000Z"
      }
    ],
    "totalCount": 1
  },
  "timestamp": "2026-01-03T10:30:00.000Z"
}
```

### 3. Mark Notification as Read

**PATCH** `/notifications/:id/read`

**Authentication:** User token required

Mark a specific notification as read.

#### Path Parameters

- `id`: Notification ID (integer)

#### Success Response (200)

```json
{
  "success": true,
  "message": "Notification marked as read successfully",
  "data": {
    "notificationId": 1,
    "markedAsRead": true
  },
  "timestamp": "2026-01-03T10:30:00.000Z"
}
```

### 4. Delete Notification

**DELETE** `/notifications/:id`

**Authentication:** User token required

Delete a specific notification.

#### Path Parameters

- `id`: Notification ID (integer)

#### Success Response (200)

```json
{
  "success": true,
  "message": "Notification deleted successfully",
  "data": {
    "notificationId": 1,
    "deleted": true
  },
  "timestamp": "2026-01-03T10:30:00.000Z"
}
```

---

## Health Check

### Health Check Endpoint

**GET** `/health`

**Authentication:** None required

Check API server status.

#### Success Response (200)

```json
{
  "success": true,
  "status": "ok",
  "environment": "development",
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

---

## Usage Examples

### Frontend Integration Example

```javascript
// User Registration with Email Verification
const registerUser = async (userData) => {
  try {
    const response = await fetch("/api/v1/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (result.success) {
      console.log("User registered:", result.data);
      console.log("Please check your email to verify your account");
    } else {
      console.error("Registration failed:", result.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

// Email Verification
const verifyEmail = async (token) => {
  try {
    const response = await fetch(`/api/v1/users/verify-email/${token}`, {
      method: "GET",
    });

    const result = await response.json();

    if (result.success) {
      console.log("Email verified successfully!");
    } else {
      console.error("Verification failed:", result.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

// Authenticated Request Example
const getBloodAlerts = async (userToken) => {
  try {
    const response = await fetch("/api/v1/alerts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      console.log("Blood alerts:", result.data);
    } else {
      console.error("Failed to fetch alerts:", result.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

// Long Polling for Notifications
const pollNotifications = async (userToken) => {
  try {
    const response = await fetch("/api/v1/notifications/poll?timeout=30000", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success && result.data.hasNewNotifications) {
      console.log("New notifications:", result.data.notifications);
      // Handle notifications
    }

    // Immediately reconnect for next notification
    pollNotifications(userToken);
  } catch (error) {
    console.error("Polling error:", error);
    // Retry after delay on error
    setTimeout(() => pollNotifications(userToken), 5000);
  }
};
```

---

## Important Notes

### Security Considerations

1. Always include authentication tokens for protected endpoints
2. User tokens expire after 7 days
3. Admin tokens expire after 24 hours
4. Passwords are hashed using bcrypt
5. Email verification is required for user and admin authentication
6. Verification emails are sent with HTML templates containing verification links

### Email Verification

1. Registration automatically sends a verification email with HTML template
2. Users must verify email before they can log in
3. Verification tokens are JWT tokens with type "email-verify"
4. Tokens contain the user/admin ID for verification
5. After verification, `isVerified` flag is set to true and `emailVerifiedAt` timestamp is recorded

### Data Validation

1. All request data is validated using Zod schemas
2. Validation errors return detailed error messages
3. Age validation ensures users are 18-100 years old
4. Donation frequency is limited to once every 2 months

### Business Logic

1. Blood alerts are automatically set to "active" status when created
2. Donations require completed health questionnaire
3. Only confirmed donations count toward donation frequency limits
4. Soft deletes are used for blood alerts (deletedAt timestamp)
5. Hospital associations are optional for blood alerts
6. Each donation maintains separate responses to questions
7. Questions are shared across donations within a questionnaire
8. Question responses are user-submitted and are the user's responsibility
9. All authenticated users can view available questions and questionnaires
10. Admins can create, update, and delete questions/questionnaires
11. Soft deletes are used for questions (isActive flag)

### Notifications

1. Long polling is used for real-time notification delivery
2. Notifications are automatically sent to users when blood alerts match their blood group
3. Active connections are maintained for up to 30 seconds
4. Client should reconnect immediately after receiving a response
5. Notifications can be marked as read or deleted

### Default Values

- Blood alert urgency level: "medium"
- Blood alert quantity: 1 unit
- Donation quantity: 1 unit (fixed)
- Hospital active status: true
- User regular donor status: false
- Long polling timeout: 30000ms (30 seconds)
