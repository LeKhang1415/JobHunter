import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import SearchBar from "./SearchBar";
import TopCompaniesSection from "./TopCompaniesSection";

function HomePage() {
    return (
        <>
            <SearchBar />
            <HeroSection />
            <HowItWorksSection />
            <TopCompaniesSection />
        </>
    );
}

export default HomePage;
