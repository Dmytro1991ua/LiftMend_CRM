# LiftMend CRM

LiftMend CRM is a maintenance management dashboard for elevator service teams. It helps organize elevator records, technician availability, repair job scheduling, inventory parts, notifications, and operational metrics in one place.

The project is built as a full-stack Next.js CRM with GraphQL, Prisma, Supabase authentication, file uploads, calendar scheduling, data tables, charts, and automated notification jobs.

## Core Idea

Elevator maintenance work has a lot of moving pieces: equipment records, technician capacity, repair job status, spare parts, inspections, overdue work, and service history.

LiftMend CRM brings those workflows into a single application. A user can schedule a repair job, assign an available technician, connect the job to an elevator, track progress, upload photo evidence, monitor inventory, and review dashboard metrics without jumping between separate tools.

## Quick Start

Create a `.env.local` file in the project root:

```bash
DATABASE_URL=your_pooled_postgres_connection_string
DIRECT_URL=your_direct_postgres_connection_string

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:3000/api/graphql
CRON_SECRET=your_cron_secret
```

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npm run prisma-generate
```

Push the schema to the database:

```bash
npm run prisma-push
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Useful Commands

```bash
npm run dev              # Start local development
npm run build            # Generate Prisma client and build the app
npm run start            # Run the production build
npm run lint             # Run Next.js linting
npm run type-check       # Run TypeScript checks
npm run format-check     # Check Prettier formatting
npm run test:ci          # Run Jest once in CI mode
npm run test:coverage    # Run Jest with coverage
npm run codegen-server   # Generate server GraphQL types
npm run codegen-client   # Generate client GraphQL types
```

## Features

- Supabase email/password and OAuth authentication.
- Protected application routes through Next.js middleware.
- Dashboard with key CRM metrics, charts, recent repair jobs, and date filtering.
- Elevator management with status tracking, maintenance dates, inspection dates, downtime history, and details pages.
- Repair job scheduling with a calendar view and job creation flow.
- Repair job tracking with searchable, sortable, filterable tables.
- Technician management with availability, employment status, skills, certifications, and employment history.
- Inventory management for spare parts, stock levels, minimum stock thresholds, and unit pricing.
- Notifications for overdue jobs, upcoming repair jobs, low inventory, and other operational events.
- Change log page for auditing record updates.
- Profile management with avatar upload through Supabase Storage.
- Photo evidence upload for repair jobs.
- Reusable table system with sorting, filtering, row selection, column resizing, column visibility, and CSV export.
- Shared form controls, modals, date pickers, time pickers, selects, charts, badges, alerts, and details-page layouts.
- Jest and Testing Library coverage across shared UI, hooks, GraphQL utilities, Prisma helpers, and feature modules.

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 12, React 17 |
| Language | TypeScript |
| API | Apollo Server, Apollo Client, GraphQL |
| Database | PostgreSQL, Prisma |
| Auth and Storage | Supabase |
| Forms | React Hook Form, Zod |
| UI | Tailwind CSS, Radix UI, shadcn-style components, Lucide React, React Icons |
| Tables | TanStack React Table |
| Calendar | FullCalendar |
| Charts | Recharts, react-gauge-chart |
| Uploads | GraphQL Upload, Apollo upload client, React Dropzone |
| Testing | Jest, Testing Library, ts-jest |
| Tooling | ESLint, Prettier, Husky, lint-staged, GraphQL Code Generator |

## Project Structure

The project follows the classic Next.js `pages` router structure, with feature code kept in `modules`, reusable building blocks kept in `shared`, and backend GraphQL logic kept under `pages/api/graphql`.

```txt
LiftMend_CRM/
|-- components/
|   `-- ui/                  shadcn-style Radix/Tailwind UI primitives
|-- graphql/
|   |-- codegen/             GraphQL Code Generator configuration
|   |-- fragments/           Reusable client GraphQL fragments
|   |-- schemas/             Client-side GraphQL operation documents
|   |-- typePolicies/        Apollo cache policies
|   `-- types/               Generated client/server GraphQL types
|-- lib/                     Supabase clients and shared utility helpers
|-- mocks/                   App-level mock data
|-- modules/                 Feature modules composed by Next.js pages
|   |-- auth/                Sign in, sign up, reset password, OAuth flows
|   |-- change-log/          Audit log page and filters
|   |-- dashboard/           Metrics, charts, recent repair jobs
|   |-- elevator-management/ Elevator tables, details, inspections, downtime
|   |-- header/              Top navigation and notifications entry points
|   |-- inventory-management/Inventory parts table and stock workflows
|   |-- layout/              Auth and main application layouts
|   |-- notifications/       Notification list, filters, read actions
|   |-- profile/             Profile details, avatar upload, account settings
|   |-- repair-job-scheduling/ Calendar-based repair job scheduling
|   |-- repair-job-tracking/ Repair job table, details, completion flow
|   |-- sidebar/             Main app navigation
|   `-- technician-management/ Technician records, details, history
|-- pages/                   Routes, SSR entry points, and API routes
|   |-- api/
|   |   |-- auth/             Supabase auth callback route
|   |   |-- crons/            Protected scheduled jobs
|   |   `-- graphql/
|   |       |-- dataSources/   Prisma/Supabase-backed domain services
|   |       |-- resolvers/     Query, Mutation, and field resolvers
|   |       |-- schemas/       Server GraphQL schema files
|   |       `-- utils/         API helpers, batching utilities, validators
|   |-- auth/                 Supabase OAuth callback page
|   |-- dashboard/            Dashboard route
|   |-- elevator-management/  Elevator list and detail routes
|   |-- forgot-password/      Password recovery route
|   |-- inventory-management/ Inventory route
|   |-- notifications/        Notifications route
|   |-- profile/              Profile route
|   |-- repair-job-scheduling/ Repair scheduling list/detail routes
|   |-- repair-job-tracking/  Repair tracking list/detail routes
|   |-- reset-password/       Password reset route
|   |-- sign-in/              Sign-in route
|   |-- sign-up/              Sign-up route
|   |-- signout/              Sign-out route
|   `-- technician-management/ Technician list/detail routes
|-- prisma/
|   |-- middleware/           Prisma middleware, including change-log capture
|   |-- schema/               Prisma schema split by domain model
|   |-- db.ts                 Prisma client factory
|   |-- types.ts              Prisma helper types
|   `-- utils.ts              Prisma helper utilities
|-- public/                  Static assets
|-- shared/                  Cross-feature UI, hooks, auth, storage, tables, forms
|-- styles/                  Global CSS and component overrides
|-- types/                   App-wide routes, constants, and shared types
|-- __mocks__/               Jest module mocks
|-- __tests__/               Unit and integration-style tests
|-- middleware.ts            Supabase session route guard
|-- next.config.js           Next.js, GraphQL loader, transpilation config
|-- tailwind.config.ts       Tailwind theme and design tokens
`-- jest.config.ts           Jest test configuration
```

## Main Modules

### Dashboard

The dashboard gives a high-level view of the system. It combines repair job metrics, elevator metrics, technician metrics, recent jobs, status charts, type charts, priority charts, and date-range filtering.

### Elevator Management

Elevator records store building, location, elevator type, capacity, status, inspection dates, maintenance dates, and downtime information. When an elevator is marked out of service, the app starts downtime tracking. When it returns to service, the downtime period is closed.

### Repair Job Scheduling

Repair jobs can be scheduled through a calendar interface. The creation flow validates technician availability, checks the selected elevator, creates a repair job, creates the linked calendar event, marks the elevator as under maintenance, and marks the technician as busy.

### Repair Job Tracking

Repair jobs can be searched, filtered, sorted, edited, deleted, reassigned, completed, and reviewed through table and details views. The completion flow can include checklist items, used inventory parts, and before/after photo evidence.

### Technician Management

Technician records include contact information, skills, certifications, employment status, and availability status. Employment or availability changes are written into technician employment history.

### Inventory Management

Inventory parts include stock, minimum stock, unit price, and status. Repair jobs can consume inventory parts, and cron jobs can create notifications when stock needs attention.

### Notifications

Notifications are generated for operational events such as overdue repair jobs, upcoming repair jobs, and inventory thresholds. Users can filter notifications, mark them as read, and mark all as read.

### Change Log

The change log captures record updates for auditability. It gives users a history of what changed, when it changed, and who changed it.

## API Architecture

The application exposes a GraphQL API at:

```txt
/api/graphql
```

The API is built with Apollo Server and Next.js API routes. The server context creates:

- a Supabase server client
- the authenticated Supabase user
- a Prisma client
- GraphQL data sources
- request-scoped DataLoader storage

The schema is split across GraphQL files in `pages/api/graphql/schemas`, with resolvers in `pages/api/graphql/resolvers` and domain-specific data access in `pages/api/graphql/dataSources`.

## GraphQL Operations

The API includes queries for:

- repair job schedule data
- calendar events
- repair jobs and repair job details
- elevator records and elevator details
- technician records and technician details
- dashboard metrics
- user profile data
- recent repair jobs
- elevator maintenance history
- notifications and unread notification count
- change logs and change log filters
- inventory parts and dropdown options

The API includes mutations for:

- creating and deleting repair jobs with calendar events
- updating and reassigning repair jobs
- uploading repair job evidence photos
- creating, updating, and deleting elevator records
- completing elevator inspections
- creating, updating, and deleting technician records
- signing up, signing in, signing out, password reset, and OAuth login
- uploading profile pictures
- updating profiles and removing accounts
- marking notifications as read

## Database Model

Prisma models are split into separate files under `prisma/schema`.

The main domain models are:

- `User`
- `ElevatorRecord`
- `ElevatorDowntime`
- `RepairJob`
- `RepairJobChecklistItem`
- `CalendarEvent`
- `TechnicianRecord`
- `TechnicianEmploymentHistory`
- `InventoryPart`
- `InventoryPartUsage`
- `Notification`
- `ChangeLog`
- `FormDropdown`

The database provider is PostgreSQL. The schema uses UUIDs and the `uuid-ossp` extension.

## Authentication And Route Protection

Supabase handles authentication. The middleware checks for a session and redirects unauthenticated users to `/sign-in`.

Unauthenticated routes:

- `/sign-in`
- `/sign-up`
- `/forgot-password`
- `/reset-password`
- `/signout`

Authenticated users are redirected away from auth pages and into the dashboard.

## Scheduled Jobs

The project includes protected cron endpoints under `pages/api/crons`.

Each endpoint expects:

```txt
Authorization: Bearer <CRON_SECRET>
```

Available jobs:

- `POST /api/crons/create-repair-job-notifications`
- `POST /api/crons/create-inventory-part-notifications`
- `POST /api/crons/repair-job-overdue`
- `POST /api/crons/archive-old-notifications`

These jobs generate notifications, update overdue repair job state, and archive old read notifications.

## Code Generation

GraphQL types are generated with GraphQL Code Generator.

```bash
npm run codegen-server
npm run codegen-client
```

Server-generated types are used by resolvers and data sources. Client-generated types are used by UI hooks and GraphQL operations.

## Testing

The project has broad Jest coverage for:

- shared UI components
- form controls
- table behavior
- auth utilities and hooks
- GraphQL utilities
- Prisma helpers and middleware
- dashboard modules
- elevator management
- repair job scheduling and tracking
- technician management
- inventory management
- notifications
- change log

Run the test suite once:

```bash
npm run test:ci
```

Run coverage:

```bash
npm run test:coverage
```

## License

No license file is currently present.
