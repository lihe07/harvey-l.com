import github from "./assets/icons/github.svg";
import twitter from "./assets/icons/twitter.svg";
import email from "./assets/icons/email.svg";
// import qq from "./assets/icons/qq.svg";
import instagram from "./assets/icons/instagram.svg";

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
  // {
  //   icon: qq,
  //   href: "tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=3525904273",
  //   showInFirst: false,
  // },
];

export const footerLinks = [
  {
    name: "General",
    // children: {
    //   Works: "/works",
    //   Blog: "/blog",
    //   Contact: "/contact",
    // },
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
    // children: {
    //   Resume: "/resume",
    //   About: "/about",
    // },

    children: [
      {
        name: "Resume",
        href: "/resume",
      },
      {
        name: "About",
        href: "/about",
      },
    ],
  },
  {
    name: "Friends",
    children: [
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
        target: "_blank",
      },
      {
        name: "Daniel & Toby",
        href: "https://philochat.org/",
        target: "_blank",
      },
    ],
  },
];
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
  other: {
    name: "other",
    color: "#374151", // gray-7
  },
};

export const routes = [
  {
    name: "Works",
    path: "/works",
  },
  {
    name: "Blog",
    path: "/blog",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

