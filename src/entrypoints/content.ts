import Content from "./content/App.svelte";
import { mount } from "svelte";

import "../lib/styles/global.scss";

export default defineContentScript({
  allFrames: true,
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "backstage-ui",
      position: "inline",
      anchor: "body",
      append: "last",
      mode: "open",
      isolateEvents: ["keyup", "keydown", "keypress"],
      onMount(container) {
        const wrapper = document.createElement("div");
        container.append(wrapper);

        mount(Content, {
          target: wrapper,
        });

        return wrapper;
      },

      onRemove(container) {
        container?.remove();
      },
    });

    ui.mount();

    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "toggle-ui") {
        if (ui.mounted) {
          ui.remove();
        } else {
          ui.mount();
        }
      }
    });
  },
});
