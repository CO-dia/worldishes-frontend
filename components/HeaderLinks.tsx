import Link from "next/link";

export default function HeaderLinks() {
  const links: {
    href: string;
    label: string;
  }[] = [
      {
        href: "/",
        label: "Home",
      },
      {
        href: "/recipes",
        label: "Recipes",
      },
      {
        href: "/#faq",
        label: "FAQ",
      },
    ];

  return (
    <nav>
      <ul className="flex border-2 gap-10 md:gap-16 lg:gap-20 py-2 px-7 bg-gray-500/5 shadow-md rounded-full">
        {links.map((link) => (
          <li key={link.href} className="hover:underline underline-offset-2">
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
