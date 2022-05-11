export interface ITableColumnData {
  name: string;
  type: string;
  required: boolean;
  sortable: boolean;
  filterable: boolean;
  multiValue: boolean;
  storable: boolean;
  partialSearch: boolean;
}

export interface ITableCreateData {
  tableName: string;
  sku: string;
  columns: ITableColumnData[];
}
export interface ICreateTable {
  tenantId: string;
  requestData: ITableCreateData;
}
export interface ITableSchema {
  tenantId: string;
  tableName: string;
}
export interface IUpdateTableSchemaData {
  tableName: string;
  columns: ITableColumnData[];
}
export interface IUpdateTable {
  requestParams: ITableSchema;
  requestData: IUpdateTableSchemaData;
}
export interface IInputData {
  inputData: string;
  requestParams: ITableSchema;
}
