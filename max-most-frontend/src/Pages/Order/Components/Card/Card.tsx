import React, { useState } from "react";
import dayjs from "dayjs";
import { useDetail } from "../../context/DetailContext";
import { useDrag } from "react-dnd";
import { Card as MuiCard, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { OrderData } from "../../../../Interfaces/Orders";

interface OrderCardProps {
  id: string;
  oneCard: OrderData;
  onUpdateDone?: (id: string, done: boolean) => void;
}

const StyledCard = styled(MuiCard)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
  flexDirection: "column"
});

export const Card: React.FC<OrderCardProps> = ({ id, oneCard }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "li",
    item: { id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const [, setIsShowEditButton] = useState(false);

  const { isShowDetailItem, onClickDetail } = useDetail();

  const onMouseEnter = () => {
    setIsShowEditButton(true);
  };

  const onMouseLeave = () => {
    setIsShowEditButton(false);
  };

  const handleClickDetail = () => {
    onClickDetail(oneCard);
  };

  const status = oneCard?.shipping_status;
  switch (status) {
    case "not_shipped":
      break;
    case "partially_shipped":
      break;
    default:
  }

  return (
    <li
      ref={drag}
      style={{
        position: "relative",
        zIndex: isShowDetailItem ? "auto" : 20, // Adjust z-index as needed
        marginLeft: 16, // Adjust margin values as needed
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        backgroundColor: "#fff",
        color: "#1d284c",
        lineHeight: "1.2",
        cursor: "pointer",
        borderRadius: 8, // Adjust border radius as needed
        // boxShadow: "0 1px 0 rgba(9, 30, 66, 0.3)",
        opacity: isDragging ? 0.25 : 1
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClickDetail}
    >
      <StyledCard>
        <CardContent
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "4px"
          }}
        >
          <Typography
            variant="h6"
            color="secondary"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "8em",
              fontSize: "16px"
            }}
          >
            <strong>{oneCard?.company_name}</strong>
          </Typography>
          <Typography
            variant="h6"
            color="secondary"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "8em",
              fontSize: "15px",
              color: "#5856d6"
            }}
          >
            <strong>{oneCard?.total_amount}</strong>
          </Typography>
        </CardContent>

        <CardContent
          style={{
            width: "100%",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Typography>{oneCard?.website_url}</Typography>
        </CardContent>
        <CardContent
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "4px"
          }}
        >
          <Typography
            variant="body2"
            color="black"
            fontWeight={600}
            sx={{ paddingLeft: "20px" }}
          >
            #{oneCard.number}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {dayjs(oneCard.created).format("DD-MM-YYYY")}
          </Typography>
        </CardContent>
      </StyledCard>
    </li>
  );
};
