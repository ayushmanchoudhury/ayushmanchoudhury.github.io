import { Hero } from "@/components/sections/hero";
import { ProofStrip } from "@/components/sections/proof-strip";
import { FeaturedWork } from "@/components/sections/featured-work";
import { DashboardGallery } from "@/components/sections/dashboard-gallery";
import { Capabilities } from "@/components/sections/capabilities";
import { CreativeEdge } from "@/components/sections/creative-edge";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { MiniGames } from "@/components/sections/mini-games";
import { Marquee } from "@/components/ui/marquee";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProofStrip />
      <Marquee />
      <FeaturedWork />
      <DashboardGallery />
      <Capabilities />
      <MiniGames />
      <CreativeEdge />
      <About />
      <Contact />
    </main>
  );
}
