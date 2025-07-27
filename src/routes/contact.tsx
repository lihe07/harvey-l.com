import PageHead from "~/components/PageHead";
import { Title } from "@solidjs/meta";
import "~/assets/styles/markdown.css";
//@ts-ignore
import Content from "~/components/contact/Content.mdx"
import cover from "~/assets/images/cover-contact.webp";

export default () => {
  return (
    <main>
      <Title>harvey-l.com - Contact</Title>
      <PageHead
        title="Get in Touch"
        description="Contact me for any inquiries or just to say hi!"
        cover={cover}
      />
      <div class="px-10 my-10">
        <article class="markdown-body ma max-w-300 ">
          <Content />
        </article>
      </div>
    </main>
  );
};
