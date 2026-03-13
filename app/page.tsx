import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturedCollections from "./components/FeaturedCollections";
import NewMarket from "./components/NewMarket";
import { getFeaturedProperties, getProperties, PAGE_SIZE } from "../lib/properties";

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const [featuredProperties, { properties, totalCount }] = await Promise.all([
    getFeaturedProperties(),
    getProperties(currentPage, PAGE_SIZE),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <HeroSection />
        <FeaturedCollections properties={featuredProperties} />
        <NewMarket
          properties={properties}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </main>
    </>
  );
}
