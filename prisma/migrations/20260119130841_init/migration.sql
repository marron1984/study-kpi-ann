-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tutorId" TEXT,
    "parentId" TEXT,
    CONSTRAINT "User_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mood" TEXT NOT NULL DEFAULT 'NORMAL',
    "effort" TEXT NOT NULL DEFAULT 'CIRCLE',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "planned" BOOLEAN NOT NULL DEFAULT true,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "dailyLogId" TEXT NOT NULL,
    CONSTRAINT "TaskStatus_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "DailyLog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Streak" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "count" INTEGER NOT NULL DEFAULT 0,
    "frozenCount" INTEGER NOT NULL DEFAULT 0,
    "maxCount" INTEGER NOT NULL DEFAULT 0,
    "lastClearDate" DATETIME,
    "userId" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Streak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiskAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" TEXT NOT NULL DEFAULT 'LEVEL_0',
    "flags" TEXT NOT NULL DEFAULT '[]',
    "weekStart" DATETIME NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PhaseState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phase" TEXT NOT NULL DEFAULT 'PHASE_0',
    "sinceDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PhaseState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weeklyTemplate" TEXT NOT NULL DEFAULT '{}',
    "completionThresholds" TEXT NOT NULL DEFAULT '{}',
    "isHighSchoolMode" BOOLEAN NOT NULL DEFAULT false,
    "weekdayTemplate" TEXT NOT NULL DEFAULT '{}',
    "weekendTemplate" TEXT NOT NULL DEFAULT '{}',
    "userId" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cheer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'WATCHING',
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Cheer_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Cheer_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dailyReminder" BOOLEAN NOT NULL DEFAULT true,
    "dailyReminderTime" TEXT NOT NULL DEFAULT '20:00',
    "weeklySummary" BOOLEAN NOT NULL DEFAULT true,
    "highRiskAlert" BOOLEAN NOT NULL DEFAULT true,
    "parentWeeklySummary" BOOLEAN NOT NULL DEFAULT true,
    "parentHighRiskOnly" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "DailyLog_userId_idx" ON "DailyLog"("userId");

-- CreateIndex
CREATE INDEX "DailyLog_date_idx" ON "DailyLog"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_userId_date_key" ON "DailyLog"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "TaskStatus_dailyLogId_subject_key" ON "TaskStatus"("dailyLogId", "subject");

-- CreateIndex
CREATE UNIQUE INDEX "Streak_userId_key" ON "Streak"("userId");

-- CreateIndex
CREATE INDEX "RiskAssessment_weekStart_idx" ON "RiskAssessment"("weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "PhaseState_userId_key" ON "PhaseState"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- CreateIndex
CREATE INDEX "Cheer_receiverId_idx" ON "Cheer"("receiverId");

-- CreateIndex
CREATE INDEX "Cheer_createdAt_idx" ON "Cheer"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_userId_key" ON "NotificationSettings"("userId");
