import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        currentAdmin: null,
        loading: false,
        error: null
    },
    reducers: {
        adminLoginSuccess: (state, action) => {
            state.currentAdmin = action.payload;
            state.loading = false;
            state.error = null;
        },
        adminLogout: (state) => {
            state.currentAdmin = null;
        }
    }
});

export const { adminLoginSuccess, adminLogout } = adminSlice.actions;
export default adminSlice.reducer; 