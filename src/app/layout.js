import { Merriweather, Inter } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Eye-Innovations Scientific Research (EISR) | Global Academic Publishing",
  description: "An academic platform dedicated to promoting and disseminating innovative research in the realm of sustainable technologies, AI, and multidisciplinary education.",
  keywords: ["EISR", "Scientific Research", "Academic Publishing", "AI Research", "Sustainability", "Innovation"],
  authors: [{ name: "EISR" }],
  icons: {
    icon: "/logoEISR.png",
    apple: "/logoEISR.png",
  },
  openGraph: {
    title: "Eye-Innovations Scientific Research (EISR)",
    description: "Academic platform dedicated to advancing global scientific research through peer-reviewed journals.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${merriweather.variable} ${inter.variable} font-sans antialiased bg-white text-[#1A1A1A] scroll-pt-24`}
      >
        {children}
      </body>
    </html>
  );
}
