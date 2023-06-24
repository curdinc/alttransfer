export const stringify: typeof JSON.stringify = (value, replacer, space) =>
  JSON.stringify(
    value,
    (key, value_) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = typeof value_ === "bigint" ? value_.toString() : value_;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return typeof replacer === "function" ? replacer(key, value) : value;
    },
    space
  );
