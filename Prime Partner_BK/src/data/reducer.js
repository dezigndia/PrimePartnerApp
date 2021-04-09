import * as ActionTypes from 'src/data/actionTypes';
import moment from 'moment';
import _ from 'lodash';
import orm from 'src/data';


const createOrUpdateItem = (SomeModel, payload, idAttr) => {
  if (!payload || _.isEmpty(payload)) {
    return;
  }

  const idField = idAttr || 'id';
  const now = new Date();
  let itemPayload = { ...payload, modifiedDatetime: now };
  if (SomeModel.idExists(payload[idField])) {
    const someItem = SomeModel.withId(payload[idField]);
    someItem.update(itemPayload);
  } else {
    itemPayload = { ...payload, createdDatetime: now };
    SomeModel.create(itemPayload);
  }
};

const deleteModelData = ( modelName )=>{
  modelName.filter((t=> !t.seen)).delete();
} 

export const reducer = (dbState, action) => {
  let sess = orm.session(dbState);
  const { Location, User, AllMessages, ConversationList, RequestList, User_AllPosts } = sess;

  switch (action.type) {
    case ActionTypes.EMPTY_ORM: {
      orm.getEmptyState();
      const initialState = orm.getEmptyState();
      sess = orm.session(initialState);
      break;
    }
    case ActionTypes.USER_DATA: {
      const { User: userPayload } = action;
      createOrUpdateItem(User, userPayload);
      console.log("User, userPayload",User, userPayload);
      break;
    }
    default:
      // Noting need to be done, pass
      break;
  }

  return sess.state;
};
