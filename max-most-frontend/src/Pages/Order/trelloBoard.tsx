import { useState, useEffect, useRef } from "react";
import { TableColumn, columnsData } from "./constants/columns";
// import { cardsData } from "./constants/cards";
import { labelsData } from "./constants/labels";
import { commentsData } from "./constants/comments";
import { v4 as uuidv4 } from "uuid";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDetail } from "./context/DetailContext";
import Column from "./Components/Column/Column";
import { OrderData } from "../../Interfaces/Orders";
import OrderDrawer from "./Components/OrderDrawer";
import { useOrders } from "../../Hooks/useOrders";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../Hooks/useDebounce";
import { CircularProgress } from "@mui/material";
import { labelOrder } from "./constants/labels";

export const DashboardPage = () => {
  const [rows, setRows] = useState(() => {
    const storedRows = localStorage.getItem("cards");
    return storedRows ? JSON.parse(storedRows) : [];
  });
  const [columns, setColumns] = useState(() => {
    const storedColumns = localStorage.getItem("columns");
    return storedColumns ? JSON.parse(storedColumns) : columnsData;
  });

  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const { data: orders, isLoading } = useOrders(debouncedParams, false);

  useEffect(() => {
    if (!isLoading && orders) {
      setRows(orders.results);
    }
  }, [orders, isLoading]);

  const refValueColumn = useRef(null);

  const { isShowDetailItem, setIsShowDetailItem, detailCard, onClickDetail } =
    useDetail();

  useEffect(() => {
    if (detailCard) {
      setAction({ type: "view", row: detailCard ?? null });
    }
  }, [detailCard]);

  useEffect(() => {
    if (!localStorage.getItem("columns")) {
      localStorage.setItem("columns", JSON.stringify(columnsData));
    }

    if (!localStorage.getItem("cards")) {
      localStorage.setItem("cards", JSON.stringify(rows));
    }

    if (!localStorage.getItem("comments")) {
      localStorage.setItem("comments", JSON.stringify(commentsData));
    }

    if (!localStorage.getItem("labels")) {
      localStorage.setItem("labels", JSON.stringify(labelsData));
    }
  }, [rows]);

  useEffect(() => {
    if (refValueColumn.current) {
      (refValueColumn.current as HTMLElement).focus();
    }
  }, [refValueColumn]);

  // Function to sort columns based on the label order
  const sortedColumns = columns.sort(
    (a: { filter: { value: string } }, b: { filter: { value: string } }) => {
      // Normalize values by converting them to lowercase
      const labelA = a.filter.value.trim().toLowerCase();
      const labelB = b.filter.value.trim().toLowerCase();

      const indexA = labelOrder.findIndex(label => label.toLowerCase() === labelA);
      const indexB = labelOrder.findIndex(label => label.toLowerCase() === labelB);

      // Handle cases where the label is not found (put those at the end)
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    }
  );

  const onClickCopy = (clickedTaskId: string) => {
    const clickedColumn = columns.find(
      (oneTask: { id: string }) => oneTask.id === clickedTaskId
    );

    if (clickedColumn) {
      const copiedColumn = {
        ...clickedColumn,
        id: uuidv4(),
        name: `Kopie ${clickedColumn.name}`
      };

      const existingColumn = columns.find(
        (column: { name: string }) => column.name === copiedColumn.name
      );

      if (existingColumn) {
        toast.error(
          <div
            dangerouslySetInnerHTML={{
              __html: `Cannot duplicate a column with an already existing name <strong>Copy ${clickedColumn.name}</strong>!`
            }}
          />,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide
          }
        );
      }
    }
  };

  const onUpdateTitle = (columnId: number | string, newTitle: string) => {
    const currentColumnName = columns.find(
      (column: { id: string | number }) => column.id === columnId
    )?.name;

    const updatedColumns = columns.map((column: { id: string | number }) => {
      if (column.id === columnId) {
        return { ...column, name: newTitle };
      }
      return column;
    });

    const updatedRows = rows.map((row: { status: boolean }) => {
      if (row.status === currentColumnName) {
        return { ...row, status: newTitle };
      }
      return row;
    });

    setColumns(updatedColumns);
    localStorage.setItem("columns", JSON.stringify(updatedColumns));

    setRows(updatedRows);
    localStorage.setItem("cards", JSON.stringify(updatedRows));
  };

  const [action, setAction] = useState<{
    type: "edit" | "view" | "del" | "restore" | null;
    row: OrderData | null;
  }>({
    row: null,
    type: null
  });

  const handleClear = () => {
    setIsShowDetailItem(false);
    setAction({ type: null, row: null });
    onClickDetail(null);
  };

  return (
    <>
      <main
        style={{
          display: "flex",
          background: "#ffffff",
          borderRadius: "10px"
        }}
      >
        <div
          style={{
            width: "100vw",
            height: "100vh",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingTop: "20px",
            paddingBottom: "20px",
            overflowX: "auto",
            display: "flex",
            alignItems: "start",
            gap: "1.3%"
          }}
        >
          {!isLoading ? (
            sortedColumns.map((oneTask: TableColumn) => {
              return (
                <Column
                  title={oneTask.filter.value}
                  columns={columns}
                  oneTask={oneTask}
                  rows={rows}
                  isShowDetailItem={isShowDetailItem}
                  setRows={setRows}
                  key={oneTask.id}
                  id={oneTask.id}
                  onClickCopy={onClickCopy}
                  onUpdateTitle={newTitle => onUpdateTitle(oneTask.id, newTitle)}
                  isLoading={isLoading}
                />
              );
            })
          ) : (
            <div
              style={{
                width: "100vw",
                height: "60%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <CircularProgress color="primary" />
            </div>
          )}
        </div>
        {isShowDetailItem && (
          <OrderDrawer
            onClose={handleClear}
            open={action.type === "view"}
            row={action?.row}
            onDelete={() => setAction({ ...action, type: "del" })}
            isTrash={false}
          />
        )}
      </main>
    </>
  );
};
