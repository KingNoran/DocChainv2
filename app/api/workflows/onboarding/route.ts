import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import config from "@/lib/config";
import emailjs from "@emailjs/browser";
import { serve } from "@upstash/workflow/nextjs";
import { eq } from "drizzle-orm";


type UserState = 'non-active' | 'active';

// Type-safety for starting our workflow
interface InitialData {
  email: string
  fullName: string
}

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const ONE_MONTH_IN_MS = 10 * THREE_DAYS_IN_MS;

const getUserState = async(email:string): Promise<UserState> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if(user.length === 0) return "non-active";

  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();

  if(timeDifference > THREE_DAYS_IN_MS && timeDifference < ONE_MONTH_IN_MS){
    return "non-active";
  }
  return "active";
}

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;
  const emailParams = {
    email: email,
    name: fullName
  }

  const sendWelcomeEmail = async () => emailjs.send(
    config.env.emailjs.serviceId,
    config.env.emailjs.welcomeId,
    emailParams,
    config.env.emailjs.publicKey
);

  // Step 1: Send welcome email
  await context.run("send-welcome-email", sendWelcomeEmail);

  // Step 2: Wait for 3 days (in seconds)
  await context.sleep("sleep-until-follow-up", THREE_DAYS_IN_MS);

  while(true){
    const state = await context.run("check-user-state", async()=>{
      return await getUserState(email);
    })

    if(state === "non-active"){
      const { body: aiResponse } = await context.api.openai.call(
        "generate-personalized-message",
        {
          token: "<OPENAI_API_KEY>",
          operation: "chat.completions.create",
          body: {
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are an assistant creating personalized follow-up messages." },
              { role: "user", content: `Create a short, friendly message for ${name} who has been inactive for awhile. Make it no more than 30kb.` }
            ]
          },
        }
      );

      const personalizedMessage = aiResponse.choices[0].message.content;

      const followParams = {
        email: email,
        message: personalizedMessage
      }

      // Step 4: Send personalized follow-up email
      await context.run("send-follow-up-email", async () => emailjs.send(
        config.env.emailjs.serviceId,
        config.env.emailjs.followId,
        followParams,
        config.env.emailjs.publicKey
      ));

    } else if(state === "active"){
      const { body: aiResponse } = await context.api.openai.call(
        "generate-personalized-message",
        {
          token: "<OPENAI_API_KEY>",
          operation: "chat.completions.create",
          body: {
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are an assistant creating personalized follow-up messages." },
              { role: "user", content: `Create a short, friendly follow-up message for ${name} who joined our service 3 days ago. Make it no more than 30kb.` }
            ]
          },
        }
      );
      
      const personalizedMessage = aiResponse.choices[0].message.content;

      const followParams = {
        email: email,
        message: personalizedMessage
      }

      // Step 4: Send personalized follow-up email
      await context.run("send-follow-up-email", async () => emailjs.send(
        config.env.emailjs.serviceId,
        config.env.emailjs.followId,
        followParams,
        config.env.emailjs.publicKey
      ));
    }
  }
  
});