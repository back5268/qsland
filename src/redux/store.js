import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/userInfo';
import toastSlice from './features/toast';
import AddressSlice from "@/redux/features/address";
import rolesSlice from './features/role';
import permissionSlice from './features/permission';
import loadingSlice from './features/loading'

const store = configureStore({
  reducer: {
    user: userSlice,
    toast: toastSlice,
    address: AddressSlice,
    roles: rolesSlice,
    permission: permissionSlice,
    userInfo: userSlice,
    loading: loadingSlice,
  },
})
export default store;