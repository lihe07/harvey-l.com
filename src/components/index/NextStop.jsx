import Section from "../Section";
import Wave from "./Wave";

export default function NextStop(props) {
  return (
    <section class="h-screen flex flex-col justify-between ">
      <Section class="w-full">
        <h1 class="font-sans leading-relaxed text-5xl font-light">
          That's Quite Much.
          <br />
          Next Stop?
        </h1>
      </Section>
      <Wave />
    </section>
  );
}
