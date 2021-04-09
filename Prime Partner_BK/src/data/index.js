// orm.js
import { ORM } from 'redux-orm';
import {  User, } from './models';

const orm = new ORM();
orm.register( User, );

export default orm;
