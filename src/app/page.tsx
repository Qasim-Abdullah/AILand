import HomeHero from "@/components/Home/HomeHero";
import Navbar from "@/components/Home/Navbar";
import Services from "@/components/Services/Services";
import SubPage from '@/components/Pricing/SubPage'
import TeamSection from '@/components/OurTeam/TeamSection'
import Footer from "@/components/End/Footer";
import Contact from "@/components/Contact/Contact";


export default function Home() {
  return (
    <div className="">
      <main className="">
        <div className="services">
          <Navbar/>
          <HomeHero/>
          <Services />
          <SubPage/>
          <TeamSection/>
          <Contact/>
          <Footer/>
        </div>
      </main>
    </div>
  );
}
