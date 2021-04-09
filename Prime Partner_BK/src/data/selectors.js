import { createSelector } from 'redux-orm';
import orm from 'src/data';
const dbStateSelector = state => state.data;

/**
 * User data Selector::
 */

const userDataSelector = createSelector(
  orm,
  dbStateSelector,
  (state, props) => props,
  (session, props) => {
    var User = session.User.withId(0);
    return Object.assign({}, User.ref)
  }
);


export {
  userDataSelector,
};
