import BlazeSlider from "~/assets/scripts/BlazeSlider";
import "blaze-slider/dist/blaze.css";

import "~/assets/styles/swiper.css";

import TagCard from "./TagCard";
import { createSignal, For, onMount } from "solid-js";
import Section from "../Section";
import Math from "../blog/Math";

import svelte from "~/assets/icons/svelte.png";
import solid from "~/assets/icons/solid.svg";
import pytorch from "~/assets/icons/pytorch.png";
import julia from "~/assets/icons/julia.png";
import numpy from "~/assets/icons/numpy.svg";
import rust from "~/assets/icons/rust.png";

import phenyl from "~/assets/images/phenyl.webp";

const icons = [
  {
    icon: svelte,
    href: "https://svelte.dev/",
  },
  {
    icon: solid,
    href: "https://www.solidjs.com",
  },
  {
    icon: pytorch,
    href: "https://pytorch.org",
  },
  {
    icon: rust,
    href: "https://www.rust-lang.org",
  },
  {
    icon: julia,
    href: "https://julialang.org/",
  },
  {
    icon: numpy,
    href: "https://numpy.org/",
  },
];

function Icons() {
  return (
    <div class="grid grid-cols-3 gap-5 grid-rows-2 h-full box-border p-3">
      <For each={icons}>
        {(e) => (
          <a
            href={e.href}
            target="_blank"
            class="block h-full w-full transition-all-300 grayscale-100 hover:grayscale-0"
          >
            <img
              src={e.icon}
              alt={e.href}
              class="h-full w-full block object-contain"
            />
          </a>
        )}
      </For>
    </div>
  );
}

function CoverImage({ src }) {
  return <img src={src} alt="cover" class="w-full h-full object-contain" />;
}

function SigmoidSTE() {
  return (
    <div class="flex flex-col items-center justify-center h-full text-xl gap-5 leading-10">
      <Math>
        {String.raw`
\sum_{i=0}^{ \left \lfloor x \right \rfloor  } \frac{1}{1 + \exp(T (x - i) )}
        `}
      </Math>
      <Math>
        {String.raw`
\sum_{i=0}^{ \left \lfloor x \right \rfloor } T \cdot \frac{\exp(T(x - i))}{(1 + \exp(T(x - i)))^2}
        `}
      </Math>
    </div>
  );
}

function MathProg() {
  return (
    <div class="flex flex-col items-center justify-center h-full text-3xl gap-4">
      <Math>
        {String.raw`
\min Z(\textbf{x})`}
      </Math>
      <Math>
        {String.raw`
\mathrm{s.t.}\ \ \textbf{Ax} = \textbf{b}`}
      </Math>
    </div>
  );
}

function Binary() {
  function R(props) {
    return <span class="text-red-400">{props.children}</span>;
  }
  function G(props) {
    return <span class="text-green-400">{props.children}</span>;
  }
  function Y(props) {
    return <span class="text-yellow-400">{props.children}</span>;
  }

  const [mouseOver, setMouseOver] = createSignal(false);

  return (
    <div
      class="h-full overflow-hidden relative text-left"
      onMouseOver={() => setMouseOver(true)}
      onMouseOut={() => setMouseOver(false)}
    >
      <code
        class="font-mono text-md op-80 transition"
        classList={{
          "!op-10": mouseOver(),
        }}
      >
        <R>7f</R>
        <G>45 4c46</G> <R>0201 01</R>00 0000 0000 0000 0000
        <R> 03</R>00 <G>3e</G>00 <R>01</R>00 0000 <R>e0</R>
        <G>23</G> 0000 0000 0000
        <G> 40</G>00 0000 0000 0000 <G>6071</G> 0000 0000 0000 0000 0000{" "}
        <G>40</G>00 <G>38</G>00 <Y>0d</Y>00 <G>40</G>00 <R>1c</R>00 <R>1b</R>00
        <R> 06</R>00 0000 <R>04</R>00 0000 <G>40</G>00 0000 0000 0000
        <G> 40</G>00 0000 0000 0000 <G>40</G>00 0000 0000 0000
        <R> d802</R> 0000 0000 0000 <R>d802</R> 0000 0000 0000
        <R> 08</R>00 0000 0000 0000 <R> 03</R>00 0000 <R>04</R>00 0000
      </code>
      <code
        class="font-mono absolute top-0 left-0 op-0 w-full tracking-widest transition"
        classList={{
          "!op-80": mouseOver(),
        }}
      >
        <R> .</R>
        <G>ELF</G>
        <R>...</R>.......<R>.</R>.<G>{">"}</G>.<R>.</R>...<R>.</R>
        <G>#</G>......
        <br />
        <G>@</G>.......<G>`</G>
        <G>q</G>..........<G>@</G>.<G>8</G>...<G>@</G>.....
        <br />
        ....<G>@</G>.<G>8</G>...<G>@</G>.......<G>@</G>.............
        <br />
        <R>...</R>.............<R>...</R>.............
        <br />
        <R>..</R>.............<R>.</R>................
        <br />
        <R>..</R>.............<R>..</R>................
        <br />
        <R>.</R>..............<R>.</R>.................
        <br />
        <R>...</R>.............<R>...</R>.............
        <br />
        <R>..</R>.............<R>.</R>................
        <br />
        <R>..</R>.............<R>..</R>................
      </code>
    </div>
  );
}

export default () => {
  let slider;

  onMount(() => {
    slider = new BlazeSlider(document.getElementById("cards-slider"), {
      all: {
        enableAutoplay: true,
        autoplayInterval: 3000,
        transitionDuration: 300,
        slidesToShow: 3,
      },
      "(max-width: 1024px)": {
        slidesToShow: 2,
      },
      "(max-width: 768px)": {
        slidesToShow: 1,
      },
    });
  });

  return (
    <section class="bg-zinc-9">
      <Section class="w-full">
        <div class="tracking-wide text-center pt-20">
          <h1 class="font-sans md:text-15 text-10 font-light mt-0 mb-3">
            Concentrations
          </h1>
          <p class="ma op-80 font-sans text-2xl m0 md:max-w-unset leading-relaxed max-w-70">
            I am active in the following areas.
            <br />
            Click on the tags to explore more!
          </p>
        </div>

        <div class="blaze-slider pt-30 pb-50 md:px-5 px-0" id="cards-slider">
          <div class="blaze-container">
            <div class="blaze-container">
              <div class="blaze-track-container">
                <div class="blaze-track">
                  <TagCard
                    cover={<SigmoidSTE />}
                    text="Artificial Intelligence and Deep Learning"
                    tag="ai"
                  />
                  <TagCard
                    cover={<Binary />}
                    text="Reverse Engineering and Security"
                    tag="re"
                  />
                  <TagCard
                    cover={<Icons />}
                    text="Programming and Latest Technologies"
                    tag="tech"
                  />
                  <TagCard
                    cover={<CoverImage src={phenyl} />}
                    text="Quantum and Computational Chemistry"
                    tag="chem"
                  />
                  <TagCard
                    cover={<MathProg />}
                    text="Operational Research and Optimization"
                    tag="opt"
                  />
                </div>
              </div>

              <div class="flex items-center justify-center mt-10 gap-4">
                <button class="blaze-prev color-white op-70 hover:op-100 active:scale-90 transition"
                  aria-label="Previous"
                >
                  <div class="i-fluent-chevron-left-24-filled w-8 h-8"></div>
                </button>
                <div class="blaze-pagination"></div>
                <button class="blaze-next color-white op-70 hover:op-100 active:scale-90 transition"
                  aria-label="Next"
                >
                  <div class="i-fluent-chevron-right-24-filled w-8 h-8"></div>
                </button>
              </div>

            </div>
          </div>
        </div>
      </Section>
    </section>
  );
};
