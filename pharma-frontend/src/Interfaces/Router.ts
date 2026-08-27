import type { Location } from "react-router-dom";

export interface ILocation extends Location {
  state: {
    from: Location;
  };
}
