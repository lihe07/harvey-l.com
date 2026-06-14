import PageHead from "~/components/PageHead";
import { Title } from "@solidjs/meta";
import cover from "~/assets/images/cover-404.webp";
import Button from "~/components/index/Button";
import { useNavigate } from "@solidjs/router";

export default () => {

  const navigate = useNavigate();

  return (
    <main>
      <Title>harvey-l.com - Not Found</Title>
      <PageHead
        title="Nothing here"
        cover={cover}
        description="Work-in-Progress. Check back later!"
        fullscreen
      >
        <div class="flex font-sans items-center sm:gap-5 gap-3">
          <Button
            onClick={() => navigate(-1)}
          >
            <div class="i-fluent-arrow-left-12-filled w-5 h-5 mr-1"></div>
            Back
          </Button>
          <span class="op-80">Or</span>
          <Button onClick={() => navigate("/")}>
            <div class="i-fluent-home-24-filled w-5 h-5 mr-1"></div>
            Home
          </Button>
        </div>

      </PageHead>
    </main>
  );
};
