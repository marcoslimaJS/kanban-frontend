import { combineReducers, configureStore } from '@reduxjs/toolkit';
import sidebar from './sidebar';
import auth from './auth/auth';
import boards from './board/boards';
import tasks from './board/tasks';

const reducer = combineReducers({ sidebar, auth, boards, tasks });

const store = configureStore({ reducer });

export default store;
