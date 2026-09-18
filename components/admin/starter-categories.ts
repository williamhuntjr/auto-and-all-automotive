/** Default service structure offered when the category list is empty. */
export const starterCategories = [
  {
    name: "Collision & Body",
    slug: "body-shop",
    description: "Collision, structural and cosmetic body repair.",
    image: "/collision-photo-header.png",
    children: [
      "Collision Repair",
      "Frame & Structural Repair",
      "Dent & Panel Repair",
      "Paint Matching & Blending",
    ],
  },
  {
    name: "Custom Paint",
    slug: "custom-paint",
    description: "Color changes, graphics and specialty refinishing.",
    image: "/hero-auto-shop.png",
    children: [
      "Complete Color Changes",
      "Custom Graphics & Stripes",
      "Pearl & Metallic Finishes",
      "Restoration Refinishing",
    ],
  },
  {
    name: "Auto Service",
    slug: "auto-service",
    description: "Diagnostics, maintenance and mechanical repair.",
    image: "/service-writer-header.png",
    children: [
      "Computer Diagnostics",
      "Scheduled Maintenance",
      "Brake Service",
      "Steering & Suspension",
      "Cooling & Engine Repair",
    ],
  },
  {
    name: "Online Photo Estimate",
    slug: "estimate",
    description: "Begin an estimate with vehicle and damage photos.",
    image: "/estimator-header.png",
    children: [
      "Collision Photo Estimate",
      "Paint Project Request",
      "Mechanical Service Request",
    ],
  },
];
