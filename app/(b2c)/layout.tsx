import { Header } from "@/components/b2c/Header";
import { Footer } from "@/components/b2c/Footer";

export default function B2CLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-b2c flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
