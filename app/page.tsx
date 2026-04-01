import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import GaussianSplat from "./components/GaussianSplat";
import Streaming from "./components/Streaming";
import VideoDemo from "./components/VideoDemo";
import InUse from "./components/InUse";
import ARKitTracking from "./components/ARKitTracking";
import AccessibilitySection from "./components/Accessibility";
import Signup from "./components/Signup";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Streaming />
      <VideoDemo />
      <InUse />
      <ARKitTracking />
      <GaussianSplat />
      <AccessibilitySection />
      <Signup />
      <Footer />
    </>
  );
}
