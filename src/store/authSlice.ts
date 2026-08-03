import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string;
  username: string;
}

const initialState: AuthState = {
  token: "",
  username: ""
};



const authSlice = createSlice({
  name: "auth",

  initialState,
  

  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    }
  }
});

export const { setToken, setUsername } = authSlice.actions;
export default authSlice.reducer;