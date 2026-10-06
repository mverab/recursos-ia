const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export function jobIds(data: unknown): string[] {
  if (
    !Array.isArray(data) ||
    data.length === 0 ||
    data.some((id) => typeof id !== "string" || !UUID.test(id))
  )
    throw new Error(
      "Respuesta de jobs no reconocida; no reintentar automáticamente",
    );
  return data;
}
export function jobView(data: unknown): {
  id: string;
  status: string;
  model?: string;
  url?: string;
} {
  if (!data || typeof data !== "object") throw new Error("Job inválido");
  const d = data as Record<string, unknown>;
  if (
    typeof d.id !== "string" ||
    !UUID.test(d.id) ||
    typeof d.status !== "string"
  )
    throw new Error("Job inválido");
  const view: { id: string; status: string; model?: string; url?: string } = {
    id: d.id,
    status: d.status,
  };
  if (typeof d.job_type === "string") view.model = d.job_type;
  if (d.result_url) {
    if (typeof d.result_url !== "string" || /[\x00-\x20]/.test(d.result_url))
      throw new Error("URL no segura");
    const u = new URL(d.result_url);
    if (
      u.protocol !== "https:" ||
      ![
        "d8j0ntlcm91z4.cloudfront.net",
        "d2ol7oe51mr4n9.cloudfront.net",
      ].includes(u.host) ||
      u.username ||
      u.password ||
      u.hash
    )
      throw new Error("URL fuera del CDN allowlisted");
    view.url = d.result_url;
  }
  return view;
}
export type Param = {
  name: string;
  type: string;
  default: unknown;
  required: boolean;
  enum?: (string | number | boolean)[];
};
export type Schema = {
  job_type: string;
  display_name: string;
  type: string;
  params: Param[];
  rules?: { cel: string; message: string }[];
};
export type Request = {
  model: string;
  params: Record<string, string | number | boolean>;
};
export type Runner = (
  argv: readonly string[],
) => Promise<{ exitCode: number; stdout: string; stderr: string }>;
export type Quote = {
  id: number;
  credits: number;
  expires: number;
  argv: string[];
};
export async function cli(run: Runner, argv: readonly string[]): Promise<any> {
  const result = await run(argv);
  if (result.exitCode !== 0)
    throw new Error(
      "Higgsfield rechazó la operación; revisa autenticación/permisos/schema en CLI.",
    );
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error("Respuesta CLI no es JSON válido");
  }
}
export class Studio {
  quoted?: Quote;
  private serial = 0;
  private revision = 0;
  cancel() {
    this.revision++;
    this.quoted = undefined;
  }
  schema?: Schema;
  unselect() {
    this.cancel();
    this.schema = undefined;
    this.request = {
      model: "",
      params: { prompt: this.request.params.prompt ?? "" },
    };
  }
  async quote(run: Runner, now: number | Promise<number>): Promise<Quote> {
    this.cancel();
    const revision = this.revision;
    if (
      !this.schema ||
      !this.request.model ||
      typeof this.request.params.prompt !== "string" ||
      !this.request.params.prompt.trim()
    )
      throw new Error("Escribe un prompt antes de cotizar");
    const argv = ["higgsfield", "generate", "cost", this.request.model];
    for (const [k, v] of Object.entries(this.request.params))
      argv.push("--" + k, String(v));
    argv.push("--json");
    const timestamp = await now;
    const data = await cli(run, argv);
    if (this.revision !== revision)
      throw new Error("Quote descartado: parámetros cambiados o cancelación");
    if (
      typeof data.credits !== "number" ||
      !Number.isFinite(data.credits) ||
      data.credits < 0
    )
      throw new Error("Quote inválido");
    return (this.quoted = {
      id: ++this.serial,
      credits: data.credits,
      expires: timestamp + 60000,
      argv,
    });
  }
  async confirm(
    run: Runner,
    id: number,
    answer: string,
    now: number,
  ): Promise<any> {
    const q = this.quoted;
    if (answer !== "GENERAR" || !q || q.id !== id || now > q.expires)
      throw new Error("Confirmación explícita y quote vigente requeridos");
    this.quoted = undefined;
    const argv = [...q.argv];
    argv[2] = "create";
    return cli(run, argv);
  }
  request: Request = { model: "", params: {} };
  setSchema(schema: Schema) {
    this.cancel();
    if (
      !/^[a-z][a-z0-9_]*$/.test(schema.job_type) ||
      !["image", "video"].includes(schema.type)
    )
      throw new Error("Modelo inválido");
    const params: Request["params"] = {};
    for (const p of schema.params) {
      if (!/^[a-z][a-z0-9_]*$/.test(p.name))
        throw new Error("Nombre de parámetro inválido");
      if (
        ["string", "integer", "number", "boolean"].includes(p.type) &&
        p.default !== null &&
        p.default !== undefined
      )
        params[p.name] = p.default as string | number | boolean;
    }
    params.prompt = this.request.params.prompt ?? "";
    this.schema = schema;
    this.request = { model: schema.job_type, params };
  }
  edit(change: { prompt?: string; params?: Request["params"] }) {
    this.cancel();
    const params = {
      ...this.request.params,
      ...change.params,
      ...(change.prompt === undefined ? {} : { prompt: change.prompt }),
    };
    for (const [key, value] of Object.entries(params)) {
      const p = this.schema?.params.find((p) => p.name === key);
      if (!p || !/^[a-z][a-z0-9_]*$/.test(key))
        throw new Error("Parámetro desconocido");
      if (p.enum && !p.enum.includes(value))
        throw new Error("Valor fuera de schema");
      if (
        (p.type === "string" && typeof value !== "string") ||
        (p.type === "boolean" && typeof value !== "boolean") ||
        (["integer", "number"].includes(p.type) &&
          (typeof value !== "number" || !Number.isFinite(value)))
      )
        throw new Error("Tipo inválido");
      if (p.type === "integer" && !Number.isInteger(value))
        throw new Error("Entero requerido");
    }
    this.request = { model: this.request.model, params };
  }
}
