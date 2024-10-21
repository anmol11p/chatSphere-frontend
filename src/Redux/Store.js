import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./tokenSlice"

const store=configureStore({
    reducer:{
        tokenReducer
    },
    devTools:true,
})

export default store;