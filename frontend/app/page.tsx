import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Promotions from "../components/Promotions";
import AnniversarySection from "../components/AnniversarySection";
import ProductHighlights from "../components/ProductHighlights";
import FeedbackSection from "../components/FeedbackSection";
import Sustainability from "../components/Sustainability";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Promotions />
      <AnniversarySection />
      <ProductHighlights />
      <FeedbackSection />
      <Sustainability />
      <Footer />
    </>
  );
}