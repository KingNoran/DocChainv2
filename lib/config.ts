const config = {
  env: {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT! as string, // dev or fallback
    prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT! as string, // production
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://doc-chainv2.vercel.app/",
    imagekit: {
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY! as string,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT! as string,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY! as string,
    },
    databaseUrl: process.env.DATABASE_URL! as string,
    upstash: {
      redisUrl: process.env.UPSTASH_REDIS_URL! as string,
      redisToken: process.env.UPSTASH_REDIS_TOKEN! as string,
      qstashUrl: process.env.QSTASH_URL! as string,
      qstashToken: process.env.QSTASH_TOKEN! as string,
    },
    emailjs: {
      serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
      verifyTemplateId: process.env.NEXT_PUBLIC_EMAILJS_VERIFY_TEMPLATE_ID || "",
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
    },
    emailjsServer: {
      privateKey: process.env.EMAILJS_PRIVATE_KEY || "",
      serviceId: process.env.EMAILJS_SERVICE_ID || "",
      verifyTemplateId: process.env.EMAILJS_VERIFY_TEMPLATE_ID || "",
    },
    emailVerificationSecret: process.env.EMAIL_VERIFICATION_SECRET || "",
    smtp: {
      host: process.env.SMTP_HOST || "",
      port: Number(process.env.SMTP_PORT) || 465,
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
  },
  },
  
};

export default config;
