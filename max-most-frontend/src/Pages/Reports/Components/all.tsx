import { ControlPoint, RemoveCircleOutline } from "@mui/icons-material";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  CardContent,
  Stack
} from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";

const data = [
  "Sale Report",
  "New",
  "Cypress",
  "James Test",
  "Testing Report",
  "New Report",
  "Test Max",
  "Test"
];

function All() {
  const [expand, setExpand] = useState("");
  return (
    <CardContent>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button size="medium" variant="contained">
          Create Custom Report
        </Button>
      </Box>
      <Box mt={2}>
        {data.map((acc, key) => (
          <Accordion
            key={key}
            expanded={expand === acc}
            onClick={() => setExpand(expand === acc ? "" : acc)}
            sx={{
              boxShadow: "none",
              borderColor: "#CFD8E3 !important"
            }}
          >
            <AccordionSummary
              expandIcon={
                expand === acc ? (
                  <RemoveCircleOutline sx={{ color: "primary.main" }} />
                ) : (
                  <ControlPoint sx={{ color: "primary.main" }} />
                )
              }
            >
              {acc}
            </AccordionSummary>
            <AccordionDetails onClick={e => e.stopPropagation()}>
              <Stack direction={"row"} gap={2}>
                {["Export PDF", "Export CSV", "Delete Report"].map((btn, ind) => (
                  <Button key={ind} color="info" variant="contained">
                    {btn}
                  </Button>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </CardContent>
  );
}

export default All;
