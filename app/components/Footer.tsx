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
    <section className="footer">
      {footerLinks.map((section) => (
        <div className="columns" key={section.title}>
          <h3>
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
              href={section.href ? `${section.href}${link.href}` : link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ))}
    </section>
  );
}
