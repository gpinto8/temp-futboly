export type MakeOptional<T> = {
  [P in keyof T]?: T[P];
};