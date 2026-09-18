import { Header } from "@/components/layout/header";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-json-ld";
import { Footer } from "@/components/layout/footer";
import { NavbarMobile } from "@/components/layout/navbar-mobile";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LocalBusinessJsonLd />
      <Header />
      {children}
      <Footer />
      <NavbarMobile />
    </>
  );
}
