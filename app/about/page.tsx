import type { Metadata } from "next";
import AboutPageClient from "@/components/AboutPageClient";

export const metadata: Metadata = {
  title: "About | EBOMI TV",
  description:
    "About EBOMI TV — spreading the transformative message of the Cross through uplifting visual media.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}


