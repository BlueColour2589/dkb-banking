"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} {t("rights")}</p>
        <div className="flex space-x-6">
          <Link href="/privacy" className="hover:underline">
            {t("privacy")}
          </Link>
          <Link href="/terms" className="hover:underline">
            {t("terms")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
