import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import Promotions from "../../components/Promotions";
import AnniversarySection from "../../components/AnniversarySection";
import ProductHighlights from "../../components/ProductHighlights";
import FeedbackSection from "../../components/FeedbackSection"; // NEW - ADD THIS
import Sustainability from "../../components/Sustainability";
import Footer from "../../components/Footer";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  return (
    <>
      <Navbar locale={locale} />
      <Hero />
      <Promotions />
      <AnniversarySection />
      <ProductHighlights />
      <FeedbackSection />  {/* ADD THIS MISSING SECTION */}
      <Sustainability />
      <Footer />
    </>
  );
}