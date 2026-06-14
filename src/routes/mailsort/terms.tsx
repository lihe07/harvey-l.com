import PageHead from "~/components/PageHead";
import { Meta, Title } from "@solidjs/meta";
import "~/assets/styles/markdown.css";
//@ts-ignore
import Content from "~/components/mailsort/Terms.mdx"

// Unlinked page for the Span-02 Email Sorter's Google OAuth consent screen.
export default () => {
  return (
    <main>
      <Title>harvey-l.com - Span-02 Email Sorter Terms of Service</Title>
      <Meta name="robots" content="noindex" />
      <PageHead
        title="Terms of Service"
        description="Span-02 Email Sorter"
      />
      <div class="px-10 my-10">
        <article class="markdown-body ma max-w-300 ">
          <Content />
        </article>
      </div>
    </main>
  );
};
