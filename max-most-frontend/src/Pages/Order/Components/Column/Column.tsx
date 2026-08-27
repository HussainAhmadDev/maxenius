import React, { useState, useEffect, useRef, useMemo } from "react";
import "react-toastify/dist/ReactToastify.css";
import { CardsList } from "../CardsList/CardsList";
import { useDrop } from "react-dnd";
import { TableColumn, columnsData } from "../../constants/columns";
import { Typography } from "@mui/material";
import { OrderData } from "../../../../Interfaces/Orders";
import { useEditOrder } from "../../../../Hooks/useOrders";
import completedImage from "../../../../../public/assets/icons/complete.svg";

interface ColumnProps {
  title: string;
  columns: { name: string }[]; // Replace with actual type for columns
  oneTask: TableColumn;
  id: string;
  rows: OrderData[]; // Replace with actual type for rows
  setRows: React.Dispatch<React.SetStateAction<OrderData[]>>; // Replace with actual type for setRows
  onClickCopy: (id: string) => void;
  onClickDetail?: (id: string) => void; // Replace with actual type for onClickDetail
  isShowDetailItem: boolean;
  onUpdateTitle: (newTitle: string) => void;
  onUpdateDone?: (id: string) => void;
  isLoading: boolean;
}

const Column: React.FC<ColumnProps> = ({
  title,
  oneTask,
  rows,
  setRows,
  onUpdateDone
}) => {
  const [movedDetail, setMovedDetail] = useState<{
    id: string;
    movedFrom: string;
    movedTo: string;
  } | null>({
    id: "",
    movedFrom: "",
    movedTo: ""
  });

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "li",
    drop: (item: { id: string }) => {
      const result = addItemToCard(item.id);

      if (result.success && title && item.id && result.oldStatus) {
        setMovedDetail({
          id: item.id,
          movedFrom: result.oldStatus,
          movedTo: title
        });
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  }));

  const [isClickButtonAddCard] = useState(false);
  const [titleValue] = useState(title);
  const [isClickEditHeading, setIsClickEditHeading] = useState(false);
  const refValue = useRef<HTMLInputElement>(null);

  const filteredRows = useMemo(() => {
    const filtered = rows?.filter(order => order.status === title);
    return filtered;
  }, [title, rows]);

  const { mutate } = useEditOrder(movedDetail?.id ?? "");

  useEffect(() => {
    if (
      movedDetail?.id &&
      movedDetail.movedFrom &&
      movedDetail.movedTo &&
      movedDetail.movedFrom !== movedDetail.movedTo
    ) {
      mutate({ status: movedDetail.movedTo });
      setMovedDetail(null);
    }
  }, [movedDetail, mutate]);

  useEffect(() => {
    if (isClickEditHeading && refValue.current) {
      refValue.current.select();
    }
  }, [isClickEditHeading]);

  useEffect(() => {
    if (isClickButtonAddCard && refValue.current) {
      refValue.current.focus();
    }
  }, [isClickButtonAddCard]);

  const onClickEditHeading = () => {
    setIsClickEditHeading(true);
  };

  const addItemToCard = (id: string) => {
    let oldStatus = "";
    setRows(prevRows => {
      const draggedCard = prevRows.find(card => card.id === id);

      if (draggedCard) {
        oldStatus = draggedCard.status;
        draggedCard.status = title;

        const updatedColumns = [draggedCard, ...prevRows.filter(card => card.id !== id)];

        localStorage.setItem("cards", JSON.stringify(updatedColumns));

        return updatedColumns;
      }
      return prevRows;
    });

    return { success: !!oldStatus, oldStatus };
  };

  const columnHead = useMemo(() => {
    const column = columnsData.find(
      col => col.filter.value === titleValue && col.filter.label
    );
    return column ? column.filter.label : "Default Label";
  }, [titleValue]);

  return (
    <section
      ref={drop}
      className={`section ${isOver ? "section-over" : ""} sm:section-sm`}
    >
      <div
        className="section-content"
        style={
          title === "pending" || title === "refunded"
            ? { backgroundColor: "#262627" }
            : { ...oneTask?.styles }
        }
      >
        <Typography
          variant="h5"
          className="section-typography"
          onClick={onClickEditHeading}
          style={
            title === "pending" || title === "refunded"
              ? { color: "white" }
              : { color: oneTask?.styles?.color }
          }
        >
          {title === "completed" && (
            <img
              src={completedImage}
              alt="Completed"
              style={{ width: 20, height: 30, marginRight: 5, verticalAlign: "middle" }}
            />
          )}
          {columnHead}
        </Typography>
      </div>

      <div className="section-scroll">
        <CardsList cards={filteredRows} onUpdateDone={onUpdateDone!} />
      </div>
    </section>
  );
};

export default React.memo(Column);
