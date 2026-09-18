import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  EyeIcon,
  ImageIcon,
  LayoutListIcon,
  LockIcon,
} from "lucide-react";

export const metadata: Metadata = { title: "Admin sign in" };

const capabilities = [
  { Icon: LayoutListIcon, text: "Organize service categories and subcategories" },
  { Icon: EyeIcon, text: "Choose what shows on the website" },
  { Icon: ImageIcon, text: "Update headers, descriptions and display order" },
];

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="adminLogin">
      <section className="loginBrand">
        <Link className="loginLogo" href="/" aria-label="Back to the website">
          <Image
            src="/auto-and-all-logo-clean.png"
            alt="Auto And All Automotive"
            width={220}
            height={110}
            priority
          />
        </Link>
        <p className="eyebrow">Content control</p>
        <p className="loginHeadline">Keep your website current.</p>
        <p className="loginLead">
          Sign in to manage the services, descriptions and images customers see
          on the Auto And All Automotive website.
        </p>
        <ul className="loginPoints">
          {capabilities.map(({ Icon, text }) => (
            <li key={text}>
              <span>
                <Icon size={20} />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </section>

      <section className="loginPanel">
        <form action="/api/admin/login" method="post" className="loginCard">
          <p className="eyebrow">Administrator access</p>
          <h1>Sign in</h1>
          <p className="loginHint">
            Enter the administrator password to manage the website.
          </p>
          {error && (
            <p className="loginError" role="alert">
              The password was not accepted. Please try again.
            </p>
          )}
          <label htmlFor="password">Password</label>
          <div className="loginField">
            <LockIcon size={18} aria-hidden="true" />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
            />
          </div>
          <button className="primary" type="submit">
            Sign in <span>↗</span>
          </button>
        </form>
        <Link className="loginBack" href="/">
          <ArrowLeftIcon size={15} /> Back to website
        </Link>
      </section>
    </main>
  );
}
