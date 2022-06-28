import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastAlert } from "../../../../components/toast-alert/toast-alert";
import { RootState } from "../../../../store";
import {
  getAllDeletedTables,
  setDeletedTableData,
} from "../../../../store/features/saas/manage-table/get-all-deleted-tables/slice";
import {
  getDeletedTableByTenant,
  setDeletedTableList,
} from "../../../../store/features/saas/manage-table/get-deleted-table/slice";
import {
  restoreTable,
  restoreTableReset,
} from "../../../../store/features/saas/manage-table/restore-table/slice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  IPagination,
  ITableSchema,
  IGetDeleteTableByTenant,
} from "../../../../types/saas";

function RestoreTable() {
  const authenticationState = useAppSelector(
    (state: RootState) => state.loginType
  );
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const allDeleteTableData = useAppSelector(
    (state) => state.getAllDeleteTableState
  );

  const restoredTableData = useAppSelector(
    (state) => state.restoreTableSchemaState
  );

  const TableData = useAppSelector((state) => state.getDelTableByTenantState);
  const [restoredTableRecord, setRestoredTableRecord] = useState({
    tenantId: "",
    tableName: "",
  });
  const tenantDetaile = useAppSelector((state) => state.userData);
  const [tenantId, setTenantId] = useState("");
  const [show, setShow] = useState(false);
  const [table, settable] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = (obj: ITableSchema) => {
    settable(obj.tableName);
    setTenantId(obj.tenantId);
    setShow(true);
  };
  const id = tenantDetaile.data?.tenantId?.toString();
  const dataLength = allDeleteTableData.data?.dataSize;
  const dataSize = TableData.data?.dataSize;
  useEffect(() => {
    const pageParameters: IPagination = {
      pageNumber: currentPage.toString(),
      pageSize: "6",
    };
    if (authenticationState.data === "admin") {
      dispatch(getAllDeletedTables(pageParameters));
    } else if (authenticationState.data === "tenant") {
      const parameters: IGetDeleteTableByTenant = {
        tenantId: id!,
        pageNumber: pageParameters.pageNumber,
        pageSize: pageParameters.pageSize,
      };
      dispatch(getDeletedTableByTenant(parameters));
    }
    return () => {
      dispatch(restoreTableReset());
    };
  }, []);

  useEffect(() => {
    if (!restoredTableData.loading && restoredTableData.error) {
      navigate("/error", { state: restoredTableData.error });
    }
    if (
      !restoredTableData.loading &&
      !restoredTableData.error &&
      restoredTableData?.data
    ) {
      if (authenticationState.data === "admin") {
        const newTableList = allDeleteTableData.data?.tableList.filter(
          (obj) => {
            return (
              obj.tenantId !== restoredTableRecord.tenantId ||
              obj.tableName !== restoredTableRecord.tableName
            );
          }
        );
        dispatch(
          setDeletedTableData({ dataSize: dataLength, tableList: newTableList })
        );
        ToastAlert("Table restored successfully ", "success");
      } else if (authenticationState.data === "tenant") {
        const newTableList = TableData.data?.tableList.filter((obj) => {
          return (
            obj.tableName !== restoredTableRecord.tableName ||
            obj.tenantId !== restoredTableRecord.tenantId
          );
        });
        console.log(newTableList);
        dispatch(setDeletedTableList({ dataSize, tableList: newTableList }));

        ToastAlert("Table Deleted successfully ", "success");
      }
    }
  }, [restoredTableData.loading]);

  const restoreDeletedTable = (obj: ITableSchema) => {
    dispatch(restoreTable(obj));
    setRestoredTableRecord({ ...obj });
    handleClose();
  };

  const prevpage = (currentPage1: number) => {
    if (currentPage1 <= 1) {
      setCurrentPage(1);
    } else {
      --currentPage1;
      setCurrentPage(currentPage1);
    }

    const pageParameters: IPagination = {
      pageNumber: (currentPage - 1).toString(),
      pageSize: "6",
    };
    if (authenticationState.data === "admin") {
      dispatch(getAllDeletedTables(pageParameters));
    } else if (authenticationState.data === "tenant") {
      const parameters: IGetDeleteTableByTenant = {
        tenantId: id!,
        pageNumber: pageParameters.pageNumber,
        pageSize: pageParameters.pageSize,
      };
      dispatch(getDeletedTableByTenant(parameters));
    }
  };
  const nextpage = (currentPage1: number) => {
    currentPage1++;
    setCurrentPage(currentPage1);

    const pageParameters: IPagination = {
      pageNumber: (currentPage + 1).toString(),
      pageSize: "6",
    };

    if (authenticationState.data === "admin") {
      dispatch(getAllDeletedTables(pageParameters));
    } else if (authenticationState.data === "tenant") {
      const parameters: IGetDeleteTableByTenant = {
        tenantId: id!,
        pageNumber: pageParameters.pageNumber,
        pageSize: pageParameters.pageSize,
      };
      dispatch(getDeletedTableByTenant(parameters));
    }
  };

  return (
    <div className="createbody card">
      <div className="card-body table-responsive">
        {authenticationState.data === "admin" ? (
          <>
            <h4 className=" text-center pt-3 mt-3 ">Restore Table Details</h4>

            {allDeleteTableData.data?.tableList !== undefined &&
            allDeleteTableData.data.tableList.length > 0 ? (
              <>
                <Table bordered className="text-center">
                  <thead>
                    <tr id="test">
                      <th>SR.NO.</th>
                      <th>User</th>
                      <th>Table Name</th>
                      <th>Restore</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allDeleteTableData.data.tableList.map((val, index) => (
                      <tr key={index + 6 * (currentPage - 1) + 1}>
                        {currentPage !== 1 ? (
                          <td>{index + 6 * (currentPage - 1) + 1}</td>
                        ) : (
                          <td>{index + currentPage}</td>
                        )}
                        <td>{val.tenantId}</td>
                        <td>{val.tableName}</td>
                        <td
                          className="text-align-middle text-primary"
                          onClick={() => handleShow(val)}
                          data-testid="restore-table-btn"
                        >
                          <i className="bi bi-bootstrap-reboot"></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <nav
                  aria-label="Page navigation example "
                  className="d-flex justify-content-center"
                >
                  <ul className="pagination ">
                    <li
                      className={
                        currentPage !== 1 ? "page-item" : "page-item disabled"
                      }
                    >
                      <a
                        className="page-link "
                        onClick={() => prevpage(currentPage)}
                      >
                        Previous
                      </a>
                    </li>

                    <li className="page-item active">
                      <a className="page-link">{currentPage}</a>
                    </li>
                    <li
                      className={
                        allDeleteTableData.data.tableList !== undefined &&
                        allDeleteTableData.data.dataSize - currentPage * 6 <= 0
                          ? "page-item disabled"
                          : "page-item  "
                      }
                    >
                      <a
                        className="page-link "
                        onClick={() => nextpage(currentPage)}
                      >
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              </>
            ) : (
              <>
                <h2>No Data</h2>
              </>
            )}
          </>
        ) : (
          <>
            {TableData.data?.tableList !== undefined &&
            TableData.data.tableList.length > 0 &&
            id !== undefined ? (
              <>
                <Table bordered className="text-center">
                  <thead>
                    <tr id="test">
                      <th>SR.NO.</th>
                      <th>Table Name</th>
                      <th>Restore</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TableData.data.tableList.map((val, index) => (
                      <tr key={index + 6 * (currentPage - 1) + 1}>
                        {currentPage !== 1 ? (
                          <td>{index + 6 * (currentPage - 1) + 1}</td>
                        ) : (
                          <td>{index + currentPage}</td>
                        )}
                        <td>{val.tableName}</td>
                        <td
                          className="text-align-middle text-primary"
                          onClick={() => handleShow(val)}
                          data-testid="restore-table-btn"
                        >
                          <i className="bi bi-bootstrap-reboot"></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <nav
                  aria-label="Page navigation example "
                  className="d-flex justify-content-center"
                >
                  <ul className="pagination ">
                    <li
                      className={
                        currentPage !== 1 ? "page-item" : "page-item disabled"
                      }
                    >
                      <a
                        className="page-link "
                        onClick={() => prevpage(currentPage)}
                      >
                        Previous
                      </a>
                    </li>

                    <li className="page-item active">
                      <a className="page-link">{currentPage}</a>
                    </li>
                    <li
                      className={
                        TableData.data.tableList !== undefined &&
                        TableData.data.dataSize - currentPage * 6 <= 0
                          ? "page-item disabled"
                          : "page-item  "
                      }
                    >
                      <a
                        className="page-link "
                        onClick={() => nextpage(currentPage)}
                      >
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              </>
            ) : (
              <>
                <h2>No Data</h2>
              </>
            )}
          </>
        )}
      </div>

      <Modal
        show={show}
        data={{ table, tenantId }}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Restore Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to restore <b>{table}</b> table?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            No, Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => restoreDeletedTable({ tenantId, tableName: table })}
          >
            Yes, Restore
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default RestoreTable;
