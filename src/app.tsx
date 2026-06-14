import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { createSignal, Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";

import Scrollbar from "~/components/Scrollbar";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Transition from "~/components/Transition";

export default function App() {
  const [isDuringTransition, setIsDuringTransition] = createSignal(true);

  return (
    <MetaProvider>
      <Router
        root={(props) => (
          <Scrollbar isDuringTransition={isDuringTransition()}>
            <Header isDuringTransition={isDuringTransition()} />
            <Transition onTransition={setIsDuringTransition}>
              <Suspense>{props.children}</Suspense>
              <Footer />
            </Transition>
          </Scrollbar>
        )}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
