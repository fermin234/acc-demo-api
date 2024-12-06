export type ClassMethod = (...args: any[]) => any;

export type Constructor<T = any> = new (...args: any[]) => T;

export interface ControllerMetadata {
  metatype: Constructor;
  instance: ControllerInstance;
}
export type Endpoints = Record<string, Endpoint>;
export type ControllerInstance = Record<string, unknown>;
export interface Endpoint {
  basePath?: string;
  methods: Set<string>;
}

export type EndpointMetadata =
  | {
      entity: string;
    }
  | undefined;
