// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';

import deviceReducer from './slices/deviceSlice';
import installationReducer from './slices/installationSlice';
import serviceReducer from './slices/serviceSlice';
import contractReducer from './slices/contractSlice';
import alertReducer from './slices/alertSlice';

const store = configureStore({
  reducer: {
    devices: deviceReducer,
    installations: installationReducer,
    services: serviceReducer,
    contracts: contractReducer,
    alerts: alertReducer,
  },
});

export default store;
