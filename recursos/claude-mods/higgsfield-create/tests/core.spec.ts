import { test } from "node:test";
import assert from "node:assert/strict";
import { Studio, jobIds, jobView, type Runner } from "../hooks/core.ts";
import { readFileSync } from "node:fs";
test("job identifiers and preview links are strictly validated", () => {
  const id = "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa";
  assert.deepEqual(jobIds([id]), [id]);
  assert.throws(() => jobIds({ unlim_choice: true }));
  assert.throws(() => jobIds(["--help"]));
  const j = jobView({
    id,
    status: "completed",
    job_type: "nano_banana_pro",
    result_url: "https://d8j0ntlcm91z4.cloudfront.net/photo.png",
  });
  assert.equal(j.url, "https://d8j0ntlcm91z4.cloudfront.net/photo.png");
  for (const url of [
    "javascript:alert(1)",
    "file:///etc/passwd",
    "https://evil.com/a",
    "https://user:pass@d8j0ntlcm91z4.cloudfront.net/a",
  ])
    assert.throws(() => jobView({ id, status: "completed", result_url: url }));
});
const schema = JSON.parse(
  readFileSync(
    new URL("../logs/photo-schema-live.json", import.meta.url),
    "utf8",
  ),
);
test("a replaced quote cannot be confirmed by its old id", async () => {
  const s = new Studio();
  s.setSchema(schema);
  s.edit({ prompt: "Un tren" });
  let calls = 0;
  const run: Runner = async () => {
    calls++;
    return { exitCode: 0, stdout: '{"credits":4}', stderr: "" };
  };
  const q = await s.quote(run, 100);
  await s.quote(run, 101);
  await assert.rejects(() => s.confirm(run, q.id, "GENERAR", 102));
  assert.equal(calls, 2);
});
test("unselect invalidates old schema and quote while preserving editable prompt", async () => {
  const s = new Studio();
  s.setSchema(schema);
  s.edit({ prompt: "Un tren" });
  await s.quote(
    async () => ({ exitCode: 0, stdout: '{"credits":4}', stderr: "" }),
    100,
  );
  s.unselect();
  assert.equal(s.schema, undefined);
  assert.equal(s.quoted, undefined);
  assert.equal(s.request.model, "");
  assert.equal(s.request.params.prompt, "Un tren");
});
test("nullable enums are omitted; invalid flag names cannot reach CLI", async () => {
  const s = new Studio();
  assert.throws(() =>
    s.setSchema({
      ...schema,
      params: [
        ...schema.params,
        { name: "evil;flag", type: "string", default: "x", required: false },
      ],
    }),
  );
  s.setSchema(schema);
  s.edit({ prompt: "" });
  let calls = 0;
  await assert.rejects(() =>
    s.quote(async () => {
      calls++;
      return { exitCode: 0, stdout: '{"credits":4}', stderr: "" };
    }, 100),
  );
  assert.equal(calls, 0);
});
test("schema supplies model ratio resolution and keeps prompt literal", () => {
  const s = new Studio();
  s.setSchema(schema);
  s.edit({ prompt: "$(touch pwn); --foo" });
  assert.equal(s.request.model, "nano_banana_pro");
  assert.equal(s.request.params.aspect_ratio, "1:1");
  assert.equal(s.request.params.resolution, "2k");
  assert.equal(s.request.params.prompt, "$(touch pwn); --foo");
  assert.throws(() => s.edit({ params: { resolution: "inventado" } }));
});
test("cost verb quotes only; explicit confirmation spends once with identical argv", async () => {
  const calls: string[][] = [];
  const run: Runner = async (argv) => {
    calls.push([...argv]);
    return {
      exitCode: 0,
      stdout: JSON.stringify(
        argv[2] === "cost"
          ? { credits: 4 }
          : ["aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa"],
      ),
      stderr: "",
    };
  };
  const s = new Studio();
  s.setSchema(schema);
  s.edit({ prompt: "Literal ; $(x)" });
  const q = await s.quote(run, 100);
  assert.equal(q.credits, 4);
  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.[2], "cost");
  await assert.rejects(() => s.confirm(run, q.id, "no", 101));
  assert.equal(calls.length, 1);
  await s.confirm(run, q.id, "GENERAR", 101);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0]?.slice(3), calls[1]?.slice(3));
  await assert.rejects(() => s.confirm(run, q.id, "GENERAR", 101));
  assert.equal(calls.length, 2);
});
for (const action of ["edit", "schema", "cancel", "expire", "race"] as const)
  test("quote invalidated: " + action, async () => {
    let spends = 0;
    let resolve!: (v: any) => void;
    const run: Runner = async (argv) => {
      if (argv[2] === "create") {
        spends++;
        return { exitCode: 0, stdout: "[]", stderr: "" };
      }
      if (action === "race") return new Promise((r) => (resolve = r));
      return { exitCode: 0, stdout: '{"credits":4}', stderr: "" };
    };
    const s = new Studio();
    s.setSchema(schema);
    s.edit({ prompt: "Un tren" });
    const pending = s.quote(run, 100);
    if (action === "race") {
      await Promise.resolve();
      s.edit({ prompt: "Otro tren" });
      resolve({ exitCode: 0, stdout: '{"credits":4}', stderr: "" });
      await assert.rejects(() => pending);
    } else {
      const q = await pending;
      if (action === "edit") s.edit({ prompt: "Otro tren" });
      if (action === "schema") s.setSchema(schema);
      if (action === "cancel") s.cancel();
      await assert.rejects(() =>
        s.confirm(run, q.id, "GENERAR", action === "expire" ? 60101 : 101),
      );
    }
    assert.equal(spends, 0);
  });
