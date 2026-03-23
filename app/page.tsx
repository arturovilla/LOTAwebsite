import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import GaussianSplat from "./components/GaussianSplat";
import Streaming from "./components/Streaming";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <GaussianSplat />
      <Streaming />
      <Footer />
    </>
  );
}
