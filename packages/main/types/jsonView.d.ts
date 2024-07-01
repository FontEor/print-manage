interface ExtendsMethods {
  setValue(value?: string): void;
  getValue(): string | undefined;
}

export type JsonViewInstance = InstanceType<typeof JsonView> & ExtendsMethods;
