import { chunk } from 'lodash'

export const fetchJSON = async <T>(input: RequestInfo, init?: RequestInit | undefined): Promise<T> => {
  return new Promise(async (resolve) => {
    const res = await fetch(input, init)
    resolve(await res.json())
  })
}

export const batchedPromise = <T, D>(array: T[], chunkLimit: number, fn: (arr: T[]) => Promise<D>) => {
  const chunks = chunk(array, chunkLimit)
  return Promise.all(chunks.map(chunkedData => fn(chunkedData)))
}

// Suspense integrations like Relay implement
// a contract like this to integrate with React.
// Real implementations can be significantly more complex.
// Don't copy-paste this into your project!
export function suspendablePromise<T>(promiseFn: () => Promise<T>) {
  return function () {
    let status = "pending";
    let result: T;
    let suspender = promiseFn().then(
      r => {
        status = "success";
        result = r;
      },
      e => {
        status = "error";
        result = e;
      }
    );
    return {
      read() {
        if (status === "pending") {
          throw suspender;
        } else if (status === "error") {
          throw result;
        } else if (status === "success") {
          return result;
        }
      }
    };
  }
}