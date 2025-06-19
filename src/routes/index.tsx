import { Meta, Title } from "@solidjs/meta";

import First from "~/components/index/First";
import WhatIDo from "~/components/index/WhatIDo";
import Wave from "~/components/index/Wave";
import News from "~/components/index/News";

export default function Home() {
  return (
    <main>
      <Title>harvey-l.com - Home Page</Title>
      <Meta name="description" content="Home Page" />
      <Meta name="keywords" content="Home Page" />
      <First />
      {/* <BasicProfile /> */}
      <WhatIDo />
      <News />

      <Wave class="bg-sky-9" />
    </main>
  );
}

