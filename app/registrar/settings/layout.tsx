"use server";

import { auth } from "@/auth";
import { ProfileProvider } from "@/components/ProfileWrapper";
import { db } from "@/database/drizzle";
import { registrars, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, session!.user.email as string));

  const registrar = await db
    .select()
    .from(registrars)
    .where(eq(registrars.userId, user[0].userId));

  const input = { ...registrar[0], ...user[0] };
  return <ProfileProvider value={input}>{children}</ProfileProvider>;
}
