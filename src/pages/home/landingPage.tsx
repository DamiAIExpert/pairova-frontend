import Nav from "@/components/landingPage/nav";
import Hero from "@/components/landingPage/hero";
import JobTrend from "@/components/landingPage/jobTrend";
import Oppotunity from "@/components/landingPage/oppotunity";
import NonProfit from "@/components/landingPage/nonProfit";
import Footer from "@/components/landingPage/footer";

const LandingPage = () => {
  return (
    <div>
      <Nav />
      <Hero />
      <JobTrend />
      <Oppotunity />
      <NonProfit />
      <Footer />
    </div>
  );
};

export default LandingPage;
