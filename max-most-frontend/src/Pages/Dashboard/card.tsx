import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { styled } from "@mui/system";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";

const CustomCardContent = styled(CardContent)({
  padding: "0px 16px 16px 70px"
});

const CustomCardHeader = styled(CardHeader)({
  display: "flex",
  padding: "16px 14px 0px 14px",
  alignItems: "center"
});

interface DashboardCardProps {
  item: {
    cardImage: string;
    card_heading: string;
    card_arrow: string;
    card_link?: string;
  };
  openModal?(): void;
}

const DashboardCard: React.FC<DashboardCardProps> = props => {
  const {
    item: { cardImage, card_heading, card_arrow, card_link },
    openModal = () => {}
  } = props;

  return (
    <Card>
      <CustomCardHeader
        avatar={<img src={cardImage} alt="avatar" />}
        title={
          <Typography variant="h4" fontWeight={"bold"}>
            {card_heading}
          </Typography>
        }
      />

      <CustomCardContent>
        {card_arrow === "Select Website" ? (
          <Button
            startIcon={<ArrowBack sx={{ color: "primary.main", rotate: "180deg" }} />}
            onClick={openModal}
          >
            {card_arrow}
          </Button>
        ) : (
          <Link to={card_link || ""} className="no-underline" id={`cy__${card_heading}`}>
            <Button
              startIcon={<ArrowBack sx={{ color: "primary.main", rotate: "180deg" }} />}
            >
              {card_arrow}
            </Button>
          </Link>
        )}
      </CustomCardContent>
    </Card>
  );
};

export default DashboardCard;
