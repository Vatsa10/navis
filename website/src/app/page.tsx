import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Install from "@/components/Install";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="install">
        <Install />
      </div>
      <Footer />
    </>
  );
}
