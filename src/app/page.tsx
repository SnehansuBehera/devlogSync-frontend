"use client";

import About from "./components/About";
import Footer from "./components/Footer";
import StepsSection from "./components/Guide";
import LandingPage from "./components/Home";

export default function Home() {
  return (
    <div>
      <LandingPage />
      <About />
      <StepsSection />
      <Footer />
    </div>
  );
}
