import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeaturedProjectsRow } from "@/components/featured-projects-row";
import { FEATURED_PROJECTS } from "@/data/featured-projects";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-pantheon-night">
      <Navbar />
      <div className="relative">
        <div className="relative z-10">
          <Hero />
        </div>
        <div className="relative z-30 -mt-32">
          <FeaturedProjectsRow title="Featured Projects" movies={FEATURED_PROJECTS} />
        </div>
      </div>
    </div>
  );
}

export default Index;
