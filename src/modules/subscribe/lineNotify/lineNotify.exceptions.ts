export class PathNotFoundError extends Error {
  constructor(path: string) {
    super(`The path is incorrect: ${path}`);
  }
}
