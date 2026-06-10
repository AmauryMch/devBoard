-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "articleUrl" TEXT NOT NULL,
    "articleTitle" TEXT NOT NULL,
    "articleDescription" TEXT,
    "articleImage" TEXT,
    "articleSource" TEXT NOT NULL,
    "articlePublishedAt" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_articleUrl_key" ON "Favorite"("userId", "articleUrl");
