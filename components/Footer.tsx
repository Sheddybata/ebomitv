"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { SITE_CONTACT, SOCIAL_LINKS } from "@/lib/site-contact";
import { useI18n } from "@/lib/i18n";

const SocialIcon = ({ label }: { label: string }) => {
  const className = "w-4 h-4 text-ministry-gold";
  switch (label.toLowerCase()) {
    case "facebook":
      return <Facebook className={className} aria-hidden />;
    case "instagram":
      return <Instagram className={className} aria-hidden />;
    case "youtube":
      return <Youtube className={className} aria-hidden />;
    default:
      return null;
  }
};

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative z-10 mt-14 border-t border-[rgba(var(--foreground),0.12)] bg-[rgba(var(--background),0.65)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="text-foreground font-semibold tracking-wide">EBOMI TV</p>
            <p className="mt-3 text-foreground/70 leading-relaxed max-w-md">
              {t("footer.description")}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-foreground font-semibold tracking-wide">{t("footer.connect")}</p>
            <ul className="mt-4 space-y-2">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-foreground/70 hover:text-ministry-gold transition-colors"
                  >
                    <SocialIcon label={s.label} />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-foreground font-semibold tracking-wide">{t("footer.contact")}</p>
            <div className="mt-4 space-y-3 text-foreground/70">
              <p>
                <a
                  className="hover:text-ministry-gold transition-colors"
                  href={`tel:${SITE_CONTACT.phoneE164}`}
                >
                  {SITE_CONTACT.phoneDisplay}
                </a>
              </p>
              <p>
                <a
                  className="hover:text-ministry-gold transition-colors"
                  href={`mailto:${SITE_CONTACT.email}`}
                >
                  {SITE_CONTACT.email}
                </a>
              </p>
              <p className="leading-relaxed">{SITE_CONTACT.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-[rgba(var(--foreground),0.12)] pt-6">
          <p className="text-foreground/55 text-sm">
            © {new Date().getFullYear()} EBOMI TV. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link className="text-foreground/60 hover:text-ministry-gold transition-colors" href="/about">
              {t("nav.about")}
            </Link>
            <Link className="text-foreground/60 hover:text-ministry-gold transition-colors" href="/gallery">
              {t("nav.gallery")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


