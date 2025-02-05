import {createSlice} from '@reduxjs/toolkit';
import {TFoodPendingForStore} from '../../models';

export const kitchenSliceKey = 'kitchen';

type KitchenState = {
  pendingfoods: TFoodPendingForStore[];
};

const initialState: KitchenState = {
  pendingfoods: [],
};

export const KitchenSlice = createSlice({
  name: kitchenSliceKey,
  initialState,
  reducers: {},
});
