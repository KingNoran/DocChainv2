"use client";

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { ZodType } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { redirect, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import { useSession } from 'next-auth/react';
import { auth } from '@/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"


interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "LOG_IN" | "REGISTER";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit
}: Props<T>) => {
  const router = useRouter();
  const isLogIn = type === "LOG_IN";
  const [showPassword, setShowPassword] = useState(false);
  const { update, status } = useSession();

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    const date = new Date().toUTCString();
    const newSession = await update();
    if (result.success) {
      toast.success(isLogIn ? "Logged In Successfully!" : "User Registered Successfully!", {
        description: `Date: ${date}\n`,
        action: {
          label: "Got it",
          onClick: () => console.log("Success"),
        },
      });
    if(newSession?.user.role === "STUDENT") redirect("/student/my-profile");
    if(newSession?.user.role === "REGISTRAR") redirect("/registrar");
    if(newSession?.user.role === "ADMIN") redirect("/admin");
    } else {
      toast.error(`Error ${isLogIn ? "Logging In" : "Registering"}`, {
        description: `Date: ${date}`,
        action: {
          label: "Got it",
          onClick: () => console.log("Error"),
        }
      })
    }
  };

  if(status === "loading") return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h1 className="text-3xl font-bold text-center mt-22 mb-2">Welcome Back!</h1>
      <p className="text-base text-neutral-400 text-center mb-4">Enter your credentials to access your account</p>
      <div className="w-full max-w-md bg-background text-foreground rounded-2xl p-8 flex flex-col gap-6 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
            {/* Email Field */}
            <FormField
              control={form.control}
              name={"email" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-normal">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Enter email"
                      type="email"
                      className="bg-card border border-border rounded-lg h-12 text-foreground placeholder:text-muted-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
            <FormField
              control={form.control}
              name={"password" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-normal">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        required
                        placeholder="Enter password"
                        type={showPassword ? "text" : "password"}
                        className="bg-card border border-border rounded-lg h-12 text-foreground placeholder:text-muted-foreground pr-16"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-normal focus:outline-none cursor-pointer"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="w-4 h-4 rounded-sm border border-border bg-background cursor-pointer" />
                Remember me
              </label>
              <button type="button" className="text-primary text-sm font-normal hover:underline cursor-pointer">Forgot password?</button>
            </div>
            {/* Submit Button */}
            <Button type="submit" className="w-full h-9 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-emerald-500 transition-colors cursor-pointer">Log In</Button>
          </form>
        </Form>
      </div>
      {/* Terms and Privacy */}
      <div className="flex gap-8 mt-2 text-sm text-neutral-400">
        <Dialog>
          <DialogTrigger className="cursor-pointer">Terms of Service</DialogTrigger>
          <DialogContent onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="text-green-500 text-center text-xl mb-3">Terms of Service</DialogTitle>
              <DialogDescription className="max-h-[300px] md:max-h-[400px] lg:max-h-[500px] overflow-y-auto text-sm md:text-md text-justify leading-relaxed">
                Welcome to DocChain. These Terms of Service (“Terms”) govern your access and use of DocChain, which includes the blockchain-supported digitized Transcript of Records (TOR) managing system operated by DocChain. By accessing or using DocChain, you are agreeing to be bound by these Terms. If you disagree, do not use DocChain.
                <br/><br/>
                <span className="text-green-500 text-xl font-bold">1. Definitions</span>
                <br/><br/>
                
                DocChain refers to the web application, as well as any related mobile or web interfaces, services, documentation, demonstrations, and support for digitizing, issuing, storing, and verifying academic transcripts (TORs).
                User or you refers to any individual (students, alumni, registrars, administrators) who accesses or uses DocChain.
                Content refers to all information, documents, TORs, files, and materials you upload, submit, or create in the course of using DocChain.
                <br/><br/>
                Blockchain Record refers to a tamper-evident cryptographic record (for example, a hash) stored or referenced on a blockchain as part of the verification mechanism in DocChain.
                <br/><br/>
                
                <span className="text-green-500 text-xl font-bold">2. Eligibility and Accounts</span>
                <br/><br/>
                To use DocChain, users must be the minimum age indicated by applicable law and approved by their school or authorized institution. Use may be limited to students, alumni, registrars, and authorized staff of the participating institutions. To access certain features of DocChain, you may be required to register an account by agreeing to these Terms of Use and submitting accurate and current information. 
                <br/><br/>
                You are solely responsible for maintaining the confidentiality of the password and account information used in connection with your DocChain account, and also for all activities on your account.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">3. Acceptable Use</span>
                <br/><br/>
                You may only use DocChain for lawful academic and administrative purposes related to the process of requesting, issuing, storing, and verifying academic records. You must not:
                Upload content that is illegal, fraudulent, defamatory, infringing, or otherwise in violation of law or third-party rights.
                Attempt to circumvent any security measures or to reverse-engineer any systems, or interfere with the operation of the Services.
                <br/><br/>
                Share your account credentials or impersonate other users.
                Use DocChain to distribute malware or otherwise compromise the devices or data of other users.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">4. Content Ownership and License</span>
                <br/><br/>
                You remain the sole owner of the Content you contribute to DocChain. By providing Content, you are granting DocChain and the institution a non-exclusive, global, royalty-free license to store, use, reproduce, process, and display Content to provide functionality of the Service (including, for example, on a blockchain, storing verifiable digests, transmitting requests to registrars, and allowing authorized verification).
                <br/><br/>
                You represent and warrant that you have the right to submit that Content and that you do not violate any rights of any third parties.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">5. Blockchain Immutability</span>
                <br/><br/>
                DocChain utilizes blockchain technology to securely store verification records (for example, cryptographic hashes or transaction identifiers). Because blockchain records are immutable, some verification records cannot be changed or deleted once they are written on-chain. More importantly, personal data stored on-chain is limited - DocChain will store only cryptographic digests or references to the data on-chain, while any personal and sensitive data is stored off-chain with appropriate security. 
                <br/><br/>
                You acknowledge and accept the technical characteristics and limitations of blockchain immutability.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">6. Privacy and Data Protection</span>
                <br/><br/>
                The collection and use of personal data by us shall be governed by the Privacy Policy (see below). By using DocChain, you consent to the collection and processing of your personal data as outlined in the Privacy Policy.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">7. Fees and Payment</span>
                <br/><br/>
                If any fee-based features become available, we will disclose the fees, billing methods, and refund policies before implementation. While DocChain is currently provided for the research/project purpose by the researcher, it may also remain free of charge to users authorized by the researcher. 
                <br/><br/>
                If DocChain does become chargeable, this will be communicated with reasonable prior notice.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">8. Disclaimers; No Warranties</span>
                <br/><br/>
                DocChain is provided “as is” and “as available.” To the greatest extent possible under applicable law, we disclaim all warranties, express, implied, or statutory, including without limitation, all implied warranties of merchantability, fitness for a particular purpose, accuracy, and non-infringement.<br/><br/>We do not warrant that DocChain will be uninterrupted or error-free, that DocChain will be free from would-be intruders with malicious intent, or that DocChain will be free of fraud or forgery, all of which are performed using smart contracts or through blockchain mechanisms; the processes are limited by the technology and the condition of the third-party network ecosystem. 
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">9. Limitations of Liability</span>
                <br/><br/>
                To the fullest extent permitted under law, neither DocChain nor any of its officers, employees, partners, or licensors shall be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of DocChain, including, but not limited to, any loss of data or lost profit, or any damage to your reputation. 
                <br/><br/>
                Our total liability for damages in the case of direct damages is limited to the lesser of (a) the total amount of fees you paid us in the prior six-month period or (b) if you paid us no fees, our overall liability will be limited to the highest amount permitted under the law.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">10. Indemnification</span>
                <br/><br/>
                You agree to indemnify and hold DocChain and its representatives harmless from any claims, damages, costs, and expenses (including legal fees and costs) arising from your breach of these Terms, any violation of law, or the submission of infringing or unlawful Content.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">11. Termination and Suspension</span>
                <br/><br/>
                We hold the authority to suspend or terminate your access to DocChain at any time due to violations of these Terms and/or unlawful conduct and/or for operational and/or security reasons.<br/><br/>When account access is terminated, your account will be disabled. Certain record types, including, for example, blockchain verification entries, might be less than truly immutable and retained according to the requirements of the law or for audit purposes.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">12. Changes to the Terms</span>
                <br/><br/>
                We may change or update the Terms from time to time. Material changes to the Terms will be noted with an updated effective date posted to the site and, where practicable, will be provided with notice.Continued use after posting of the material change constitutes your agreement and acceptance of the changes.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">13. Governing Law and Dispute Resolution</span>
                <br/><br/>
                This Agreement is governed by the laws of the Republic of the Philippines. In the event of a dispute, we encourage you to contact us first at docchaincvsu@gmail.com to attempt resolution amicably. If we have failed to resolve the dispute amicably, you agree to submit to the jurisdiction of the courts of the Philippines.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">14. Contact</span>
                <br/><br/>
                If you have questions about these Terms, please contact:
                <br/><br/>
                DocChain
                <br/><br/>
                Email: docchaincvsu@gmail.com
                <br/>
                Address: Soldiers Hills IV, Molino VI, Bacoor City, Cavite
                <br/><br/>
                Note: These Terms are a general legal framework. If DocChain will be used in production or released widely, please have these Terms reviewed by legal counsel.
                <br/><br/>
                <DialogClose  className="w-full pb-2" asChild>
                  <Button className="w-25 cursor-pointer hover:underline">I Agree</Button>
                </DialogClose>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger className="cursor-pointer">Privacy Policy</DialogTrigger>
          <DialogContent onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="text-green-500 text-center text-xl mb-3">Privacy Policy</DialogTitle>
              <DialogDescription className="max-h-[300px] md:max-h-[400px] lg:max-h-[500px] overflow-y-auto text-sm md:text-md text-justify leading-relaxed">
                This Privacy Policy describes the way DocChain may collect, use, disclose, and protect users' personal information. If you consent to the practices described below, you may access DocChain. If you do not consent, do not use the service. 
                <br/><br/>
                <span className="text-green-500 text-xl font-bold">1. Scope and Controller</span>
                <br/><br/>
                
                DocChain is operated by proponent(s) of DocChain, which acts as the data controller for information collected through the DocChain platform. 
                <br/><br/>
                Contact information: docchaincvsu@gmail.com, Soldiers Hills IV, Molino VI, Bacoor City, Cavite. 
                <br/><br/>
                
                <span className="text-green-500 text-xl font-bold">2. Type of Data Collected</span>
                <br/><br/>
                The proponents of DocChain will collect the following categories of data:
                <br/><br/>
                Accounts & Identity Data:
                <br/>
                Name, student ID, e-mail address, enrollment status, year level, program/course, cellphone number, nationality, and address
                <br/>
                Purpose: to create and manage user accounts and authenticate access, as well as link requests to official records.
                <br/><br/>
                Academic Records & Document Data:
                <br/>
                TOR files, PDFs, scanned documents, and metadata (dates, request IDs).
                <br/>
                Purpose: to process requests, issue digitally-verified TORs, and track verification events.
                <br/><br/>
                Transactional & System Data:
                <br/>
                Transaction timestamp, request status, the IP and device type, browser information, and log files.
                <br/>
                Purpose: to monitor platform operation, troubleshoot, and assist security and auditing.
                <br/><br/>
                Verification Data (Blockchain Records):
                <br/>
                Cryptographic digests, hashes, or transaction identifiers that have been written to a blockchain for its verification.
                <br/>
                Purpose: to provide evidence of the integrity of the verification of the TOR.
                <br/><br/>
                Optional Survey and Feedback Data:
                <br/>
                Responses to satisfaction surveys, usage feedback, or support tickets.
                <br/>
                Purpose: to enhance the platform and support research/evaluation.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">3. How We Gather Data</span>
                <br/><br/>
                From You: When you register, request a TOR, upload documents, or fill out surveys.  
                <br/>
                Automatically: From server logs and analytics while you are using the platform.  
                <br/>
                From Third Parties: Institutional systems (registrar databases), when warranted; we only do so with your permission.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">4. Legal Basis and Legitimate Purposes for Processing</span>
                <br/><br/>
                We process personal data, as defined by the GDPR, for the following legitimate purposes:<br/>
                To provide the DocChain Service and perform the contracted service between you and your institution.<br/>
                To comply with a legal or institutional obligation (e.g., record-keeping, audits).<br/><br/>
                For legitimate interests: security, fraud prevention, research and development, or improvement of the system and service, or quality assurance.<br/>
                With your consent, for optional, non-institutional, sponsored communication or research activities (ex., surveys or newsletters). 
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">5. Data Minimization, on and off the blockchain</span>
                <br/><br/>
                DocChain engages in data minimization, where personal and sensitive information is stored off-chain in controlled, secure storage, and only cryptographic digests or minimal reference data are stored on the chain to verify your identity without revealing the goods housed in the document. Because blockchain entries, by design of the distributed ledger technology, are permanent and cannot be changed or removed, we do not write personally identifiable data to the chain.
                <br/><br/>     

                <span className="text-green-500 text-xl font-bold">6. Data Retention</span>
                <br/><br/>
                We will keep personal data only as necessary to deliver services, fulfill organizational record-keeping requirements, and meet our legal obligations. Specific retention times include:<br/><br/>
                Account and identity data: Account and identity data are only kept as long as the account is active and, e.g., 2 years of inactivity follow the loss of account activity, or as required by institutional policy.<br/><br/>
                TOR and document data: An institutional academic record retention schedule applies to TOR and document data (e.g., 2 years), plus laws related to academic records require a longer period of retention.<br/><br/>
                Blockchain verification records: Verification records processed on-chain are kept forever, and therefore immutable, as part of the ledger.<br/><br/>
                Data will be securely deleted, anonymized, or archived when no longer necessary, keeping in mind the immutable nature of on-chain references.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">7. Data Access, Correction, and Deletion</span>
                <br/><br/>
                You have the right to ask for access to the personal data we hold about you, to correct any inaccurate personal data, and to request deletion of personal data. Those deletion requests may be, however, more limited:<br/><br/>
                For off-chain personal data, we will delete or anonymize personal data where allowed.<br/><br/>
                For on-chain verification records, blockchain paragraphs can't delete entries once created; we may update the link to the previous entry after removing the off-chain link, and create an updated verification, if applicable.<br/><br/>
                To exercise those rights, simply contact us at docchaincvsu@gmail.com. We may ask for some identification verification before acting on such requests.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">8. Data Security</span>
                <br/><br/>
                We take reasonable administrative, technical, and physical safeguards to protect personal data, such as implementing access controls, all data being encrypted while at rest and in transit, using secure servers, and conducting recurring security testing. However, no system can be completely secure, and we cannot guarantee absolute security. If we have a data breach of personal data, we will follow the applicable rules of notification and will notify any affected persons and or relevant government officials as the law requires. 
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">9. Sharing and Disclosure</span>
                <br/><br/>
                We do not sell personal data. We may share personal data in the following limited contexts:<br/><br/>
                With verified authorized institution staff, the registrar or admin responds to inquiries related to fulfilling a request for TOR requests or verification.<br/><br/>
                With verified service providers performing data processing on our behalf, acting as processors as necessary, who have signed contractual and security obligations.<br/><br/>
                When required by applicable law, court order, or to protect our rights, safety, and property.<br/><br/>
                With consent, for research purposes, or aggregated reporting of anonymous or pseudonymized data.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">10. Links and Services of Third Parties</span>
                <br/><br/>
                DocChain may utilize or provide services from third parties. Those third parties will have their own privacy practices that are not covered by this Privacy Policy, and it is advised to review the third parties' privacy practices. Where possible, we select reliable suppliers and require adequate contracts for protection.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">11. Transfers Outside of Your Country</span>
                <br/><br/>
                Personal data may be processed or stored outside of your country, where our suppliers may locate their facilities. We will take reasonable efforts to take reasonably necessary steps to ensure that the transfers have sufficient data protection in accordance with the applicable law.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">12. Cookies and Similar Technologies</span>
                <br/><br/>
                DocChain may utilize cookies and similar technologies in order to enable certain basic functionality, to remember preferences, and to collect analytics. You can modify your cookie preferences using the settings in your browser or using any consent options provided in the Application.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">13. Changes to this Privacy Policy</span>
                <br/><br/>
                This Privacy Policy may be amended from time to time. The amended Privacy Policy will be posted with a new effective date. Any material changes to this Privacy Policy will be shared with you through the Platform, or by email where required.
                <br/><br/>

                <span className="text-green-500 text-xl font-bold">14. Contact and Complaints</span>
                <br/><br/>
                For questions, requests, or complaints about your data or this Privacy Policy, please contact:
                <br/><br/>
                DocChain
                <br/><br/>
                Email: docchaincvsu@gmail.com
                <br/>
                Address: Soldiers Hills IV, Molino VI, Bacoor City, Cavite
                <br/><br/>
                If you are not satisfied with our response, you may refer the matter to the relevant data protection or supervisory authority in your jurisdiction.
                <br/><br/>
                <DialogClose  className="w-full pb-2" asChild>
                  <Button className="w-25 cursor-pointer hover:underline">I Agree</Button>
                </DialogClose>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
};

export default AuthForm;

