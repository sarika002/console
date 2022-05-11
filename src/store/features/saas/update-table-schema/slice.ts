import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateTableSchemaService } from "../../../../services/saas/api/api";
import { IUpdateTable } from "../../../../types/saas";
import error from "../../../../utils/error";

interface IUpdateTableSchemaState {
  data?: string;
  loading: boolean;
  error?: string | null;
}
const initialState: IUpdateTableSchemaState = {
  data: undefined,
  loading: false,
  error: undefined,
};

export const updateTableSchema = createAsyncThunk(
  "updateSchemaTable",
  async (data: IUpdateTable) => {
    // async (data: ITableCreateData) => {
    try {
      const response = await updateTableSchemaService(
        data.requestParams.tableName,
        data.requestParams.tenantId,
        data.requestData
      );
      console.log(
        `[createAsyncThunk] Response Data : ` + JSON.stringify(response.data)
      );
      return response.data;
    } catch (error_: any) {
      // console.log(error_, "||", error(error_));
      const errorMessage = error(error_);
      // console.log(`Error : ` + JSON.stringify(error_));
      throw new Error(errorMessage);
    }
  }
);

const slice = createSlice({
  name: "updateSchemaTableSlice",
  initialState,
  reducers: {},
  extraReducers(builder): void {
    builder.addCase(updateTableSchema.pending, (state) => {
      state.data = undefined;
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(updateTableSchema.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(updateTableSchema.rejected, (state, action: any) => {
      state.loading = false;
      const errorMessage = action.error.message.split(" ");
      state.error = errorMessage[errorMessage.length - 1];
      if (state.error === "403" || state.error === "401") {
        alert("Invalid Token");
      }
    });
  },
});

export default slice.reducer;
