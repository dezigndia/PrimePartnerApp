import { fk, attr, Model } from 'redux-orm';
//-------------------------------------------------------
/**
 * Model For Location Status.
 */
class Location extends Model {
  toString() {
    return `Location: ${this.name}`;
  }
  normalize() {
    return  {
      Location: this.Location.ref
    };
  }
}
Location.modelName = 'Location';
Location.fields = {
  id: attr(),
  lat: attr(),
  lon: attr(),
  createdDatetime: attr(),
  modifiedDatetime: attr(),
};
/**
 * Model For User.
 */
class User extends Model {
  toString() {
    return `User: ${this.name}`;
  }
  normalize() {
    return  {
      User: this.User.ref
    };
  }
}
User.modelName = 'User';
User.fields = {
  user_id : attr(),
  first_name : attr(),
  last_name : attr(),
  number : attr(),
  avatar : attr(),
  gender : attr(),
  looking_for : attr(),
  dob : attr(),
  distance : attr(),
  age : attr(),
  age_min : attr(),
  age_max : attr(),
  fcm_token : attr(),
  access_token : attr(),
  loginFlag : attr(),
  createdDatetime : attr(),
  modifiedDatetime : attr(),
};
/**
 * Model For All Messages.
 */
class AllMessages extends Model {
  toString() {
    return `AllMessages: ${this.name}`;
  }
  normalize() {
    return  {
      AllMessages: this.AllMessages.ref
    };
  }
}
AllMessages.modelName = 'AllMessages';
AllMessages.fields = {
  id: attr(),
  message_content:attr(),
  message_url:attr(),
  receiver_contact:attr(),
  user_contact:attr(),
  read: attr(),
  createdDatetime : attr(),
  modifiedDatetime : attr(),
};
/**
 * Model For conversation list.
 */
class ConversationList extends Model {
  toString() {
    return `ConversationList: ${this.name}`;
  }
  normalize() {
    return  {
      ConversationList: this.ConversationList.ref
    };
  }
}
ConversationList.modelName = 'ConversationList';
ConversationList.fields = {
  id: attr(),
  avatar: attr(),
  conv_id: attr(),
  conversation_id: attr(),
  name: attr(),
  receiver_contact: attr(),
  request :  attr(),
  user_contact: attr(),
  unread_count: attr(),
  createdDatetime : attr(),
  modifiedDatetime : attr(),
};

/**
 * Model For Request list.
 */
class RequestList extends Model {
  toString() {
    return `RequestList: ${this.name}`;
  }
  normalize() {
    return  {
      RequestList: this.RequestList.ref
    };
  }
}
RequestList.modelName = 'RequestList';
RequestList.fields = {
  id: attr(),
  avatar: attr(),
  conv_id: attr(),
  conversation_id: attr(),
  name: attr(),
  receiver_contact: attr(),
  request :  attr(),
  user_contact: attr(),
  createdDatetime : attr(),
  modifiedDatetime : attr(),
};
/**
 * Model For User_AllPosts.
 */
class User_AllPosts extends Model {
  toString() {
    return `User_AllPosts: ${this.name}`;
  }
  normalize() {
    return  {
      User_AllPosts: this.User_AllPosts.ref
    };
  }
}
User_AllPosts.modelName = 'User_AllPosts';
User_AllPosts.fields = {
  id: attr(),
  avatar: attr(),
  first_name: attr(),
  last_name: attr(),
  story_content: attr(),
  receiver_contact: attr(),
  story_url : attr(),
  time: attr(),
  seen: attr(),
  createdDatetime : attr(),
  modifiedDatetime : attr(),
};

export { Location, User, AllMessages, ConversationList, RequestList, User_AllPosts };
