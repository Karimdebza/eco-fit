export function autobind(
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;
  return {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      Object.defineProperty(this, _2, {
        value: boundFn,
        configurable: true,
        writable: true,
      });
      return boundFn;
    },
  };
}