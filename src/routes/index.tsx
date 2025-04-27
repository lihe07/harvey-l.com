import { Meta, Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import Counter from "~/components/Counter";

export default function Home() {
  return (
    <main class="text-center mx-auto p-10">
      <Title>harvey-l.com - Work In Progress</Title>
      <h1 class="text-3xl">Work In Progress!</h1>
      <p class="text-xl mt-5">
        Please checkout my old website <a href="https://www.lihe.dev/" class="color-sky">lihe.dev</a>
      </p>
    </main>
  );
}
