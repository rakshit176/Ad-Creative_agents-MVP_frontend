import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    userCredit: 0,
    totalCredits:0,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            console.log(action.payload) //test
            state.userData = action?.payload?.user;
            state.userCredit = action?.payload?.credit?.creditBalance
            state.totalCredits = action?.payload?.credit?.creditAmount

            // Save in local storage
            localStorage.setItem('token', action?.payload?.token);
            localStorage.setItem('userInfo', JSON.stringify(action?.payload));
            localStorage.setItem('credit_balance', action?.payload?.credit?.creditBalance);
            localStorage.setItem('credit_total', action?.payload?.credit?.creditAmount);
        },
        logout: (state) => {
            // Clear all data in local storage & redux state
            state.userData = null;
            state.userCredit = 0;
            localStorage.clear();
        },
        setCredit: (state, action) => {
            state.userCredit = action?.payload;
            localStorage.setItem('credit_balance', action?.payload);
        },
        setCreditTotal: (state, action) => {
            state.totalCredits = action?.payload;
            localStorage.setItem('credit_total', action?.payload);
        }
    }
})

export const { login, logout, setCredit, setCreditTotal } = userSlice.actions
export default userSlice.reducer