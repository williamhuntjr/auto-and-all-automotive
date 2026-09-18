import Link from "next/link";
import {
  ArrowUpIcon,
  ArrowUpRightIcon,
  ClockIcon,
  HammerIcon,
  ImagesIcon,
  MailIcon,
  MapPinIcon,
  PaintBucketIcon,
  TruckIcon,
  WrenchIcon,
} from "lucide-react";
import { EstimateLink } from "@/components/estimate/estimate-link";

const services = [
  { href: "/body-shop", label: "Collision & Body", Icon: HammerIcon },
  { href: "/custom-paint", label: "Custom Paint", Icon: PaintBucketIcon },
  { href: "/auto-service", label: "Auto Service & Repair", Icon: WrenchIcon },
  { href: "/work", label: "Our Work", Icon: ImagesIcon },
];

const serviceArea = ["Outer Banks", "Chesapeake", "Virginia Beach", "Norfolk", "Portsmouth", "Hampton"];

export function Footer() {
  return (
    <footer className="siteFooter">
      <div className="footerInner">
        <div className="footerCards">
          <a className="footerCard" href="https://maps.app.goo.gl/dn8C8tZeh2MhSafU6" target="_blank" rel="noreferrer">
            <span className="footerIcon"><MapPinIcon size={22}/></span>
            <span className="footerCardText">
              <small>Visit the shop</small>
              <strong>1050 US Highway 158 E</strong>
              <em>Sunbury, NC 27979</em>
            </span>
            <ArrowUpRightIcon className="footerArrow" size={18}/>
          </a>
          <div className="footerCard">
            <span className="footerIcon"><ClockIcon size={22}/></span>
            <span className="footerCardText">
              <small>Hours</small>
              <strong>Mon–Fri 9 AM–6 PM</strong>
              <em>Sat 9 AM–5 PM · Sun closed</em>
            </span>
          </div>
          <a className="footerCard" href="mailto:contact@autoandallautomotive.com">
            <span className="footerIcon"><MailIcon size={22}/></span>
            <span className="footerCardText">
              <small>Email us</small>
              <strong>contact@autoandallautomotive.com</strong>
              <em>Questions about your vehicle?</em>
            </span>
            <ArrowUpRightIcon className="footerArrow" size={18}/>
          </a>
          <div className="footerCard">
            <span className="footerIcon"><TruckIcon size={22}/></span>
            <span className="footerCardText">
              <small>Need a tow?</small>
              <strong>Towing available</strong>
              <em>Reasonably priced, local</em>
            </span>
          </div>
        </div>

        <div className="footerMain">
          <div className="footerBrand">
            <Link className="footerLogoPlate" href="/">
              <img className="footerLogo" src="/auto-and-all-logo-clean.png" alt="Auto And All Automotive"/>
            </Link>
            <p>Collision repair, custom paint and mechanical service under one roof in Sunbury, North Carolina.</p>
            <EstimateLink className="primary">
              Get a free estimate <span>↗</span>
            </EstimateLink>
          </div>
          <div className="footerCol">
            <h3>Services</h3>
            <ul>
              {services.map(({ href, label, Icon }) => (
                <li key={href}>
                  <Link href={href}><Icon size={16}/>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footerCol">
            <h3>Company</h3>
            <ul>
              <li><EstimateLink>Request an estimate</EstimateLink></li>
              <li><Link href="/contact">Contact &amp; directions</Link></li>
            </ul>
          </div>
          <div className="footerCol">
            <h3>Serving</h3>
            <ul className="footerChips">
              {serviceArea.map((place) => (
                <li key={place}>{place}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footerBar">
          <span>© {new Date().getFullYear()} Auto And All Automotive · Sunbury, NC</span>
          <a href="#">Back to top <ArrowUpIcon size={14}/></a>
        </div>
      </div>
    </footer>
  );
}
