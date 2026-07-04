import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Capabilities } from "./components/Capabilities";
import { WhyUs } from "./components/WhyUs";
import { About } from "./components/About";
import { Cta } from "./components/Cta";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-page text-foreground">
      <Nav />
      <Hero />
      <Capabilities />
      <WhyUs />
      <About />
      <Cta />
      <Footer />
    </div>
  );
}
