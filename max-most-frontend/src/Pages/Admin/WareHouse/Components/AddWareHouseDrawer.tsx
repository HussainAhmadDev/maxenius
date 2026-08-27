import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Radio from "@mui/material/Radio";
import { DeleteForever, ModeEdit } from "@mui/icons-material";
export default function WareHouseDrawer() {
  const [state, setState] = React.useState({
    right: false,
    opacity: -1
  });

  const toggleDrawer =
    (anchor: string, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

  return (
    <>
      <Box>
        <img src="assets/edit-icon.svg" onClick={toggleDrawer("right", true)} />
        {/* <Button >Right</Button> */}
        <SwipeableDrawer
          anchor="right"
          open={state.right}
          onClose={toggleDrawer("right", false)}
          onOpen={toggleDrawer("right", true)}
          sx={{
            "& .MuiDrawer-paper": {
              paddingTop: "20px",
              paddingBottom: "160px",
              width: "600px",
              marginTop: "8%"
            }
          }}
        >
          <Box sx={{ paddingLeft: "13px", paddingRight: "20px" }}>
            <Typography variant="h3" sx={{ fontSize: "16px", fontWeight: "bolder" }}>
              User:Hassan Ali
            </Typography>
            <Box sx={{ border: "01px solid lightgrey", marginTop: "10px" }}></Box>
            <Box sx={{ display: "flex", gap: "15px" }}>
              <Box>
                <Link to={"/admin/edit-warehouse "}>
                  <Button
                    startIcon={<ModeEdit />}
                    variant="outlined"
                    id="cy__EditWarehouseBtn"
                  >
                    Edit WareHouse
                  </Button>
                </Link>
              </Box>
              <Box>
                <Button color="error" startIcon={<DeleteForever />} variant="outlined">
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: "15px",
                fontWeight: "bold",
                marginTop: "19px",
                paddingLeft: "20px",
                paddingRight: "20px"
              }}
            >
              Basic Information :
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", paddingRight: "20px" }}>
              <Radio
                style={{ color: "green" }}
                name="radio-buttons"
                inputProps={{ "aria-label": "A" }}
              />
              <Typography variant="h4">Active</Typography>
            </Box>
          </Box>
          <Box sx={{ border: "1px solid lightgrey", marginTop: "10px" }}></Box>
          <Box sx={{ paddingLeft: "20px", paddingTop: "20px" }}>
            <Box>
              <Typography variant="h6" sx={{ fontSize: "11px" }}>
                Full Name <br />
                <Typography
                  variant="h6"
                  sx={{ color: "black", fontSize: "11px", fontWeight: "bold" }}
                >
                  FaceBook
                </Typography>
              </Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flex: "1", marginTop: "20px" }}>
                <Typography variant="h6" sx={{ fontSize: "11px" }}>
                  Date Created <br />
                  <Typography
                    variant="h6"
                    sx={{ color: "black", fontSize: "11px", fontWeight: "bold" }}
                  >
                    23/4/24
                  </Typography>
                </Typography>
              </Box>
              <Box sx={{ flex: "1", marginTop: "20px" }}>
                <Typography variant="h6" sx={{ fontSize: "11px" }}>
                  Date Updated <br />
                  <Typography
                    variant="h6"
                    sx={{ color: "black", fontSize: "11px", fontWeight: "bold" }}
                  >
                    21/5/24
                  </Typography>
                </Typography>
              </Box>
              <Box sx={{ flex: "1" }}></Box>
            </Box>
            <Box sx={{ marginTop: "20px" }}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Address:
              </Typography>
            </Box>
            <Box sx={{ border: "1px solid lightgrey", marginTop: "10px" }}></Box>
            <Box>
              <Typography sx={{ paddingTop: "20px" }}>
                Facebook warehouse from naveed
              </Typography>
              <Typography
                sx={{ fontWeight: "bold", paddingTop: "7px", fontSize: "12px" }}
              >
                House# 170,E,Block
              </Typography>
              <Typography
                sx={{ fontWeight: "bold", paddingTop: "7px", fontSize: "12px" }}
              >
                House# 170,E,Block
              </Typography>
              <Typography
                sx={{ fontWeight: "bold", paddingTop: "7px", fontSize: "12px" }}
              >
                Pakistan,Punjab,Faisalabad,38000
              </Typography>
            </Box>
          </Box>
        </SwipeableDrawer>
      </Box>
    </>
  );
}
