import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import UseCases from "./components/UseCases";
import ExampleFiles from "./components/ExampleFiles";
import Signup from "./components/Signup";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="font-pixel-line text-glow">
      <Navbar />
      <Hero />
      <Features />
      <ExampleFiles />
      {/* <UseCases /> */}
      <Signup />
      <Footer />
    </div>
  );
}
