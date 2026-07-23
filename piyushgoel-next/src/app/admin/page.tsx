import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import { getPortfolioCards, getPortfolioSections } from "../lib/cards";

export default async function AdminPage() {
  const cookieStore = await cookies();
  if (!cookieStore.has("admin_auth")) {
    redirect("/");
  }

  const [cards, sections] = await Promise.all([getPortfolioCards(), getPortfolioSections()]);
  return <PortfolioPage initialCards={cards} initialSections={sections} adminMode />;
}
