import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: 'modal',
    initialState: { showModal: false, modalType: null, },
    reducers: {
        toggle(state, action) {
            state.showModal = !state.showModal;
            state.modalType = action.payload;
        },
    }
})

export const modalActions = modalSlice.actions;
export default modalSlice;