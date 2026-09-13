import Header from "@/components/layout/Header";
import DashboardView from "@/components/dashboard/DashboardView";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full pt-16 bg-[var(--color-surface)] min-h-screen">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6">
          <DashboardView />
        </div>
      </main>
    </>
  );
}
