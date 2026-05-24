import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  const footerLinks = [
    {
      title: "Support",
      href: "/support",
      links: [
        { label: "Help Center", href: "#help-center" },
        { label: "Get help with a safety issue", href: "#safety" },
        { label: "Report a concern", href: "#report" },
        { label: "Anti-discrimination", href: "#anti-discrimination" },
        { label: "Travel insurance", href: "#insurance" },
      ],
    },
    {
      title: "Hosting",
      href: "/hosting",
      links: [
        { label: "List Your Space", href: "#homes" },
        { label: "Share Experiences", href: "#experiences" },
        { label: "Offer Extra Services", href: "#services" },
        { label: "Hosting resources", href: "#resources" },
      ],
    },
    {
      title: "Couch Crasher",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Core Values", href: "/values" },
        { label: "Leadership", href: "/leadership" },
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-name">
            Couch Crasher
            <span className="brand-dot" aria-hidden="true">
              ·
            </span>
          </span>
          <p className="brand-sub">Feel at home, everywhere.</p>
        </div>

        <div className="footer-columns">
          {footerLinks.map((section) => (
            <div className="footer-col" key={section.title}>
              <h3 className="col-heading">
                {section.href ? (
                  <Link className="header-links" href={section.href}>
                    {section.title}
                  </Link>
                ) : (
                  section.title
                )}
              </h3>
              {section.links?.map((link) => (
                <Link
                  className="links"
                  key={link.label}
                  href={
                    section.href ? `${section.href}${link.href}` : link.href
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Couch Crasher. All rights reserved.</p>
      </div>
    </footer>
  );
}
