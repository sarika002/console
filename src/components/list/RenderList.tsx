import { h } from "gridjs";
import { Grid, _ } from "gridjs-react";
import React, { useEffect, useState } from "react";
import "./render-list.scss";
import apiFactory from "../../utils/api";
import {
  checkCount,
  checkFormat,
  checkPaginationUrl,
  checkResponse,
  handleNavigation,
  setGridPage,
} from "../../utils/grid-helper";

interface IActionsRenderList {
  classNames: string;
  func: (val: any) => void;
  iconClassName?: string;
}
interface IProps {
  searchBy: string;
  headings: {
    name: string;
    data: string;
    width?: string;
    format?: (val: any) => void;
    navigate?: (val: any) => void;
  }[];
  url: string;
  actions?: IActionsRenderList;
  actionsList?: IActionsRenderList[];
}
interface IColumns {
  id?: number;
  name: string;
  data?: (row: any) => void;
  width?: string;
  formatter?: (cell: any, row: any) => void;
}

let id = 0;
let grid: any;

export let refreshGrid: () => void;

const RenderList1: React.FC<IProps> = (props: IProps) => {
  const [isGridReady, setGridReady] = useState(false);
  const [gridReload, setGridReload] = useState(false);
  const [_count, setCount] = useState(0);
  const { headings, url, searchBy } = props;
  const columns: IColumns[] = headings.map((heading) => {
    id += 1;
    return {
      id,
      ...heading,
      data: (row: any) => row[heading.data],
      name: heading.name,
      formatter: (cell: any, row: any) => handleNavigation(cell, row, heading),
    };
  });

  // This will be used by Grid for reloading the Grid list
  const _refreshGrid = () => {
    setGridReload(true);
  };
  refreshGrid = _refreshGrid;

  // This will be used when you want to add single button in the list
  if (props.actions !== undefined) {
    id += 1;
    columns.push({
      id,
      name: "Actions",
      formatter: (cell, row) => {
        return h(
          "Button",
          {
            className: props.actions?.classNames,
            onclick: () => props.actions?.func(row),
            "aria-label": "action",
            "data-testid": "action-btn",
          },
          h(
            "i",
            {
              className: "bi bi-gear-fill",
            },
            ""
          )
        );
      },
    });
  }

  // This will be used when you want to add multiple action buttons in the list
  if (props.actionsList !== undefined && props.actionsList.length > 0) {
    columns.push({
      id,
      name: "Actions",
      formatter: (cell, row) => {
        return _(
          <>
            {props.actionsList!.map((data, idx) => {
              return (
                <div key={idx} style={{ display: "flex", float: "left" }}>
                  <button
                    className={data.classNames}
                    onClick={() => data.func(row)}
                  >
                    <i className={data.iconClassName}></i>
                  </button>
                </div>
              );
            })}
          </>
        );
      },
    });
  }

  const serverConfigs = {
    url,
    data: async (args: any) => {
      const response = await apiFactory().get(`${args.url}`);
      let _data = checkResponse(response.data);
      const totalCount = checkCount(response.data);
      setCount(totalCount);
      _data = checkFormat(headings, _data);

      return { data: _data, total: totalCount }; // this total is required for pagination
    },
  };

  const paginationConfigs = {
    enabled: true,
    limit: 2,
    page: 0, // used to set default selected page
    server: {
      url: (prev: string, page: number) =>
        checkPaginationUrl(prev, page, paginationConfigs.limit),
    },
  };

  const searchConfigs = {
    enabled: true,
    server: {
      url: (prev: string, keyword: string) => `${prev}${searchBy}=${keyword}&`,
    },
  };

  const classNames = {
    table: "table",
    pagination: "d-flex justify-content-around",
    search: "search-field",
  };

  // initial Grid render
  useEffect(() => {
    grid = (
      <Grid
        columns={columns}
        server={serverConfigs}
        pagination={paginationConfigs}
        search={searchConfigs}
        className={classNames}
      />
    );
    // this will be used to set state value as true for indicating our Grid is ready
    setGridReady(true);
  }, []);

  //  Grid render on invoke of refreshGrid()
  useEffect(() => {
    if (gridReload) {
      // This will be used for handling current selected page after we refresh grid
      setGridPage(paginationConfigs, _count);
      grid = (
        <Grid
          columns={columns}
          server={serverConfigs}
          pagination={paginationConfigs}
          search={searchConfigs}
          className={classNames}
        />
      );
      // this will be used to set state value as false for indicating our Grid is refreshed
      setGridReload(false);
      // this will be used to set state value as true for indicating our Grid is ready
      setGridReady(true);
    }
  }, [gridReload]);
  return isGridReady ? <div>{grid}</div> : <></>;
};
export default RenderList1;
