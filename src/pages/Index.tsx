import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { MovieRow } from "@/components/movie-row";
import { TRENDING_MOVIES } from "@/data/movies";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-pantheon-night">
      <Navbar />
      <div className="relative">
        <div className="relative z-10">
          <Hero />
        </div>
        <div className="relative z-30 -mt-32">
          <MovieRow title="Featured Projects" movies={TRENDING_MOVIES} />
        </div>
      </div>
    </div>
  );
}

export default Index;
