import React from "react";
import { Link } from "react-router-dom";
import { Accordion, AccordionSummary, ListItem, ListItemText, Card } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
interface MetaFieldDefinitionsProps {
  definitions: {
    label: string;
    path: string;
    count: number;
    icon: React.ReactNode;
    to: string;
  }[];
  setSelectedMetaFieldFor: React.Dispatch<
    React.SetStateAction<{
      label: string;
      status: boolean;
      to: string;
      path: string;
    } | null>
  >;
}

const MetaFieldDefinitions: React.FC<MetaFieldDefinitionsProps> = ({
  definitions,
  setSelectedMetaFieldFor
}) => {
  return (
    <Card sx={{ width: "100%" }}>
      {definitions.map((def, index) => (
        <Link
          to={def.to}
          style={{
            textDecoration: "none",
            color: "inherit",
            width: "90%",
            borderRadius: "9px"
          }}
        >
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<DoubleArrowIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <ListItem
                button
                onClick={e => {
                  e.stopPropagation();
                  setSelectedMetaFieldFor({
                    label: def.label,
                    status: true,
                    path: def.path,
                    to: def.to
                  });
                }}
              >
                {def.icon}
                <ListItemText primary={def.label} sx={{ marginLeft: "8px" }} />
              </ListItem>
            </AccordionSummary>
          </Accordion>
        </Link>
      ))}
    </Card>
  );
};

export default MetaFieldDefinitions;
