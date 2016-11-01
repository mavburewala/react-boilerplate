/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import {
  CHANGE_USERNAME,
} from './constants';
import { fromJS } from 'immutable';

// The initial state of the App


let initialState =  typeof(window) !== 'undefined' ? window.__data: {}; // eslint-disable-line

const hell = initialState.home? { home: initialState.home }: {
  username: '',
};

// try {
//   const restoredState = await getStoredState(persistConfig);
//   initialState = _.merge({
//     username: '',
//   }, hell, restoredState);
//   console.log("Home intial state: ", initialState);
// } catch (error) {
//   console.log('error restoring state:', error);
// }

console.log("Home initial state is: ", hell);
initialState = fromJS(hell);

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_USERNAME:

      // Delete prefixed '@' from the github username
      return state
        .set('username', action.name.replace(/@/gi, ''));
    default:
      return state;
  }
}

export default homeReducer;
