import { createSelector } from 'redux-orm';
import orm from 'src/data';
const dbStateSelector = state => state.data;
/**
 * Location Selector::
 */

const locationSelector = createSelector(
  orm,
  dbStateSelector,
  (state, props) => props,
  (session, props) => {
    var Location = session.Location.withId(0);
    return Object.assign({}, Location.ref)
  }
);
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

/** 
 * Message DataSelector data selector 
*/

const messageDataSelector = createSelector(
  orm,
  dbStateSelector,
  (state, props) => props,
  (session, props) => {
    // session.Chats.filter((t) => t.time < new Date(new Date().getTime() - (24 * 60 * 60 * 1000))).delete();
    // return session.Chats.filter((t) => new Date (t.time).getTime() > new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).getTime() && t.read == false).toModelArray().map(Chat =>
    return session.AllMessages
      .filter((t) => t.user_contact != t.receiver_contact)
      .filter((t) => t.read)
      .toModelArray()
      .map(AllMessage =>
        Object.assign({}, AllMessage.ref)
      );
  }
);
/** 
 * Message Conversation List data selector 
*/

const conversationListDataSelector = createSelector(
  orm,
  dbStateSelector,
  (state, props) => props,
  (session, props) => {
    return session.ConversationList
      .filter((t) => t.user_contact != t.receiver_contact)
       .filter((t)=> !t.user_blocked)
      .toModelArray()
      .map(conversation =>{
        conversation.unread_count = session.AllMessages.filter(t => t.user_contact === conversation.receiver_contact).filter(t => t.read).toModelArray().length
        return Object.assign({}, conversation.ref)
      });
      
  }
);
const requestDataSelector = createSelector(
  orm,
  dbStateSelector,
  (state, props) => props,
  (session, props) => {
    // session.Chats.filter((t) => t.time < new Date(new Date().getTime() - (24 * 60 * 60 * 1000))).delete();
    // return session.Chats.filter((t) => new Date (t.time).getTime() > new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).getTime() && t.read == false).toModelArray().map(Chat =>
    var request = session.RequestList
    if (request == undefined) {
      return Object.assign({}, null)
    } else {
      return session.RequestList
        .filter((t) => t.request == 1)
        .toModelArray()
        .map(req =>
          Object.assign({}, req.ref)
        );
    }
  }
);
/**
 * selector for select all posts.
 */
const storiesDataSelector = createSelector(
  orm,
  dbStateSelector,
  (state, props) => props,
  (session, props) => {
    var posts = session.User_AllPosts
    if (posts == undefined) {
      return Object.assign({}, null)
    } else {
      return session.User_AllPosts
        .filter((t) => t.seen )
        .toModelArray()
        .map(req =>
          Object.assign({}, req.ref)
        );
    }
  }
);

export {
  userDataSelector,
  locationSelector,
  messageDataSelector,
  conversationListDataSelector,
  requestDataSelector,
  storiesDataSelector,
};
