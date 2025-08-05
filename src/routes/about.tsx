import { Title } from "@solidjs/meta";
import { createSignal, onMount } from "solid-js";
import { Motion } from "solid-motionone";
import Blob from "~/components/about/Blob";
import TypeWriter from "~/components/about/TypeWriter";

import about from "~/assets/images/about.webp";



const text = `Hello, my name is Harvey, and I am a first-year student at the Georgia Institute of Technology. Majoring in Computer Science, I am passionate about technology, AI, information security, and the general sciences. I enjoy exploring operation systems, optimizing programs, dissecting malwares, and learning from both theory and hands-on experience.

Although I grew up in Beijing, my family originally comes from Ulanqab, Inner Mongolia, where we often visited our wonderful relatives and friends. Many of them still live a traditional life as farmers. 

I enjoy spending hours in college libraries or going outside in search of inspiration. Activities like archery, hiking, and video games usually enriched my free time. I designed and coded this website to share my opinions, discoveries, and experiences. You may notice that I am way too quiet on social medias: they made me feel overwhelming. However, I really enjoy connecting with others. Dropping me a direct message or an email anytime!`

export default function About() {
  let sticky: HTMLDivElement = undefined!;
  let scroll: HTMLElement = undefined!;
  let scrollContainer: HTMLDivElement = undefined!;

  const [progress, setProgress] = createSignal(0);
  const [scrollContainerHeight, setScrollContainerHeight] = createSignal(0);

  function updateProgress() {
    let parent = sticky.parentElement!;
    let rect = sticky.getBoundingClientRect();
    let parentRect = parent.getBoundingClientRect();
    let scrollTop = Math.max(0, -parentRect.top);
    let scrollHeight = parentRect.height - rect.height;
    let progress = Math.min(1, scrollTop / scrollHeight);

    setScrollContainerHeight(scrollContainer.clientHeight - scrollContainer.parentElement!.clientHeight);

    setProgress(progress)
  }

  onMount(() => {
    scroll = document.getElementById("scroll")!;
    scroll.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);

    return () => {
      scroll.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    }
  })


  return (

    <main>
      <Title>harvey-l.com - About</Title>


      <section class="min-h-300vh">

        <div class="w-full h-screen flex items-center bg-cover justify-center md:flex-row flex-col px-10 sticky top-0"
          style="background-image: url(https://lms.d.zhan.com/zhanlms/addon_homework/2024/11/1688396730b4a059ec3/kvblurred.webp);"
          ref={sticky!}
        >
          <Blob href={about} class="md:block hidden" />

          <div class="h-100vh overflow-hidden w-screen max-w-md px-10">

            <div class="h-max"
              ref={scrollContainer!}
              style={{
                "transform": `translateY(${-(Math.min(progress() * 1, 1) * scrollContainerHeight())}px)`,
              }}
            >



              <div class="min-h-50vh">
                <img src={about} class="md:hidden block rounded-50% w-80% ma mt-35" />
              </div>
              <div class="translate-y--50%">
                <h1 class="text-4xl mb-5">
                  About Me
                </h1>

                <p class="text-lg mb-5 op-70">
                  Scroll down -&gt;
                </p>
              </div>

              <Motion.div
                animate={{ opacity: Math.min(progress() * 3, 1) }}
              >
                <h2 class="text-xl font-semibold mt-3">A few paragraphs about you:</h2>

                <TypeWriter text={text} intervalTime={5} progress={Math.min(progress(), 1)} />

              </Motion.div>


              <div class="h-30"></div>

            </div>


          </div>

        </div>


      </section>
    </main>
  )
}
