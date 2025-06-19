import { createSignal, For } from "solid-js";
import { A, useLocation, useNavigate } from "@solidjs/router";

import avatar from "~/assets/images/avatar.115x115.webp";
import { routes } from "~/config";

export default (props) => {
  const location = useLocation();

  const isIndex = () => location.pathname === "/";

  const [mobileNavOpen, setMobileNavOpen] = createSignal(false);

  let lastToggleTime = 0;
  function toggleMobileNav() {
    // Check if the last toggle time is less than 300ms
    if (Date.now() - lastToggleTime < 300) {
      return;
    }
    lastToggleTime = Date.now();
    setMobileNavOpen((e) => !e);
  }

  const navigate = useNavigate();
  function onMobileLinkClick(e) {
    // I am not on mobile
    if (!mobileNavOpen()) return;

    e.preventDefault();
    const href = e.target.getAttribute("href");

    setMobileNavOpen(false);
    setTimeout(() => navigate(href), 100);
  }

  return (
    <header
      class="w-full font-sans z-10 box-border px-10 py-10 transition-all-300
      op-0 animate-fade-in animate-mode-forwards animate-delay-300 animate-duration-300"
      classList={{
        "absolute top-15 left-0": isIndex(),
        "absolute top-0": !isIndex(),
      }}
    >
      {/* Main */}
      <div class="max-w-300 w-full ma flex justify-between items-center select-none">
        <div class="flex items-center">
          <img src={avatar} alt="Avatar" class="w-10 h-10 rounded-50%" />
          <A
            class="ml-5 text-5 font-mono color-white decoration-none transition"
            href="/"
            classList={{
              "op-100 pointer-events-none cursor-default": isIndex(),
              "op-70 hover:op-100 active:scale-90": !isIndex(),
              "!op-70 !cursor-default !pointer-events-none":
                props.isDuringTransition,
            }}
            onClick={onMobileLinkClick}
          >
            lihe.dev
          </A>
        </div>
        {/* Desktop Nav */}
        <div class="items-center sm:flex hidden">
          <For each={routes}>
            {(route) => (
              <div class="ml-5 w-20 flex items-center justify-center">
                <A
                  href={route.path}
                  class="text-5 color-white decoration-none transition"
                  inactiveClass="op-70 hover:op-100 active:scale-90"
                  activeClass="op-100"
                  classList={{
                    "!op-70 cursor-default pointer-events-none":
                      props.isDuringTransition,
                  }}
                >
                  {route.name}
                </A>
              </div>
            )}
          </For>
        </div>
        {/* Mobile Nav */}
        <div class="sm:hidden relative w-7 h-7" onClick={toggleMobileNav}>
          <div
            class="i-mdi-menu absolute w-full h-full transition"
            classList={{
              "op-0": mobileNavOpen(),
              "op-100": !mobileNavOpen(),
            }}
          ></div>
          <div
            class="i-mdi-close absolute w-full h-full transition"
            classList={{
              "op-0 animate-rotate-out animate-duration-150": !mobileNavOpen(),
              "op-100 animate-rotate-in animate-duration-150": mobileNavOpen(),
            }}
          ></div>
        </div>

        {/* Mobile Nav Backdrop */}
        <div
          class="fixed sm:hidden bg-zinc-9 w-full z--2 transition-all h-full top-0 left-0"
          classList={{
            "backdrop-blur-0 bg-op-0 pointer-events-none": !mobileNavOpen(),
            "backdrop-blur-10 bg-op-30 pointer-events-all": mobileNavOpen(),
          }}
          onClick={() => setMobileNavOpen(false)}
        ></div>

        {/* Mobile Nav */}
        <div
          class="fixed sm:hidden left-0 w-screen  z--1 transition-all"
          classList={{
            "op-0 top--30 pointer-events-none": !mobileNavOpen(),
            "op-100 top-0": mobileNavOpen(),
          }}
        >
          <div
            class="px-10 pb-10 bg-zinc-9 rounded-b-8"
            classList={{
              "pt-40": isIndex(),
              "pt-30": !isIndex(),
            }}
          >
            <For each={routes}>
              {(route) => (
                <A
                  href={route.path}
                  class="text-5 color-white decoration-none transition block h-13 flex items-center justify-between"
                  inactiveClass="op-70 hover:op-100 active:scale-98"
                  activeClass="op-100 pointer-events-none"
                  onClick={onMobileLinkClick}
                >
                  {route.name}
                  <div class="i-mdi-arrow-right w-6 h-6"></div>
                </A>
              )}
            </For>
          </div>
        </div>
      </div>
    </header>
  );
};
