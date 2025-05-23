"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Welcome to Doc.Chain",
    desc:
      "Experience the future of digital collaboration with our innovative platform. We're here to transform the way you work.",
    img: "https://placehold.co/600x300",
  },
  {
    title: "What is Doc.Chain?",
    desc:
      "Doc.Chain is a blockchain-powered document verification system that ensures the authenticity, integrity, and tamper-proof storage of academic records like Transcript of Records (TOR).",
    img: "https://placehold.co/600x300",
  },
  {
    title: "How to create account?",
    desc:
      "To create an account in Doc.Chain, a user must first request access from the registrar, who will then review the request and generate the account credentials upon approval.",
    img: "https://placehold.co/600x300",
  },
  {
    title: "Get Started with Doc.Chain",
    desc:
      "Join us today and experience secure, seamless, and instant verification of your academic credentials!",
    img: "https://placehold.co/600x300",
  },
];

export default function InfoCarousel({ onFinish }: { onFinish?: () => void }) {
  const [current, setCurrent] = useState(0);
  const isLast = current === slides.length - 1;

  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-foreground font-inter px-2 py-8">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-background rounded-2xl flex flex-col items-center justify-center shadow-xl p-2 sm:p-8 border border-border">
          <div className="w-full max-w-3xl bg-card rounded-2xl shadow-lg p-4 sm:p-8 flex flex-col items-start relative border border-border">
            <h2 className="text-primary text-2xl sm:text-3xl font-bold leading-[2.5rem] mb-2">{slides[current].title}</h2>
            <p className="text-muted-foreground text-base font-normal leading-normal mb-6 max-w-xl">{slides[current].desc}</p>
            <div className="flex justify-center w-full mb-8">
              <img
                src={slides[current].img}
                alt="carousel"
                className="rounded-xl w-full max-w-lg object-cover"
              />
            </div>
            {/* Navigation */}
            <div className="flex items-center justify-center w-full mt-4 gap-4">
              <Button
                variant="outline"
                className="w-20 h-12 bg-muted text-foreground font-semibold rounded-lg opacity-50 disabled:opacity-30 border border-border"
                disabled={current === 0}
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              >
                Back
              </Button>
              <div className="flex gap-4 mx-2">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full ${idx === current ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
              {isLast ? (
                <Button
                  className="w-32 h-12 bg-primary text-primary-foreground font-semibold rounded-lg"
                  onClick={onFinish}
                >
                  Let's Get Started
                </Button>
              ) : (
                <Button
                  className="w-20 h-12 bg-primary text-primary-foreground font-semibold rounded-lg"
                  onClick={() => setCurrent((c) => Math.min(slides.length - 1, c + 1))}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 