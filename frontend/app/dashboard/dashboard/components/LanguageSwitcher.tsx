"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  // Remove the first segment (locale) from pathname
  const segments = pathname.split("/").filter(Boolean);
  segments.shift(); // remove current locale
  const pathWithoutLocale = segments.join("/");

  return (
    <div className="flex gap-2 items-center">
      <Link
        href={`/de/${pathWithoutLocale}`}
        className={`px-2 py-1 rounded ${locale === "de" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
      >
        🇩🇪
      </Link>
      <Link
        href={`/en/${pathWithoutLocale}`}
        className={`px-2 py-1 rounded ${locale === "en" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
      >
        🇬🇧
      </Link>
    </div>
  );
}
