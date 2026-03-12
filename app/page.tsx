import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturedCollections from "./components/FeaturedCollections";
import NewMarket from "./components/NewMarket";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <HeroSection />
        <FeaturedCollections />
        <NewMarket />
      </main>
    </>
  );
}
