# Blood Donation System - Questions & Questionnaires Implementation

## Overview

This document provides a complete implementation of the Questions & Questionnaires feature for the Blood Donation System. Each donation now has its own separate responses to a shared set of questions, allowing for detailed health screening and tracking.

---

## Architecture Overview

### Database Schema Changes

#### New Models

1. **Question**
   - Stores individual health screening questions
   - Belongs to a Questionnaire
   - Supports different question types: yes_no, text, multiple_choice
   - Includes display order and active status

2. **QuestionResponse**
   - Stores user responses to questions for each donation
   - Links a Donation to a Question with the user's answer
   - Unique constraint ensures one response per donation per question
   - Cascade delete ensures cleanup when donations are deleted

3. **Questionnaire** (Updated)
   - Now has a relationship to Questions
   - Groups related questions together
   - Can be enabled/disabled with isActive flag

#### Updated Models

1. **Donation**
   - Added `questionnaireId` field to link to a questionnaire
   - Added `questionResponses` relation for fetching responses

---

## File Structure

### New Files Created

```
src/
├── validations/
│   └── question.validation.ts
├── services/
│   └── question.service.ts
├── apis/v1/
│   └── question.controller.ts
└── routers/
    └── question.route.ts
```

### Files Modified

```
prisma/
└── schema.prisma

src/
├── app.ts
├── validations/
│   └── donation.validation.ts
└── services/
    └── donation.service.ts
```

---

## Detailed Implementation

### 1. Prisma Schema Updates

**File:** `prisma/schema.prisma`

#### Updated Questionnaire Model

```prisma
model Questionnaire {
  questionnaireId Int      @id @default(autoincrement()) @map("questionnaire_id")
  name            String
  description     String?
  isActive        Boolean  @default(true) @map("is_active")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  questions       Question[]
  donations       Donation[]
  @@map("questionnaires")
}
```

#### New Question Model

```prisma
model Question {
  questionId      Int      @id @default(autoincrement()) @map("question_id")
  questionnaireId Int      @map("questionnaire_id")
  question        String
  questionType    String   @default("yes_no") @map("question_type")
  options         String?  // JSON stringified array
  isRequired      Boolean  @default(true) @map("is_required")
  order           Int      @default(0)
  isActive        Boolean  @default(true) @map("is_active")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  questionnaire   Questionnaire @relation(fields: [questionnaireId], references: [questionnaireId], onDelete: Cascade)
  responses       QuestionResponse[]

  @@map("questions")
}
```

#### New QuestionResponse Model

```prisma
model QuestionResponse {
  responseId    Int      @id @default(autoincrement()) @map("response_id")
  donationId    Int      @map("donation_id")
  questionId    Int      @map("question_id")
  answer        String
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  donation      Donation @relation(fields: [donationId], references: [donationId], onDelete: Cascade)
  question      Question @relation(fields: [questionId], references: [questionId], onDelete: Cascade)

  @@unique([donationId, questionId])
  @@map("question_responses")
}
```

#### Updated Donation Model

```prisma
model Donation {
  // ... existing fields ...
  questionnaireId Int?           @map("questionnaire_id")

  questionnaire   Questionnaire? @relation(fields: [questionnaireId], references: [questionnaireId])
  questionResponses QuestionResponse[]

  @@map("donations")
}
```

### 2. Validation Schemas

**File:** `src/validations/question.validation.ts`

Complete validation schemas for:

- Creating/updating questionnaires
- Creating/updating questions
- Creating question responses (single and bulk)

### 3. Service Layer

**File:** `src/services/question.service.ts`

#### Questionnaire Operations

- `createQuestionnaire()` - Create a new questionnaire
- `getAllQuestionnaires()` - Get all active questionnaires with questions
- `getQuestionnaireById()` - Get specific questionnaire
- `updateQuestionnaire()` - Update questionnaire details

#### Question Operations

- `createQuestion()` - Add question to questionnaire
- `getAllQuestions()` - Get all active questions
- `getQuestionsByQuestionnaire()` - Get questions for specific questionnaire
- `getQuestionById()` - Get specific question
- `updateQuestion()` - Update question
- `deleteQuestion()` - Soft delete question

#### Question Response Operations

- `createBulkQuestionResponses()` - Submit responses for a donation
- `getQuestionResponsesByDonation()` - Get all responses for a donation
- `getQuestionResponseById()` - Get specific response

### 4. Controller Layer

**File:** `src/apis/v1/question.controller.ts`

Async handlers for all questionnaire, question, and response operations with proper error handling.

### 5. Routes

**File:** `src/routers/question.route.ts`

#### Authentication Requirements

- **Admin Only:** Create/Update/Delete questionnaires and questions
- **All Authenticated Users:** View questionnaires and questions
- **Authenticated Users:** Submit and view responses

#### Endpoints

```
POST   /questionnaires
GET    /questionnaires
GET    /questionnaires/:questionnaireId
PUT    /questionnaires/:questionnaireId

POST   /questions
GET    /questions
GET    /questionnaires/:questionnaireId/questions
GET    /questions/:questionId
PUT    /questions/:questionId
DELETE /questions/:questionId

POST   /donations/question-responses
GET    /donations/:donationId/question-responses
GET    /question-responses/:responseId
```

### 6. Updated Donation Service

**File:** `src/services/donation.service.ts`

The `createDonation()` function now:

- Accepts optional `questionnaireId` and `questionResponses` parameters
- Creates the donation with questionnaire link
- Automatically creates associated question responses
- Returns complete donation data with all relationships

Updated Request Schema:

```typescript
{
  userId: number,
  alertId: number,
  donationDate: Date,
  questionnaireCompleted: boolean,
  questionnaireId?: number,
  questionResponses?: Array<{
    questionId: number,
    answer: string
  }>
}
```

### 7. Application Routes

**File:** `src/app.ts`

Added question routes import and middleware registration:

```typescript
import questionRoutes from "./routers/question.route.js";
app.use("/api/v1", questionRoutes);
```

---

## Usage Examples

### 1. Admin Creates a Questionnaire

```bash
POST /api/v1/questionnaires
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Pre-Donation Health Screening",
  "description": "Health assessment before blood donation",
  "isActive": true
}
```

Response:

```json
{
  "success": true,
  "message": "Questionnaire created successfully",
  "data": {
    "questionnaireId": 1,
    "name": "Pre-Donation Health Screening",
    "description": "Health assessment before blood donation",
    "isActive": true,
    "questions": [],
    "createdAt": "2024-12-17T10:30:00.000Z"
  }
}
```

### 2. Admin Adds Questions to Questionnaire

```bash
POST /api/v1/questions
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "questionnaireId": 1,
  "question": "Are you in good health?",
  "questionType": "yes_no",
  "isRequired": true,
  "order": 1,
  "isActive": true
}
```

### 3. User Views Available Questions

```bash
GET /api/v1/questionnaires/1/questions
Authorization: Bearer <user_token>
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "questionId": 1,
      "question": "Are you in good health?",
      "questionType": "yes_no",
      "isRequired": true,
      "order": 1
    },
    {
      "questionId": 2,
      "question": "Do you have any chronic diseases?",
      "questionType": "yes_no",
      "isRequired": true,
      "order": 2
    }
  ]
}
```

### 4. User Creates Donation with Question Responses

```bash
POST /api/v1/donations
Authorization: Bearer <user_token>
Content-Type: application/json

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
      "answer": "no"
    }
  ]
}
```

Response:

```json
{
  "success": true,
  "message": "Donation created successfully",
  "data": {
    "donationId": 1,
    "userId": 1,
    "alertId": 1,
    "donationDate": "2024-12-18T10:00:00.000Z",
    "questionnaireId": 1,
    "questionResponses": [
      {
        "responseId": 1,
        "donationId": 1,
        "questionId": 1,
        "answer": "yes",
        "question": {
          "questionId": 1,
          "question": "Are you in good health?"
        }
      }
    ]
  }
}
```

### 5. User Submits Question Responses Later

```bash
POST /api/v1/donations/question-responses
Authorization: Bearer <user_token>
Content-Type: application/json

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
    }
  ]
}
```

### 6. User/Admin Views Responses for a Donation

```bash
GET /api/v1/donations/1/question-responses
Authorization: Bearer <user_token>
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "responseId": 1,
      "donationId": 1,
      "answer": "yes",
      "question": {
        "questionId": 1,
        "question": "Are you in good health?",
        "order": 1
      }
    },
    {
      "responseId": 2,
      "donationId": 1,
      "answer": "no",
      "question": {
        "questionId": 2,
        "question": "Do you have any chronic diseases?",
        "order": 2
      }
    }
  ]
}
```

---

## Key Features

### 1. Shared Questions

- Questions are created once per questionnaire
- Same questions can be used across multiple donations
- Questions are ordered for consistent display

### 2. Per-Donation Responses

- Each donation maintains unique responses
- User can update responses after donation creation
- Responses are linked to specific questions
- Unique constraint prevents duplicate responses per donation

### 3. Question Types

- **yes_no**: Simple yes/no questions
- **text**: Free-form text responses
- **multiple_choice**: Options provided

### 4. Access Control

- **Admins:** Can create, update, and delete questionnaires/questions
- **All Users:** Can view questionnaires and questions
- **Users:** Can submit and view their own responses

### 5. Soft Deletes

- Questions use soft delete (isActive flag)
- Questionnaires can be deactivated
- Historical data is preserved

---

## Database Migration Steps

1. **Generate Migration:**

```bash
npx prisma migrate dev --name add_questions_and_responses
```

2. **Review the Generated Migration** in `prisma/migrations/`

3. **Apply Migration:**

```bash
npx prisma migrate deploy
```

4. **Generate Prisma Client:**

```bash
npx prisma generate
```

---

## API Documentation

All endpoints are documented in `API_DOCUMENTATION.md` with:

- Request/response examples
- Validation rules
- Authentication requirements
- Error responses
- Usage patterns

### New Section: Questionnaires & Questions

The API documentation now includes a complete section (Section 10) detailing all questionnaire and question endpoints with examples and best practices.

---

## Implementation Checklist

- ✅ Prisma schema updated with new models and relationships
- ✅ Question validation schemas created
- ✅ Question service with full CRUD operations
- ✅ Question controller with async error handling
- ✅ Question routes with proper authentication
- ✅ Donation service updated to support question responses
- ✅ Donation validation schema updated
- ✅ Application routes updated with question endpoints
- ✅ API documentation comprehensive and complete
- ✅ All endpoints follow RESTful conventions
- ✅ Authentication middleware properly applied

---

## Notes

- All question responses are user-submitted; admin responsibility is question management only
- Each donation can have responses to multiple questions
- Questions are shared across donations but responses are per-donation
- Soft deletes preserve historical data
- Cascade deletes ensure data consistency when donations are deleted
- All endpoints follow the standard response format defined in API_DOCUMENTATION.md

---

## Next Steps

1. Run database migration to create tables
2. Create initial questionnaire and questions via API or seed script
3. Test endpoints with provided examples
4. Integrate frontend with question endpoints
5. Update user donation flow to include question responses
