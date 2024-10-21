import { createSlice } from "@reduxjs/toolkit";
const initialState= localStorage.getItem("token") || "";
const tokenSlice=createSlice({
name:"tokenReducer",
    initialState,
    reducers:{
        
       setToken: (state,action)=>{
            localStorage.setItem("token",action.payload)
            return action.payload;
    },
    clearToken:()=>{
        localStorage.removeItem("token");
        return ""
    }
}
})

export const {setToken,clearToken}=tokenSlice.actions;
export default tokenSlice.reducer;