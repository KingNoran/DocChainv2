"use server";

import { auth } from "@/auth";
import { ProfileProvider } from "@/components/ProfileWrapper";
import { db } from "@/database/drizzle";
import { students, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export default async function MyProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, session!.user.email as string));

  const student = await db
    .select()
    .from(students)
    .where(eq(students.userId, user[0].userId));

  const input = { ...student[0], ...user[0] };
  return <ProfileProvider value={input}>{children}</ProfileProvider>;
}
