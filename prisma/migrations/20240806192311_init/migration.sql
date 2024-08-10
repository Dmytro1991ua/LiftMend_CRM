-- CreateTable
CREATE TABLE "CalendarEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "allDay" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobTypes" (
    "id" SERIAL NOT NULL,
    "job_types" TEXT[],

    CONSTRAINT "JobTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Priorities" (
    "id" SERIAL NOT NULL,
    "priorities" TEXT[],

    CONSTRAINT "Priorities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElevatorTypes" (
    "id" SERIAL NOT NULL,
    "elevator_types" TEXT[],

    CONSTRAINT "ElevatorTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildingNames" (
    "id" SERIAL NOT NULL,
    "building_names" TEXT[],

    CONSTRAINT "BuildingNames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElevatorLocations" (
    "id" SERIAL NOT NULL,
    "locations" TEXT[],

    CONSTRAINT "ElevatorLocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicianNames" (
    "id" SERIAL NOT NULL,
    "names" TEXT[],

    CONSTRAINT "TechnicianNames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicianSkills" (
    "id" SERIAL NOT NULL,
    "skills" TEXT[],

    CONSTRAINT "TechnicianSkills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairJob" (
    "id" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "jobDetails" TEXT NOT NULL,
    "jobPriority" TEXT NOT NULL,
    "elevatorType" TEXT NOT NULL,
    "buildingName" TEXT NOT NULL,
    "elevatorLocation" TEXT NOT NULL,
    "technicianName" TEXT NOT NULL,
    "technicianSkills" TEXT[],
    "contactInformation" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
