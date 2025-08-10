-- DropForeignKey
ALTER TABLE "public"."JointOwner" DROP CONSTRAINT "JointOwner_jointAccountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."JointOwner" DROP CONSTRAINT "JointOwner_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."JointOwner" ADD CONSTRAINT "JointOwner_jointAccountId_fkey" FOREIGN KEY ("jointAccountId") REFERENCES "public"."JointAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JointOwner" ADD CONSTRAINT "JointOwner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
