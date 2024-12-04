import {combineReducers, configureStore} from '@reduxjs/toolkit'
import userReducer from './userSlice'
import storage from 'redux-persist/lib/storage'
import persistReducer from 'redux-persist/es/persistReducer' // lưu trữ trạng thái
import persistStore from 'redux-persist/es/persistStore' // theo dõi trạng thái đã lưu

const persisConfig={
    key:'root',
    version:1,
    storage
}
const rootReducer = combineReducers({
    user: userReducer,
  });
const persistedReducer=persistReducer(persisConfig,rootReducer)

export const store=configureStore({
    reducer:persistedReducer
})

export const persistor=persistStore(store)
