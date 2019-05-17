// Await this to let the test continue after the current async work
export const promisesResolved = () =>
    new Promise(resolve => setImmediate(resolve));
