import { Typography } from "@mui/material";
import { useMemo } from "react";
import { TableColumn, columnsData } from "../../constants/columns";

const ColumnHead = ({ title, oneTask }: { title: string; oneTask: TableColumn }) => {
  // const [titleValue, setTitleValue] = useState(title);

  const columnHead = useMemo(() => {
    const column = columnsData.find(
      col => col.filter.value === title && col.filter.label
    );
    console.log("column", column);

    return column ? column.filter.label : "Default Label";
  }, [title]);
  return (
    <div key={title} className="section-content" style={{ ...oneTask?.styles }}>
      <Typography
        variant="h5"
        className="section-typography"
        // onClick={onClickEditHeading}
      >
        {columnHead}
      </Typography>
    </div>
  );
};
export default ColumnHead;
