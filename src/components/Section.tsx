export default function Section(props: { children: any, class?: string }) {
  return (
    <div class="px-10">
      <section class={`max-w-300 ma ${props.class || ""}`}>
        {props.children}
      </section>
    </div>
  );
}
