import { createSignal, For, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

import Button from "./Button";
import style from "./First.module.css";

import { socials, firstBgs } from "~/config";
import { Motion } from "solid-motionone";

const Left = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Motion.p class="font-sans sm:text-7 text-5 mt-3 sm:mb-5 mb-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Hello!!
      </Motion.p>
      <Motion.p class="font-serif md:text-13 sm:text-10 text-8 mb-10 mr-7 leading-snug"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        I'm <i>Harvey Li</i>, a CS undergrad<br />
        at <a href="https://www.gatech.edu/" target="_blank" class={"focus:op-85 hover:op-85 inline-block active:scale-98 transition " + style.roboto}>Georgia Tech</a>
      </Motion.p>

      {/* Buttons */}
      <Motion.div class="flex font-sans items-center absolute sm:mr-10 mr-0 sm:gap-5 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button
          onClick={() => {
            document.getElementById("scroll")?.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
          class={style.readmore}
        >
          <svg
            class="mr-1 transition-all"
            width="20"
            height="20"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              d="M8 2a.75.75 0 0 1 .75.75v8.787l2.941-3.287a.75.75 0 1 1 1.118 1L8.559 14a.75.75 0 0 1-1.118 0l-4.25-4.75a.75.75 0 1 1 1.118-1l2.941 3.287V2.75A.75.75 0 0 1 8 2Z"
            />
          </svg>
          Read More
        </Button>
        <span class="op-80">Or</span>
        <Button class={style.contact} onClick={() => navigate("/contact")}>
          <svg
            class={"transition-all " + style.first}
            width="19"
            height="19"
            viewBox="-1 0 17 13"
            fill="currentColor"
          >
            <path
              transform="rotate(45 7 6.5)"
              d="M1.55 4.27C-0.45 6.26 -0.57 9.65 1.51 11.55C2.44 12.4 3.62 12.83 4.81 12.83C6.11 12.83 7.36 12.31 8.27 11.4L13.07 6.56C14.15 5.47 14.14 3.7 13.06 2.62L10.43 0L9.31 1.13L11.58 3.43C12.23 4.08 12.23 5.13 11.58 5.78L7.21 10.17C6.75 10.62 6.21 10.98 5.58 11.12C4.43 11.38 3.3 11.05 2.5 10.25C1.7 9.46 1.36 8.31 1.63 7.16C1.77 6.53 2.13 5.99 2.58 5.53L3.57 4.55L2.42 3.39L1.55 4.27Z"
            />
          </svg>
          <svg
            class={"mr-1 transition-all " + style.second}
            width="19"
            height="19"
            viewBox="0 0 17 13"
            fill="currentColor"
          >
            <path
              transform="rotate(45 7 6.5)"
              d="M6.67,2.66C7.12,2.21 7.67,1.85 8.29,1.71C9.44,1.45 10.58,1.79 11.38,2.58C12.18,3.38 12.52,4.52 12.25,5.68C12.1,6.3 11.75,6.85 11.3,7.3L10.3,8.28L11.47,9.46L12.33,8.56C14.32,6.58 14.45,3.18 12.37,1.28C11.44,0.43 10.25,0 9.07,0C7.77,0 6.52,0.52 5.61,1.44L0.81,6.28C-0.28,7.37 -0.27,9.13 0.82,10.22L3.44,12.84L4.59,11.68L2.29,9.41C1.64,8.75 1.64,7.71 2.29,7.05L6.67,2.66Z "
            />
          </svg>
          Contact
        </Button>
      </Motion.div>
    </div>
  );
};

const Right = () => {
  return (
    <div class="flex flex-col items-center justify-center">
      <For each={socials.filter((e) => !e.hideInFirst)}>
        {(social, i) => (
          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i() * 0.1 }}
          >
            <a
              href={social.href}
              target="_blank"
              class="bg-white bg-op-30 rounded-50% h-12 w-12 block flex items-center justify-center op-70 hover:op-100 active:scale-90 transition m-y-3"
            >
              <img width="28" height="28" src={social.icon} alt={social.href} />
            </a>
          </Motion.div>
        )}
      </For>
    </div>
  );
};
export default () => {

  const [bg, setBg] = createSignal(firstBgs[0]);

  onMount(() => {
    setBg(firstBgs[Math.floor(Math.random() * firstBgs.length)]);
  })


  return (
    <section class="h-screen w-full relative overflow-hidden">
      <Motion.div
        class="absolute top-0 bottom-0 left-0 right-0 bg-center bg-cover"
        style={{ "background-image": `url(${bg()})` }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          easing: "linear",
        }}


      ></Motion.div>
      <div class="h-full w-full backdrop-blur bg-black bg-op-50 flex items-center px-10 box-border">
        <div class="max-w-300 ma w-full flex justify-between">
          {/* Left */}
          <Left />
          <Right />
        </div>
      </div>
    </section >
  );
};
