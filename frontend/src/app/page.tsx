import { cookies } from "next/headers";
import { redirect } from "next/navigation"; // Add this
import LandingPage from "@/components/LandingPage";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  // If logged in, send them to the dashboard sub-folder
  if (token) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
