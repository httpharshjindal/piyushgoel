import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import { getPortfolioCards, getPortfolioSections } from "./lib/cards";

export default async function Home() {
  const [cards, sections] = await Promise.all([getPortfolioCards(), getPortfolioSections()]);
  return <PortfolioPage initialCards={cards} initialSections={sections} />;
}
