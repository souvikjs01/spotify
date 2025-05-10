/*
  Warnings:

  - The primary key for the `Album` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Album` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Song` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Song` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `albumId` column on the `Song` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_albumId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP CONSTRAINT "Album_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Album_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Song" DROP CONSTRAINT "Song_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "albumId",
ADD COLUMN     "albumId" INTEGER,
ADD CONSTRAINT "Song_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;
