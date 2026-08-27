import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Skeleton,
  Stack,
  SxProps,
  Theme,
  Typography,
  useTheme
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useMemo, useState } from "react";
import { OrderData } from "../../../Interfaces/Orders";
import { ukDateFormat } from "../../../Utils/datesFormat";
import AddNote from "./AddNote";
import SeeDocumentation from "../../../Components/SeeDocumentation";
type Mode = "public" | "private";
const modes: Mode[] = ["public", "private"];

interface NotesProps {
  order?: OrderData;
  loading: boolean;
}
const Notes: React.FC<NotesProps> = ({ order, loading }) => {
  const [activeMode, setActiveMode] = useState<Mode>("public");
  const [open, setOpen] = useState(false);
  const { palette } = useTheme();
  const notes = useMemo(() => {
    return {
      public: order?.notes?.filter(note => note.type === "p") || [],
      private: order?.notes?.filter(note => note.type === "v") || []
    };
  }, [order]);
  const handleChangeMode = (mode: Mode) => () => {
    setActiveMode(mode);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAddNote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    handleOpen();
  };
  return (
    <>
      <Card>
        <Stack p={2} direction={"row"} gap={2} justifyContent={"start"} flexWrap={"wrap"}>
          {loading
            ? [...Array(2)].map((_, key) => (
                <Skeleton
                  width={280}
                  height={50}
                  variant="rounded"
                  animation="wave"
                  key={key}
                />
              ))
            : modes.map((item, key) => (
                <Stack
                  sx={customTabSxProps}
                  borderRadius={"6px"}
                  padding={"6px"}
                  direction={"row"}
                  gap={2}
                  alignItems={"center"}
                  key={key}
                  onClick={handleChangeMode(item)}
                >
                  <Typography
                    color={activeMode === item ? "primary.main" : "common.black"}
                    variant="body2"
                    textTransform={"capitalize"}
                    fontSize={14}
                    noWrap
                  >
                    Order {item} Notes{" "}
                    {Boolean(notes?.[item].length) && `(${notes?.[item].length})`}
                  </Typography>
                  {activeMode === item && (
                    <Button variant="contained" size="small" onClick={handleAddNote}>
                      Add Note
                    </Button>
                  )}
                </Stack>
              ))}
          <SeeDocumentation
            fileName={"useCreateOrderNote"}
            title={"See Order Notes Documentation"}
          />
        </Stack>

        <Divider />

        <CardContent>
          <Stack
            sx={{ height: 200 }}
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {loading ? (
              <CircularProgress size={50} />
            ) : [...(notes?.[activeMode] || [])].length ? (
              <Stack gap={1} flex={"100%"} sx={{ height: 200, overflowY: "auto" }}>
                {[...(notes?.[activeMode] || [])].map((note, key, arr) => {
                  let color;
                  switch (true) {
                    case note?.source?.toLowerCase() === "u":
                      color = palette.grey.A200;
                      break;
                    case note?.source?.toLowerCase() === "s" &&
                      note?.text.toLowerCase().includes("shipping payment"):
                      color = palette.grey.A400;
                      break;
                    default:
                      color = palette.info.main;
                      break;
                  }
                  return (
                    <React.Fragment key={key}>
                      <Stack width={"100%"} p={1} bgcolor={color} borderRadius={"5px"}>
                        <Typography fontSize={14}>{note.text}</Typography>
                        <Stack
                          direction={"row"}
                          alignContent={"center"}
                          gap={1}
                          justifyContent={"start"}
                          mt={1}
                        >
                          <Typography fontSize={12} fontWeight={"bold"}>
                            {ukDateFormat(note.created, true)}
                          </Typography>
                          {note?.note_username && (
                            <Typography fontSize={13} fontWeight={"bold"}>
                              Created by {note.note_username}
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                      {arr.length - 1 !== key && <Divider />}
                    </React.Fragment>
                  );
                })}
              </Stack>
            ) : (
              <Typography textTransform={"capitalize"} fontWeight={"bold"}>
                No {activeMode} Notes Available
              </Typography>
            )}
          </Stack>
        </CardContent>
        <AddNote mode={activeMode} onClose={handleClose} open={open} data={order} />
      </Card>
    </>
  );
};
const customTabSxProps: SxProps<Theme> = {
  outline: ({
    palette: {
      primary: { main }
    }
  }) => `1px solid ${main}`,
  cursor: "pointer",
  userSelect: "none"
};
export default Notes;
