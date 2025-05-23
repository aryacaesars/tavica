import TeamMembers from "@/components/about-us/team-members";
import ExplanationSection from "@/components/about-us/explanation-section";


export default function Home() {
  return (
    <main className="min-h-screen bg-white  flex flex-col items-center justify-between p-24">
      <ExplanationSection />
      <TeamMembers />
    </main>
  )
}
