import type { Register, EngineInterface } from "claude-code";
import {
  Studio,
  cli,
  jobIds,
  jobView,
  type Schema,
  type Runner,
} from "./core.ts";
type Model = { job_type: string; display_name: string; type: string };
const runner =
  ($: EngineInterface): Runner =>
  (argv) =>
    $.process.run(argv, { timeoutMs: 60000 });
const redraw = ($: EngineInterface) => $.ui.invalidate("ui.render");
async function act(
  $: EngineInterface,
  state: { busy: boolean; error: string },
  fn: () => Promise<unknown>,
) {
  if (state.busy) return;
  state.busy = true;
  state.error = "";
  redraw($);
  try {
    await fn();
  } catch (e) {
    state.error = e instanceof Error ? e.message : "Operación rechazada";
  } finally {
    state.busy = false;
    redraw($);
  }
}
async function loadModel(
  $: EngineInterface,
  models: Model[],
  kind: string,
  studio: Studio,
  id: string,
) {
  studio.unselect();
  redraw($);
  if (!models.some((m) => m.job_type === id && m.type === kind))
    throw new Error("Modelo no disponible");
  const schema: Schema = await cli(runner($), [
    "higgsfield",
    "model",
    "get",
    id,
    "--json",
  ]);
  if (schema.job_type !== id || schema.type !== kind)
    throw new Error("Schema no coincide");
  studio.setSchema(schema);
}
export const register: Register = (on) => {
  const studio = new Studio();
  let models: Model[] = [];
  let kind = "image";
  let balance = "Saldo no leído";
  const state = { error: "", busy: false };
  let jobs: ReturnType<typeof jobView>[] = [];
  let saved: string[] = [];
  on("session.start", async ($, e, next) => {
    await $.command.register({
      name: "create",
      description: "Studio Higgsfield · Photo/Video · quote antes de gastar",
    });
    return next(e);
  });
  on("command.run", { command: "create" }, async ($) => {
    studio.cancel();
    await $.ui.open({
      id: "higgsfield-create",
      title: "Higgsfield",
      focus: true,
      closeOnEscape: true,
      rows: 28,
    });
    await act($, state, async () => {
      const account = await cli(runner($), [
        "higgsfield",
        "account",
        "status",
        "--json",
      ]);
      if (typeof account.credits !== "number")
        throw new Error("Saldo no válido");
      balance = `${account.credits} créditos · ${account.subscription_plan_type ?? "plan desconocido"}`;
      const list = await cli(runner($), [
        "higgsfield",
        "model",
        "list",
        "--json",
      ]);
      if (!Array.isArray(list)) throw new Error("Catálogo no válido");
      models = list.filter(
        (m: Model) =>
          ["image", "video"].includes(m.type) &&
          /^[a-z][a-z0-9_]*$/.test(m.job_type),
      );
      const id =
        models.find(
          (m) =>
            m.job_type ===
            (kind === "image" ? "nano_banana_pro" : "seedance_2_5"),
        )?.job_type ?? models.find((m) => m.type === kind)?.job_type;
      if (!id) throw new Error("Sin modelos disponibles");
      await loadModel($, models, kind, studio, id);
    });
    return {};
  });
  on("ui.close", ($, e, next) => {
    if (e.id === "higgsfield-create") studio.cancel();
    return next(e);
  });
  on("ui.render", { component: "Pane" }, ($, e, next) => {
    if (e.requestId !== "higgsfield-create" || e.surface !== "terminal")
      return next(e);
    const { Box, Text, Button, Input, Select } = $.ui.resolve(e);
    const quoted = studio.quoted;
    const edit = (prompt: string) => {
      studio.edit({ prompt });
      redraw($);
    };
    return (
      <Box flexDirection="column">
        <Text key="studio-title">Higgsfield · CLI oficial</Text>
        <Text>{balance}</Text>
        <Text dimColor>
          Reconstrucción original; adaptación del MCP a CLI. Ningún gasto al
          abrir.
        </Text>
        {state.error && <Text color="red">{state.error}</Text>}
        {state.busy && <Text>Consultando…</Text>}
        <Select
          key="kind"
          label="Medio"
          value={kind}
          options={[
            { value: "image", label: "Photo" },
            { value: "video", label: "Video" },
          ]}
          onSelect={(value) => {
            if (state.busy) {
              redraw($);
              return;
            }
            studio.cancel();
            kind = value;
            redraw($);
            return act($, state, async () => {
              const id =
                models.find(
                  (m) =>
                    m.job_type ===
                    (kind === "image" ? "nano_banana_pro" : "seedance_2_5"),
                )?.job_type ?? models.find((m) => m.type === kind)?.job_type;
              if (!id) throw new Error("Sin modelos");
              await loadModel($, models, kind, studio, id);
            });
          }}
        />
        {models.some((m) => m.type === kind) && (
          <Select
            key="model"
            label="Modelo"
            value={studio.request.model}
            options={models
              .filter((m) => m.type === kind)
              .map((m) => ({ value: m.job_type, label: m.display_name }))}
            onSelect={(id) => {
              if (state.busy) {
                redraw($);
                return;
              }
              studio.cancel();
              return act($, state, () =>
                loadModel($, models, kind, studio, id),
              );
            }}
          />
        )}
        {studio.schema && (
          <Input
            key="prompt"
            label="Prompt editable"
            value={String(studio.request.params.prompt ?? "")}
            onInput={edit}
            onSubmit={edit}
          />
        )}
        {studio.schema?.params
          .filter(
            (p) =>
              p.enum &&
              p.enum.length &&
              ["string", "integer", "number", "boolean"].includes(p.type),
          )
          .map((p) => (
            <Select
              key={p.name}
              label={p.name}
              value={String(
                studio.request.params[p.name] ?? p.default ?? p.enum?.[0],
              )}
              options={p.enum!.map((v) => ({
                value: String(v),
                label: String(v),
              }))}
              onSelect={(value) => {
                const val =
                  p.type === "integer" || p.type === "number"
                    ? Number(value)
                    : p.type === "boolean"
                      ? value === "true"
                      : value;
                studio.edit({ params: { [p.name]: val } });
                redraw($);
              }}
            />
          ))}
        {studio.schema?.params
          .filter(
            (p) =>
              !p.enum &&
              p.name !== "prompt" &&
              ["integer", "number", "boolean"].includes(p.type),
          )
          .map((p) => (
            <Input
              key={p.name}
              label={p.name}
              value={String(studio.request.params[p.name] ?? "")}
              onInput={() => {
                studio.cancel();
                redraw($);
              }}
              onSubmit={(value) => {
                studio.edit({
                  params: {
                    [p.name]:
                      p.type === "boolean" ? value === "true" : Number(value),
                  },
                });
                redraw($);
              }}
            />
          ))}
        {studio.schema && (
          <Button
            key="quote"
            label="Cotizar sin generar"
            onPress={() =>
              act($, state, async () => {
                await studio.quote(runner($), $.clock.now());
              })
            }
          />
        )}
        {studio.quoted && (
          <Text>{`Cotización: ${studio.quoted.credits} créditos · caduca en 60 s`}</Text>
        )}
        {quoted && (
          <Button
            key="confirm"
            label={`Sí, GENERAR y gastar ${quoted.credits} créditos`}
            onPress={() =>
              act($, state, async () => {
                const model = studio.request.model;
                const ids = jobIds(
                  await studio.confirm(
                    runner($),
                    quoted.id,
                    "GENERAR",
                    await $.clock.now(),
                  ),
                );
                jobs = ids.map((id) => ({ id, status: "submitted", model }));
              })
            }
          />
        )}
        <Input
          key="job-id"
          label="Consultar job existente (UUID, no genera)"
          onSubmit={(id) =>
            act($, state, async () => {
              jobIds([id]);
              const j = jobView(
                await cli(runner($), [
                  "higgsfield",
                  "generate",
                  "get",
                  id,
                  "--json",
                ]),
              );
              if (j.id !== id) throw new Error("Job no coincide");
              jobs = [j];
            })
          }
        />
        {jobs.map((job) => (
          <Box key={job.id} flexDirection="column">
            <Text>{`${job.id} · ${job.status} · ${job.model ?? "modelo desconocido"}`}</Text>
            {job.model &&
              job.model !== studio.request.model &&
              studio.request.model && (
                <Text>Modelo del job distinto al seleccionado.</Text>
              )}
            <Button
              key={"refresh:" + job.id}
              label="Actualizar estado"
              onPress={() =>
                act($, state, async () => {
                  const j = jobView(
                    await cli(runner($), [
                      "higgsfield",
                      "generate",
                      "get",
                      job.id,
                      "--json",
                    ]),
                  );
                  if (j.id !== job.id) throw new Error("Job no coincide");
                  jobs = jobs.map((v) => (v.id === j.id ? j : v));
                })
              }
            />
            {job.url && <Text>{job.url}</Text>}
            {job.url && (
              <Button
                key={"save:" + job.id}
                label="Guardar en outputs/ (sin sobrescribir)"
                onPress={() =>
                  act($, state, async () => {
                    const result = await cli(runner($), [
                      "python3",
                      `${$.plugin.root}/hooks/save.py`,
                      job.url!,
                      "higgsfield",
                    ]);
                    const expected = `${$.plugin.root}/outputs/`;
                    if (
                      typeof result.file !== "string" ||
                      !result.file.startsWith(expected) ||
                      !/^higgsfield_[0-9]+\.(png|jpg|webp|mp4)$/.test(
                        result.file.slice(expected.length),
                      )
                    )
                      throw new Error("Ruta guardada no permitida");
                    saved.push(new URL("file://" + result.file).href);
                  })
                }
              />
            )}
          </Box>
        ))}
        {saved.map((url) => (
          <Text>{url}</Text>
        ))}
        <Button
          key="cancel"
          label="Cancelar cotización (no cancela un job enviado)"
          onPress={() => {
            studio.cancel();
            redraw($);
          }}
        />
      </Box>
    );
  });
};
