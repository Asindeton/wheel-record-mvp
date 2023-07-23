import { configureStore } from '@reduxjs/toolkit';
import { employeeAuthApi } from '../api/auth/EmployeeAuthApi.ts';
import authReducer, { checkToken } from '../pages/Employe/EmployeeAuth/authSlice.ts';
import { shopApi } from '../api/shop/ShopApi.ts';

export const store = configureStore({
  reducer: {
    [employeeAuthApi.reducerPath]: employeeAuthApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(employeeAuthApi.middleware).concat(shopApi.middleware),
});

store.dispatch(checkToken());

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
