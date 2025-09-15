import github from "./assets/icons/github.svg";
import twitter from "./assets/icons/twitter.svg";
import email from "./assets/icons/email.svg";
// import qq from "./assets/icons/qq.svg";
import instagram from "./assets/icons/instagram.svg";

import bg1 from "./assets/images/first/bg3.webp";
import bg2 from "./assets/images/first/atl.webp";
import bg3 from "./assets/images/first/bg2.webp";
import bg4 from "./assets/images/first/bg1.webp";



export const firstBgs = [
  "https://blob.harvey-l.com/2025-08-31_20-06-06_387ae0ee.webp",
  "https://blob.harvey-l.com/57c22c5d870fcf3670ed1479204fd299.webp",
  bg1,
  bg2,
  bg3,
  bg4,
]

export interface Blog {
  cover?: string,
  wideCover?: string,
  title: string,
  tags: string[],
  date?: string,
  location: string,
  href: string,
  slug: string,
}

export const socials: { icon: string, href: string, hideInFirst?: boolean }[] = [
  {
    icon: github,
    href: "https://github.com/lihe07",
  },
  {
    icon: twitter,
    href: "https://twitter.com/hli0407",
    hideInFirst: true,
  },
  {
    icon: email,
    href: "mailto:harvey-l@gatech.edu",
  },
  {
    icon: instagram,
    href: "https://www.instagram.com/hli0407"
  },
];

export const footerLinks: {
  name: string;
  children: ({
    name: string;
    href: string;
    target?: string;
  })[];
}[] = [
    {
      name: "General",
      children: [
        {
          name: "Home",
          href: "/",
        },
        {
          name: "Works",
          href: "/works",
        },
        {
          name: "Blog",
          href: "/blog",
        },
        {
          name: "Contact",
          href: "/contact",
        },
      ],
    },
    {
      name: "Details",
      children: [
        {
          name: "Resume",
          href: "/resume.pdf",
          target: "_blank",
        },
        {
          name: "About",
          href: "/about",
        },
        {
          name: "LinkedIn",
          href: "https://www.linkedin.com/in/hli0407",
          target: "_blank",
        }
      ],
    },
    {
      name: "Friends",
      children: [
        {
          name: "Keijay Huang",
          href: "https://keijay.me/",
          target: "_blank",
        },
        {
          name: "Ziling's Blog",
          href: "https://ziling.moe/",
          target: "_blank",
        },
        {
          name: "Lin's Blog",
          href: "https://dreta.dev",
          target: "_blank",
        },
        {
          name: "¬(🐟∨🐱)",
          href: "https://neitherfishnorcat.com/",
          target: "_blank"
        },
      ],
    },
  ];

export interface Tag {
  name: string,
  color: string,
}

type Tags = { [key: string]: Tag };

export const tags = {
  tech: {
    name: "tech",
    color: "#0369a1", // sky-7
  },
  chem: {
    name: "chem",
    color: "#4338ca", // indigo-7
  },
  opt: {
    name: "opt",
    color: "#047857", // green-7
  },
  ai: {
    name: "AI",
    color: "#0f766e", // teal-7
  },
  re: {
    name: "RE",
    color: "#be123c", // rose-7
  },
  android: {
    name: "android",
    color: "#a21caf", // purple-7
  },
  web: {
    name: "web",
    color: "#d97706", // amber-7
  },
  other: {
    name: "other",
    color: "#374151", // gray-7
  },
} as Tags;

export const routes = [
  {
    name: "About",
    path: "/about",
  },
  {
    name: "ENGL1101",
    path: "/engl",
  },
  {
    name: "Blog",
    path: "/blog",
  },
  {
    name: "Works",
    path: "/works",
    mobileOnly: true, // Only show in mobile nav
  }
];

