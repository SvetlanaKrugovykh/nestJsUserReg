export class CreateDto {
  constructor(
    public properties: Array<{ [x: string]: any }>,
    dto: { [x: string]: any },
  ) {
    for (const prop of properties) {
      for (const key in dto) {
        if (prop.name == key) {
          Object.defineProperty(this, key, {
            value: undefined,
            writable: true,
            configurable: true,
            enumerable: true,
          });
          this[key] = dto[key];
        }
      }
    }
  }
}
