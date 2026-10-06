import { test, expect } from "claude-code/testing";
import type { RenderPropsOf } from "claude-code";
const props: RenderPropsOf["Pane"] = {
  title: "Higgsfield",
  isFocused: true,
  bodyColumns: 80,
  placement: "inline",
  scroll: { offset: 0, bodyRows: 30 },
  view: {},
};
test("/create opens native panel without a model turn", async ($, on) => {
  on("session.start", ($, e) => ({ cwd: e.cwd }));
  on("command.register", ($, e) => ({ value: { command: e.name } }));
  let opened = "";
  on("ui.open", ($, e) => {
    opened = e.id;
    return { value: undefined };
  });
  on("process.run", () => ({
    value: { exitCode: 0, stdout: "{}", stderr: "" },
  }));
  await $.session.start({
    cwd: "/trusted",
    surface: "terminal",
    isInteractive: true,
  });
  await $.command.run({
    command: "create",
    args: "",
    origin: { kind: "composer" },
    presentation: { isFullscreen: false, columns: 160 },
  });
  expect(opened).toBe("higgsfield-create");
  const ui = await $.ui.mount({
    plugin: "higgsfield-create",
    surface: "terminal",
    component: "Pane",
    requestId: "higgsfield-create",
    props,
  });
  expect(
    (await ui.find({ type: "Text", text: "Higgsfield · CLI oficial" }))?.text,
  ).toBe("Higgsfield · CLI oficial");
  await ui.unmount();
});
test("cached confirmation cannot authorize a newly quoted price", async ($, on) => {
  let quotes = 0;
  let creates = 0;
  on("session.start", ($, e) => ({ cwd: e.cwd }));
  on("command.register", ($, e) => ({ value: { command: e.name } }));
  on("ui.open", () => ({ value: undefined }));
  on("ui.invalidate", () => ({ value: undefined }));
  on("clock.now", () => ({ value: 100 }));
  on("process.run", ($, e) => {
    if (e.argv[2] === "create") creates++;
    const data =
      e.argv[1] === "account"
        ? { credits: 1860 }
        : e.argv[2] === "list"
          ? [
              {
                job_type: "nano_banana_pro",
                type: "image",
                display_name: "Pro",
              },
            ]
          : e.argv[2] === "cost"
            ? { credits: ++quotes === 1 ? 4 : 100 }
            : e.argv[2] === "create"
              ? ["aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa"]
              : {
                  job_type: "nano_banana_pro",
                  type: "image",
                  params: [
                    {
                      name: "prompt",
                      type: "string",
                      required: true,
                      default: null,
                    },
                  ],
                };
    return { value: { exitCode: 0, stdout: JSON.stringify(data), stderr: "" } };
  });
  await $.session.start({
    cwd: "/trusted",
    surface: "terminal",
    isInteractive: true,
  });
  await $.command.run({
    command: "create",
    args: "",
    origin: { kind: "composer" },
    presentation: { isFullscreen: false, columns: 160 },
  });
  const ui = await $.ui.mount({
    plugin: "higgsfield-create",
    surface: "terminal",
    component: "Pane",
    requestId: "higgsfield-create",
    props,
  });
  await ui.input({ key: "prompt", text: "Un tren" });
  await ui.press({ key: "quote" });
  for (let i = 0; i < 30; i++) await ui.redraw();
  expect((await ui.find({ key: "confirm" }))?.text).toBe(
    "Sí, GENERAR y gastar 4 créditos",
  );
  await ui.press({ key: "quote" });
  for (let i = 0; i < 30; i++) await ui.find({ key: "confirm" });
  await ui.press({ key: "confirm" });
  for (let i = 0; i < 30; i++) await ui.find({ key: "confirm" });
  expect(quotes).toBe(2);
  expect(creates).toBe(0);
  await ui.unmount();
});
test("existing job link and secure save through native controls, no generation", async ($, on) => {
  const id = "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa";
  const calls: string[][] = [];
  on("process.run", ($, e) => {
    calls.push([...e.argv]);
    return {
      value: {
        exitCode: 0,
        stderr: "",
        stdout: JSON.stringify(
          e.argv[0] === "python3"
            ? {
                file: e.argv[1]!.replace(
                  /hooks\/save\.py$/,
                  "outputs/higgsfield_1.png",
                ),
              }
            : {
                id,
                status: "completed",
                job_type: "nano_banana_pro",
                result_url: "https://d8j0ntlcm91z4.cloudfront.net/photo.png",
              },
        ),
      },
    };
  });
  on("ui.invalidate", () => ({ value: undefined }));
  const ui = await $.ui.mount({
    plugin: "higgsfield-create",
    surface: "terminal",
    component: "Pane",
    requestId: "higgsfield-create",
    props,
  });
  await ui.input({ key: "job-id", text: id });
  for (let i = 0; i < 30; i++) await ui.redraw();
  expect((await ui.find({ type: "Text", text: /completed/ }))?.text).toBe(
    id + " · completed · nano_banana_pro",
  );
  expect((await ui.find({ type: "Text", text: /https:/ }))?.text).toBe(
    "https://d8j0ntlcm91z4.cloudfront.net/photo.png",
  );
  await ui.press({ key: "save:" + id });
  for (let i = 0; i < 30; i++) await ui.redraw();
  expect(
    calls.some((a) => a[0] === "python3" && a[1]?.endsWith("/hooks/save.py")),
  ).toBe(true);
  expect((await ui.find({ type: "Text", text: /file:\/\// }))?.text).toMatch(
    /outputs\/higgsfield_1\.png$/,
  );
  expect(calls.some((a) => a[2] === "create")).toBe(false);
  await ui.unmount();
});
test("panel reads CLI account/schema; editable prompt, quote and cancellation never spend", async ($, on) => {
  const calls: string[][] = [];
  on("session.start", ($, e) => ({ cwd: e.cwd }));
  on("command.register", ($, e) => ({ value: { command: e.name } }));
  on("ui.open", () => ({ value: undefined }));
  on("ui.invalidate", () => ({ value: undefined }));
  on("clock.now", () => ({ value: 100 }));
  on("process.run", ($, e) => {
    calls.push([...e.argv]);
    const data =
      e.argv[1] === "account"
        ? { credits: 1860, subscription_plan_type: "ultra" }
        : e.argv[2] === "list"
          ? [
              {
                job_type: "nano_banana_pro",
                display_name: "Nano Banana Pro",
                type: "image",
              },
              {
                job_type: "seedance_2_5",
                display_name: "Seedance 2.5",
                type: "video",
              },
            ]
          : e.argv[2] === "cost"
            ? { credits: 4 }
            : {
                job_type: e.argv[3],
                type: e.argv[3] === "seedance_2_5" ? "video" : "image",
                display_name: "Modelo",
                params: [
                  {
                    name: "prompt",
                    type: "string",
                    required: true,
                    default: null,
                  },
                  {
                    name: "aspect_ratio",
                    type: "string",
                    default: "16:9",
                    required: false,
                    enum: ["16:9", "9:16"],
                  },
                  {
                    name: "resolution",
                    type: "string",
                    default: "4k",
                    required: false,
                    enum: ["4k", "2k"],
                  },
                ],
              };
    return { value: { exitCode: 0, stdout: JSON.stringify(data), stderr: "" } };
  });
  await $.session.start({
    cwd: "/trusted",
    surface: "terminal",
    isInteractive: true,
  });
  await $.command.run({
    command: "create",
    args: "",
    origin: { kind: "composer" },
    presentation: { isFullscreen: false, columns: 160 },
  });
  const ui = await $.ui.mount({
    plugin: "higgsfield-create",
    surface: "terminal",
    component: "Pane",
    requestId: "higgsfield-create",
    props,
  });
  expect((await ui.find({ type: "Text", text: /1860 créditos/ }))?.text).toBe(
    "1860 créditos · ultra",
  );
  await ui.input({ key: "prompt", text: "Un tren", kind: "change" });
  await ui.select({ key: "aspect_ratio", value: "9:16" });
  await ui.press({ key: "quote" });
  for (let i = 0; i < 30; i++) await ui.redraw();
  expect(await ui.find({ key: "confirm" })).toBeDefined();
  expect((await ui.find({ type: "Text", text: /Cotización: 4/ }))?.text).toBe(
    "Cotización: 4 créditos · caduca en 60 s",
  );
  expect(calls.some((a) => a[2] === "create")).toBe(false);
  await ui.input({ key: "prompt", text: "Otro tren", kind: "change" });
  await ui.redraw();
  expect(await ui.find({ key: "confirm" })).toBeUndefined();
  await ui.press({ key: "quote" });
  await ui.press({ key: "cancel" });
  for (let i = 0; i < 30; i++) await ui.redraw();
  expect(await ui.find({ key: "confirm" })).toBeUndefined();
  await ui.select({ key: "kind", value: "video" });
  for (let i = 0; i < 30; i++) await ui.redraw();
  expect(calls.some((a) => a[3] === "seedance_2_5")).toBe(true);
  expect(calls.some((a) => a[2] === "create")).toBe(false);
  await ui.unmount();
});
