// orm.js
import { ORM } from 'redux-orm';
import { Location, User, AllMessages, ConversationList, RequestList, User_AllPosts } from './models';

const orm = new ORM();
orm.register( Location, User, AllMessages, ConversationList, RequestList, User_AllPosts);

export default orm;
