/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = () => (state) => state.get('home');

const selectHomeProps = () => (state, ownProps) => ownProps;

const selectUsername = () => createSelector(
  selectHome(),
  (homeState) => homeState.get('username')
);

const currentLogin = () => createSelector(
  selectHomeProps(),
  (props) => props.params.login
);
export {
  selectHome,
  selectUsername,
  currentLogin,
};
