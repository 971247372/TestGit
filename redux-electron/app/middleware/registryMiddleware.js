import { isPlainObject } from 'lodash';

export const STORE_INJECT = Symbol('@@STORE_INJECT');

export default function registryMiddleware(registry) {
  return () => next => action => {
    if (isPlainObject(action) && Object.prototype.hasOwnProperty.call(action, STORE_INJECT)) {
      const { reducers } = action[STORE_INJECT];

      if (reducers) {
        registry.injectReducers(reducers);
      }

      return;
    }

    return next(action);
  };
}
