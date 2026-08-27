import { Theme, ThemeOptions } from "@mui/material";
import Button from "./Button";
import BaseLine from "./BaseLine";
import Card from "./Card";
import Divider from "./Divider";

export default function ComponentsOverrides(theme: Theme) {
  return Object.assign(
    Button(theme),
    BaseLine(),
    Card(),
    Divider()
  ) as ThemeOptions["components"];
}
