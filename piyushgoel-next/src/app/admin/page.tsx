import { redirect } from "next/navigation";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import { getPortfolioCards, getPortfolioSections } from "../lib/cards";

const ADMIN_PASS = "af32f2!@#jaf98374883haasf789";

export default async function AdminPage(props: { searchParams: Promise<{ pass?: string }> }) {
  const { pass } = await props.searchParams;

  if (pass !== ADMIN_PASS) {
    redirect("/");
  }

  const [cards, sections] = await Promise.all([getPortfolioCards(), getPortfolioSections()]);
  return <PortfolioPage initialCards={cards} initialSections={sections} adminMode />;
}
