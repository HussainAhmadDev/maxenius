export const countries = [
  { id: 1, label: "United Kingdom", value: "UK" },
  { id: 2, label: "England", value: "ENG" },
  { id: 3, label: "Scotland", value: "SCO" },
  { id: 4, label: "Wales", value: "WAL" },
  { id: 5, label: "Northern Ireland", value: "NI" }
  // Add more UK-related countries if needed
];
interface State {
  id: number;
  label: string;
  value: string;
}
export const countryStateMap: { [key: string]: State[] } = {
  UK: [
    { id: 1, label: "England", value: "England" },
    { id: 2, label: "Scotland", value: "Scotland" },
    { id: 3, label: "Wales", value: "Wales" },
    { id: 4, label: "Northern Ireland", value: "Northern Ireland" }
  ],
  ENG: [
    { id: 5, label: "London", value: "London" },
    { id: 5, label: "South East", value: "South East" },
    { id: 5, label: "South West", value: "South West" },
    { id: 5, label: "East Of England", value: "East Of England" },
    { id: 5, label: "West Midlands", value: "West Midlands" },
    { id: 5, label: "East Midlands", value: "East Midlands" },
    { id: 5, label: "North West", value: "North West" },
    { id: 5, label: "North East", value: "North East" },
    { id: 5, label: "Yorkshire and Humber", value: "Yorkshire and Humber" }
  ],
  SCO: [
    { id: 5, label: "Highlands", value: "HighLands" },
    { id: 5, label: "Lowlands", value: "Lowlands" }
  ],
  WAL: [
    { id: 5, label: "North Wales", value: "North Wales" },
    { id: 5, label: "Mid Wales", value: "Mid Wales" },
    { id: 5, label: "South Wales", value: "South Wales" }
  ],
  NI: [
    { id: 5, label: "Bel Fast", value: "Bel Fast" },
    { id: 5, label: "Derry", value: "Derry" }
  ]
  // You can add more countries and their respective states here
};
