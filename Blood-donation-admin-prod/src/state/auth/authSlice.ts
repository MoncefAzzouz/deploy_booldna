import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  adminId: number | null;
  username: string;
  email: string;
  role: string | null;
  token: string | null;
  isSignedIn: boolean;
}

const initialState: AuthState = {
  adminId: null,
  username: "",
  email: "",
  role: null,
  token: null,
  isSignedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (
      state,
      action: PayloadAction<{
        adminId: number;
        username: string;
        email: string;
        role: string;
        token: string;
      }>,
    ) => {
      state.adminId = action.payload.adminId;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.isSignedIn = true;
    },
    removeSession: (state) => {
      state.adminId = null;
      state.username = "";
      state.email = "";
      state.role = null;
      state.token = null;
      state.isSignedIn = false;
    },
  },
});

export const { setSession, removeSession } = authSlice.actions;
export default authSlice.reducer;
