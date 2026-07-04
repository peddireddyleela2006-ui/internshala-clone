import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-3xl font-bold text-blue-400">
              {t("footer.brand.name")}
            </h2>

            <p className="mt-4 text-gray-300 leading-7">
              {t("footer.brand.description")}
            </p>
          </div>

          {/* Internship */}
          <FooterSection
            titleKey="footer.internships.title"
            itemKeys={[
              "footer.internships.software",
              "footer.internships.web",
              "footer.internships.dataScience",
              "footer.internships.marketing",
              "footer.internships.finance",
              "footer.internships.hr",
            ]}
          />

          {/* Jobs */}
          <FooterSection
            titleKey="footer.jobs.title"
            itemKeys={[
              "footer.jobs.frontend",
              "footer.jobs.backend",
              "footer.jobs.fullstack",
              "footer.jobs.designer",
              "footer.jobs.analyst",
              "footer.jobs.devops",
            ]}
          />

          {/* Company */}
          <FooterSection
            titleKey="footer.company.title"
            itemKeys={[
              "footer.company.about",
              "footer.company.careers",
              "footer.company.contact",
              "footer.company.privacy",
              "footer.company.terms",
            ]}
          />

          {/* Support */}
          <FooterSection
            titleKey="footer.support.title"
            itemKeys={[
              "footer.support.help",
              "footer.support.faq",
              "footer.support.report",
              "footer.support.sitemap",
              "footer.support.community",
            ]}
          />
        </div>

        <hr className="border-gray-700 my-10" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <button className="border border-white rounded-lg px-5 py-3 hover:bg-gray-800 transition">
            📱 {t("footer.android")}
          </button>

          <div className="flex gap-5 text-2xl">
            <FaFacebook className="cursor-pointer hover:text-blue-500 transition" />
            <FaTwitter className="cursor-pointer hover:text-sky-400 transition" />
            <FaInstagram className="cursor-pointer hover:text-pink-500 transition" />
          </div>

          <p className="text-gray-400 text-sm text-center">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}

interface FooterSectionProps {
  titleKey: string;
  itemKeys: string[];
}

function FooterSection({
  titleKey,
  itemKeys,
}: FooterSectionProps) {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {t(titleKey)}
      </h3>

      <ul className="space-y-2">
        {itemKeys.map((itemKey) => (
          <li key={itemKey}>
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition"
            >
              {t(itemKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}