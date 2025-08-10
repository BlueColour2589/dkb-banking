import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Promotions from "../components/Promotions";
import ProductHighlights from "../components/ProductHighlights";
import Sustainability from "../components/Sustainability";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Promotions />
      <ProductHighlights />
      <Sustainability />
      <Footer />
    </>
  );
}