export class ConflictUserNameError extends Error {
  constructor(username: string) {
    super(`The username has been used: ${username}`);
  }
}

export class ConflictSubscribedPathError extends Error {
  constructor(subscribedPath: string) {
    super(`The subscribed path has been used: ${subscribedPath}`);
  }
}
