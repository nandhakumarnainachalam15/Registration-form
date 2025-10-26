import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../Api/api";

export const fetchUsers = createAsyncThunk("user/fetchAll", async () => {
  const res = await API.get("/users");
  return res.data;
});

export const fetchUserById = createAsyncThunk("user/fetchById", async (id, thunkAPI) => {
  try {
    const res = await API.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Unable to fetch user");
  }
});

export const registerUser = createAsyncThunk("user/register", async (userData, thunkAPI) => {
  try {
    const res = await API.post("/users", userData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

export const updateUser = createAsyncThunk("user/update", async ({ id, userData }, thunkAPI) => {
  try {
    const res = await API.put(`/users/${id}`, userData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Update failed");
  }
});

export const deleteUser = createAsyncThunk("user/delete", async (id, thunkAPI) => {
  try {
    await API.delete(`/users/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Delete failed");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: { users: [], selectedUser: null, message: "", error: "" },
  reducers: {
    
    clearMessage: (state) => {
      state.message = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
        const updated = action.payload.user;
        state.users = state.users.map((u) => (u._id === updated._id ? updated : u));
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { clearMessage } = userSlice.actions; // ✅ export it
export default userSlice.reducer;
