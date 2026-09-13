import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardView from "@/components/dashboard/DashboardView";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="w-full pt-20 bg-[var(--color-surface)] flex-1">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6">
          <DashboardView />
        </div>
      </main>
      <Footer />
    </div>
  );
}
