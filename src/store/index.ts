import { configureStore } from '@reduxjs/toolkit';
import { employeeAuthApi } from '../api/auth/EmployeeAuthApi.ts';
import authReducer, { checkToken } from '../pages/Employe/EmployeeAuth/authSlice.ts';
import { shopApi } from '../api/shop/ShopApi.ts';
import { queueApi } from '../api/queue/QueueApi.ts';
import { customerApi } from '../api/customer/CustomerApi.ts';
import { postApi } from '../api/post/PostApi.ts';

export const store = configureStore({
  reducer: {
    [customerApi.reducerPath]: customerApi.reducer,
    [employeeAuthApi.reducerPath]: employeeAuthApi.reducer,
    [queueApi.reducerPath]: queueApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(customerApi.middleware)
      .concat(employeeAuthApi.middleware)
      .concat(shopApi.middleware)
      .concat(postApi.middleware)
      .concat(queueApi.middleware),
});

store.dispatch(checkToken());

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
