"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("Navbar");

  return (
    <nav className="bg-white shadow px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <span className="font-bold text-xl">Das Kann Kredit</span>
        <div className="flex space-x-6">
          <Link href="/" className="hover:underline">
            {t("home")}
          </Link>
          <Link href="/products" className="hover:underline">
            {t("products")}
          </Link>
          <Link href="/contact" className="hover:underline">
            {t("contact")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
