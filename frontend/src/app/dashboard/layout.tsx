"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  Sparkles,
  Home,
  PenTool,
  Type,
  ImageIcon,
  FileText,
  Users,
  LogOut,
  Zap,
  Menu,
  X,
} from "lucide-react";

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  plan: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncUser = async () => {
      try {
        const rawData = Cookies.get("user_data");
        if (rawData) setUser(JSON.parse(rawData));
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (response.ok) {
          const { user: freshUser } = await response.json();
          setUser(freshUser);
          Cookies.set("user_data", JSON.stringify(freshUser), { expires: 1 });
        } else if (response.status === 401) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Sync error:", error);
      }
    };
    syncUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (response.ok) {
        Cookies.remove("user_data");
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { Icon: Home, label: "Dashboard", href: "/dashboard" },
    { Icon: PenTool, label: "Write Article", href: "/dashboard/write-article" },
    { Icon: Type, label: "Blog Titles", href: "/dashboard/blog-titles" },
    {
      Icon: ImageIcon,
      label: "Generate Images",
      href: "/dashboard/generate-images",
    },
    {
      Icon: FileText,
      label: "Review Resume",
      href: "/dashboard/resume-review",
    },
    { Icon: Users, label: "Profile", href: "/dashboard/profile" },
  ];

  const initials =
    user?.firstName && user?.lastName
      ? (user.firstName[0] + user.lastName[0]).toUpperCase()
      : user?.email?.substring(0, 2).toUpperCase() || "??";

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : user?.email?.split("@")[0] || "Guest";

  return (
    <div className="h-screen w-screen bg-[#1A232E] text-slate-200 flex flex-col lg:flex-row overflow-hidden selection:bg-[#88BDF2]/30">
      {/* --- MOBILE HEADER --- */}
      <header className="lg:hidden h-16 border-b border-white/5 bg-[#1F2937] flex items-center justify-between px-6 shrink-0 z-[70] relative">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#88BDF2]" />
          <span className="font-black tracking-tighter text-sm text-white uppercase italic">
            Canvas.OS
          </span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#88BDF2] hover:bg-white/5 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`
          fixed lg:relative 
          top-16 lg:top-0 
          h-[calc(100vh-64px)] lg:h-full 
          w-[280px] border-r border-white/5 flex flex-col bg-[#1F2937] lg:bg-[#1F2937]/50 backdrop-blur-xl shrink-0 z-[60] transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <Link
          href="/dashboard"
          className="hidden lg:flex h-[80px] items-center gap-3 px-8 border-b border-white/5 shrink-0"
        >
          <div className="bg-[#88BDF2] p-1.5 rounded-lg">
            <Sparkles className="w-5 h-5 text-[#1A232E]" />
          </div>
          <span className="font-black tracking-tighter text-xl text-white italic uppercase">
            Canvas<span className="text-[#88BDF2]">.</span>OS
          </span>
        </Link>

        <nav className="flex-grow px-4 py-8 space-y-1.5 overflow-y-auto scrollbar-none">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all
                  ${isActive ? "bg-[#88BDF2] text-[#1A232E] shadow-lg shadow-[#88BDF2]/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}
                `}
              >
                <item.Icon
                  className={`w-4 h-4 ${isActive ? "text-[#1A232E]" : "group-hover:text-[#88BDF2]"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <footer className="p-4 bg-[#1A232E]/80 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-[#88BDF2]/10 flex items-center justify-center border border-[#88BDF2]/20 text-[#88BDF2] font-black text-xs shrink-0">
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black truncate text-white uppercase tracking-tighter">
                {displayName}
              </p>
              <div className="flex items-center gap-1.5">
                <Zap
                  size={10}
                  className={
                    user?.plan === "PRO"
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-slate-500"
                  }
                />
                <p
                  className={`text-[8px] font-black uppercase tracking-widest ${user?.plan === "PRO" ? "text-yellow-400" : "text-slate-500"}`}
                >
                  {user?.plan || "FREE"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/10 rounded-lg group transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
            </button>
          </div>
        </footer>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto scrollbar-none bg-[#1A232E] relative">
        <div className="w-full max-w-[1440px] mx-auto p-4 md:p-8 lg:p-12 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
