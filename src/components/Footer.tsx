import { For } from "solid-js";
import { footerLinks, socials } from "../config";
import Section from "./Section";
import avatar from "~/assets/images/avatar.115x115.webp";
import { A } from "@solidjs/router";

function Card(props: { children: any }) {
  return (
    <div class="bg-black bg-op-50 rounded-xl py-7 md:px-10 px-5 flex-1">
      {props.children}
    </div>
  );
}

function Socials() {
  return (
    <div class="flex items-center  justify-between">
      <For each={socials}>
        {(social) => (
          <a href={social.href} target="_blank" rel="noreferrer" class="op-70 transition hover:op-100 active:scale-95" >
            <img src={social.icon} alt={social.href} class="w-10 h-10" />
          </a>
        )}
      </For>
    </div>
  );
}

function ExternalLink(props: { href: string; children: any; }) {
  return (
    <a href={props.href} target="_blank" rel="noreferrer" class="hover:op-70 focus:op-70 transition active:op-50 font-italic">
      {props.children}
    </a>
  )
}


function Profile() {
  return (
    <div>
      <div class="flex gap-5 items-center justify-center">
        <img
          src={avatar}
          alt="Avatar"
          class="md:w-18 md:h-18 h-15 w-15 rounded-1/2"
        />
        <h2 class="font-sans lg:text-2xl text-xl font-bold">Harvey-L.com</h2>
      </div>
      <p class="op-70 font-sans leading-loose text-lg mt-3">
        Made with{" "}
        <ExternalLink
          href="https://start.solidjs.com/"
        >
          SolidStart
        </ExternalLink>
        {" and "}
        <ExternalLink href="https://unocss.dev/">
          UnoCSS
        </ExternalLink>
        <br />
        Source available on Github:{" "}
        <ExternalLink
          href="https://github.com/lihe07/harvey-l.com"
        >
          lihe07/harvey-l.com
        </ExternalLink>
        <br />
        Thanks for visiting {"(>▽<)!"}
      </p>
    </div>
  );
}

function Links() {
  return (
    <div class="flex h-full items-center">
      <div class="flex font-sans lg:pl-5 w-full">
        <For each={footerLinks}>
          {(link) => (
            <div class="md:m-5 flex-1">
              <h3 class="md:text-2xl mt-0 md:mb-8 mb-5">{link.name}</h3>
              <For each={link.children}>
                {(link) => (
                  <A
                    href={link.href}
                    class="block md:mt-5 mt-3 color-white decoration-none md:text-xl text-lg op-70 hover:op-100 transition active:op-50"
                    target={link.target}
                  >
                    {link.name}
                  </A>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default () => {
  return (
    <footer class="bg-#164E63 md:py-20 py-15">
      <Section>
        <div class="flex gap-10 md:flex-row flex-col">
          <div>
            <Card>
              <Socials />
            </Card>
            <div class="h-10" />
            <Card>
              <Profile />
            </Card>
          </div>

          <Card>
            <Links />
          </Card>
        </div>
      </Section>
    </footer>
  );
};
