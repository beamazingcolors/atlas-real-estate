export interface ZodIssue {
  message: string;
  path: Array<string | number>;
}

export class ZodError {
  public readonly issues: ZodIssue[];
  constructor(issues: ZodIssue[]) {
    this.issues = issues;
  }
  flatten(): { fieldErrors: Record<string, string[]> } {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of this.issues) {
      const key = String(issue.path[0] ?? "root");
      if (!fieldErrors[key]) {
        fieldErrors[key] = [];
      }
      fieldErrors[key].push(issue.message);
    }
    return { fieldErrors };
  }
}

export type SafeParseReturnType<T> =
  | { success: true; data: T }
  | { success: false; error: ZodError };

export class ZodType<T = unknown> {
  readonly _output!: T;
  private refineFn?: (val: T) => boolean;
  private refineMessage?: string;
  private refinePath?: Array<string | number>;

  optional(): ZodType<T | undefined> {
    return this as unknown as ZodType<T | undefined>;
  }

  default(_def: T): ZodType<T> {
    return this;
  }

  refine(
    check: (val: T) => boolean,
    opts?: { message?: string; path?: Array<string | number> }
  ): this {
    this.refineFn = check;
    this.refineMessage = opts?.message ?? "Validación fallida.";
    this.refinePath = opts?.path ?? [];
    return this;
  }

  safeParse(data: unknown): SafeParseReturnType<T> {
    const typed = data as T;
    if (this.refineFn && !this.refineFn(typed)) {
      return {
        success: false,
        error: new ZodError([
          {
            message: this.refineMessage ?? "Datos inválidos.",
            path: this.refinePath ?? [],
          },
        ]),
      };
    }
    return { success: true, data: typed };
  }

  parse(data: unknown): T {
    const res = this.safeParse(data);
    if (!res.success) {
      throw new Error(res.error.issues[0]?.message ?? "Error de validación.");
    }
    return res.data;
  }
}

class ZodString extends ZodType<string> {
  uuid(_msg?: string): this {
    return this;
  }
  trim(): this {
    return this;
  }
  min(_len: number, _msg?: string): this {
    return this;
  }
  max(_len: number, _msg?: string): this {
    return this;
  }
  email(_msg?: string): this {
    return this;
  }
  url(_msg?: string): this {
    return this;
  }
}

class ZodNumber extends ZodType<number> {
  int(_msg?: string): this {
    return this;
  }
  min(_val: number, _msg?: string): this {
    return this;
  }
  max(_val: number, _msg?: string): this {
    return this;
  }
  positive(_msg?: string): this {
    return this;
  }
  nonnegative(_msg?: string): this {
    return this;
  }
}

class ZodArray<T> extends ZodType<T[]> {
  min(_len: number, _msg?: string): this {
    return this;
  }
}

export const z = {
  string: () => new ZodString(),
  number: () => new ZodNumber(),
  nativeEnum: <T extends Record<string, string | number>>(
    _enumObj: T
  ): ZodType<T[keyof T]> => new ZodType<T[keyof T]>(),
  enum: <const T extends readonly [string, ...string[]]>(
    _values: T
  ): ZodType<T[number]> => new ZodType<T[number]>(),
  array: <T>(schema: ZodType<T>): ZodArray<T> => {
    void schema;
    return new ZodArray<T>();
  },
  object: <T extends Record<string, ZodType<unknown>>>(
    _shape: T
  ): ZodType<{ [K in keyof T]: T[K]["_output"] }> =>
    new ZodType<{ [K in keyof T]: T[K]["_output"] }>(),
};

export namespace z {
  export type infer<T extends ZodType<unknown>> = T["_output"];
}
