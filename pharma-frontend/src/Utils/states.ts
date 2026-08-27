import { Results } from "Components/Customer/PatientFilters";
import { GroupedOption } from "Components/Form/Select";
import { CompanyData } from "Interfaces/Company";
import { UserData } from "Interfaces/User";

// const states: GroupedOption[] = [
//   {
//     label: "US",
//     options: [
//       { label: "Alabama", value: "AL" },
//       { label: "Alaska", value: "AK" },
//       { label: "American Samoa", value: "AS" },
//       { label: "Arizona", value: "AZ" },
//       { label: "Arkansas", value: "AR" },
//       { label: "California", value: "CA" },
//       { label: "Colorado", value: "CO" },
//       { label: "Connecticut", value: "CT" },
//       { label: "Delaware", value: "DE" },
//       { label: "District Of Columbia", value: "DC" },
//       { label: "Federated values Of Micronesia", value: "FM" },
//       { label: "Florida", value: "FL" },
//       { label: "Georgia", value: "GA" },
//       { label: "Guam", value: "GU" },
//       { label: "Hawaii", value: "HI" },
//       { label: "Idaho", value: "ID" },
//       { label: "Illinois", value: "IL" },
//       { label: "Indiana", value: "IN" },
//       { label: "Iowa", value: "IA" },
//       { label: "Kansas", value: "KS" },
//       { label: "Kentucky", value: "KY" },
//       { label: "Louisiana", value: "LA" },
//       { label: "Maine", value: "ME" },
//       { label: "Marshall Islands", value: "MH" },
//       { label: "Maryland", value: "MD" },
//       { label: "Massachusetts", value: "MA" },
//       { label: "Michigan", value: "MI" },
//       { label: "Minnesota", value: "MN" },
//       { label: "Mississippi", value: "MS" },
//       { label: "Missouri", value: "MO" },
//       { label: "Montana", value: "MT" },
//       { label: "Nebraska", value: "NE" },
//       { label: "Nevada", value: "NV" },
//       { label: "New Hampshire", value: "NH" },
//       { label: "New Jersey", value: "NJ" },
//       { label: "New Mexico", value: "NM" },
//       { label: "New York", value: "NY" },
//       { label: "North Carolina", value: "NC" },
//       { label: "North Dakota", value: "ND" },
//       { label: "Northern Mariana Islands", value: "MP" },
//       { label: "Ohio", value: "OH" },
//       { label: "Oklahoma", value: "OK" },
//       { label: "Oregon", value: "OR" },
//       { label: "Palau", value: "PW" },
//       { label: "Pennsylvania", value: "PA" },
//       { label: "Puerto Rico", value: "PR" },
//       { label: "Rhode Island", value: "RI" },
//       { label: "South Carolina", value: "SC" },
//       { label: "South Dakota", value: "SD" },
//       { label: "Tennessee", value: "TN" },
//       { label: "Texas", value: "TX" },
//       { label: "Utah", value: "UT" },
//       { label: "Vermont", value: "VT" },
//       { label: "Virgin Islands", value: "VI" },
//       { label: "Virginia", value: "VA" },
//       { label: "Washington", value: "WA" },
//       { label: "West Virginia", value: "WV" },
//       { label: "Wisconsin", value: "WI" },
//       { label: "Wyoming", value: "WY" }
//     ]
//   },
//   {
//     label: "CA",
//     options: [
//       { label: "Alberta", value: "AB" },
//       { label: "British Columbia", value: "BC" },
//       { label: "Manitoba", value: "MB" },
//       { label: "New Brunswick", value: "NB" },
//       { label: "Newfoundland and Labrador", value: "NL" },
//       { label: "Northwest Territories", value: "NT" },
//       { label: "Nova Scotia", value: "NS" },
//       { label: "Nunavut", value: "NU" },
//       { label: "Ontario", value: "ON" },
//       { label: "Prince Edward Island", value: "PE" },
//       { label: "Quebec", value: "QC" },
//       { label: "Saskatchewan", value: "SK" },
//       { label: "Yukon Territory", value: "YT" }
//     ]
//   },
//   {
//     label: "DK",
//     options: [
//       { label: "North Denmark Region", value: "81" },
//       { label: "Central Denmark Region", value: "82" },
//       { label: "Region of Southern Denmark", value: "83" },
//       { label: "Capital Region of Denmark", value: "84" },
//       { label: "Region Zealand", value: "85" }
//     ]
//   },
//   {
//     label: "FR",
//     options: [
//       { label: "Saint-Barthélemy", value: "BL" },
//       { label: "Nouvelle-Aquitaine", value: "NAQ" },
//       { label: "Île-de-France", value: "IDF" },
//       { label: "Mayotte", value: "976" },
//       { label: "Auvergne-Rhône-Alpes", value: "ARA" },
//       { label: "Occitanie", value: "OCC" },
//       { label: "Pays-de-la-Loire", value: "PDL" },
//       { label: "Normandie", value: "NOR" },
//       { label: "Corse", value: "20R" },
//       { label: "Bretagne", value: "BRE" },
//       { label: "Saint-Martin", value: "MF" },
//       { label: "Wallis and Futuna", value: "WF" },
//       { label: "Alsace", value: "6AE" },
//       { label: "Provence-Alpes-Côte-d’Azur", value: "PAC" },
//       { label: "Paris", value: "75C" },
//       { label: "Centre-Val de Loire", value: "CVL" },
//       { label: "Grand-Est", value: "GES" },
//       { label: "Saint Pierre and Miquelon", value: "PM" },
//       { label: "French Guiana", value: "973" },
//       { label: "La Réunion", value: "974" },
//       { label: "French Polynesia", value: "PF" },
//       { label: "Bourgogne-Franche-Comté", value: "BFC" },
//       { label: "Martinique", value: "972" },
//       { label: "Hauts-de-France", value: "HDF" },
//       { label: "Guadeloupe", value: "971" },
//       { label: "Ain", value: "01" },
//       { label: "Aisne", value: "02" },
//       { label: "Allier", value: "03" },
//       { label: "Alpes-de-Haute-Provence", value: "04" },
//       { label: "Hautes-Alpes", value: "05" },
//       { label: "Alpes-Maritimes", value: "06" },
//       { label: "Ardèche", value: "07" },
//       { label: "Ardennes", value: "08" },
//       { label: "Ariège", value: "09" },
//       { label: "Aube", value: "10" },
//       { label: "Aude", value: "11" },
//       { label: "Aveyron", value: "12" },
//       { label: "Bouches-du-Rhône", value: "13" },
//       { label: "Calvados", value: "14" },
//       { label: "Cantal", value: "15" },
//       { label: "Charente", value: "16" },
//       { label: "Charente-Maritime", value: "17" },
//       { label: "Cher", value: "18" },
//       { label: "Corrèze", value: "19" },
//       { label: "Côte-d'Or", value: "21" },
//       { label: "Côtes-d'Armor", value: "22" },
//       { label: "Creuse", value: "23" },
//       { label: "Dordogne", value: "24" },
//       { label: "Doubs", value: "25" },
//       { label: "Drôme", value: "26" },
//       { label: "Eure", value: "27" },
//       { label: "Eure-et-Loir", value: "28" },
//       { label: "Finistère", value: "29" },
//       { label: "Corse-du-Sud", value: "2A" },
//       { label: "Haute-Corse", value: "2B" },
//       { label: "Gard", value: "30" },
//       { label: "Haute-Garonne", value: "31" },
//       { label: "Gers", value: "32" },
//       { label: "Gironde", value: "33" },
//       { label: "Hérault", value: "34" },
//       { label: "Ille-et-Vilaine", value: "35" },
//       { label: "Indre", value: "36" },
//       { label: "Indre-et-Loire", value: "37" },
//       { label: "Isère", value: "38" },
//       { label: "Jura", value: "39" },
//       { label: "Landes", value: "40" },
//       { label: "Loir-et-Cher", value: "41" },
//       { label: "Loire", value: "42" },
//       { label: "Haute-Loire", value: "43" },
//       { label: "Loire-Atlantique", value: "44" },
//       { label: "Loiret", value: "45" },
//       { label: "Lot", value: "46" },
//       { label: "Lot-et-Garonne", value: "47" },
//       { label: "Lozère", value: "48" },
//       { label: "Maine-et-Loire", value: "49" },
//       { label: "Manche", value: "50" },
//       { label: "Marne", value: "51" },
//       { label: "Haute-Marne", value: "52" },
//       { label: "Mayenne", value: "53" },
//       { label: "Meurthe-et-Moselle", value: "54" },
//       { label: "Meuse", value: "55" },
//       { label: "Morbihan", value: "56" },
//       { label: "Moselle", value: "57" },
//       { label: "Nièvre", value: "58" },
//       { label: "Nord", value: "59" },
//       { label: "Oise", value: "60" },
//       { label: "Orne", value: "61" },
//       { label: "Pas-de-Calais", value: "62" },
//       { label: "Puy-de-Dôme", value: "63" },
//       { label: "Pyrénées-Atlantiques", value: "64" },
//       { label: "Hautes-Pyrénées", value: "65" },
//       { label: "Pyrénées-Orientales", value: "66" },
//       { label: "Bas-Rhin", value: "67" },
//       { label: "Haut-Rhin", value: "68" },
//       { label: "Rhône", value: "69" },
//       { label: "Métropole de Lyon", value: "69M" },
//       { label: "Haute-Saône", value: "70" },
//       { label: "Saône-et-Loire", value: "71" },
//       { label: "Sarthe", value: "72" },
//       { label: "Savoie", value: "73" },
//       { label: "Haute-Savoie", value: "74" },
//       { label: "Seine-Maritime", value: "76" },
//       { label: "Seine-et-Marne", value: "77" },
//       { label: "Yvelines", value: "78" },
//       { label: "Deux-Sèvres", value: "79" },
//       { label: "Somme", value: "80" },
//       { label: "Tarn", value: "81" },
//       { label: "Tarn-et-Garonne", value: "82" },
//       { label: "Var", value: "83" },
//       { label: "Vaucluse", value: "84" },
//       { label: "Vendée", value: "85" },
//       { label: "Vienne", value: "86" },
//       { label: "Haute-Vienne", value: "87" },
//       { label: "Vosges", value: "88" },
//       { label: "Yonne", value: "89" },
//       { label: "Territoire de Belfort", value: "90" },
//       { label: "Essonne", value: "91" },
//       { label: "Hauts-de-Seine", value: "92" },
//       { label: "Seine-Saint-Denis", value: "93" },
//       { label: "Val-de-Marne", value: "94" },
//       { label: "Val-d'Oise", value: "95" },
//       { label: "Clipperton", value: "CP" },
//       { label: "French Southern and Antarctic Lands", value: "TF" }
//     ]
//   },
//   {
//     label: "AR",
//     options: [
//       { label: "San Juan", value: "J" },
//       { label: "Santiago del Estero", value: "G" },
//       { label: "San Luis", value: "D" },
//       { label: "Tucumán", value: "T" },
//       { label: "Corrientes", value: "W" },
//       { label: "Río Negro", value: "R" },
//       { label: "Chaco", value: "H" },
//       { label: "Santa Fe", value: "S" },
//       { label: "Córdoba", value: "X" },
//       { label: "Salta", value: "A" },
//       { label: "Misiones", value: "N" },
//       { label: "Jujuy", value: "Y" },
//       { label: "Mendoza", value: "M" },
//       { label: "Catamarca", value: "K" },
//       { label: "Neuquén", value: "Q" },
//       { label: "Santa Cruz", value: "Z" },
//       { label: "Tierra del Fuego", value: "V" },
//       { label: "Chubut", value: "U" },
//       { label: "Formosa", value: "P" },
//       { label: "La Rioja", value: "F" },
//       { label: "Entre Ríos", value: "E" },
//       { label: "La Pampa", value: "L" },
//       { label: "Buenos Aires", value: "B" },
//       { label: "Ciudad Autónoma de Buenos Aires", value: "C" }
//     ]
//   },
//   {
//     label: "BE",
//     options: [
//       { label: "Limburg", value: "VLI" },
//       { label: "Flanders", value: "VLG" },
//       { label: "Flemish Brabant", value: "VBR" },
//       { label: "Hainaut", value: "WHT" },
//       { label: "Brussels-Capital Region", value: "BRU" },
//       { label: "East Flanders", value: "VOV" },
//       { label: "Namur", value: "WNA" },
//       { label: "Luxembourg", value: "WLX" },
//       { label: "Wallonia", value: "WAL" },
//       { label: "Antwerp", value: "VAN" },
//       { label: "Walloon Brabant", value: "WBR" },
//       { label: "West Flanders", value: "VWV" },
//       { label: "Liège", value: "WLG" }
//     ]
//   },
//   {
//     label: "NL",
//     options: [
//       { label: "Utrecht", value: "UT" },
//       { label: "Gelderland", value: "GE" },
//       { label: "North Holland", value: "NH" },
//       { label: "Drenthe", value: "DR" },
//       { label: "South Holland", value: "ZH" },
//       { label: "Limburg", value: "LI" },
//       { label: "Sint Eustatius", value: "BQ3" },
//       { label: "Groningen", value: "GR" },
//       { label: "Overijssel", value: "OV" },
//       { label: "Flevoland", value: "FL" },
//       { label: "Zeeland", value: "ZE" },
//       { label: "Saba", value: "BQ2" },
//       { label: "Friesland", value: "FR" },
//       { label: "North Brabant", value: "NB" },
//       { label: "Bonaire", value: "BQ1" }
//     ]
//   }
// ];

const states = [
  {
    label: "UK",
    options: [
      { label: "England", value: "ENG" },
      { label: "Scotland", value: "SCO" },
      { label: "Wales", value: "WAL" },
      { label: "Northern Ireland", value: "NI" }
      // Add more UK-specific regions if needed
    ]
  },
  {
    label: "ENG",
    options: [
      { label: "London", value: "LDN" },
      { label: "South East", value: "SE" },
      { label: "South West", value: "SW" },
      { label: "East of England", value: "EE" },
      { label: "West Midlands", value: "WM" },
      { label: "East Midlands", value: "EM" },
      { label: "North West", value: "NW" },
      { label: "North East", value: "NE" },
      { label: "Yorkshire and the Humber", value: "YH" }
      // Add more regions within England if needed
    ]
  },
  // Add similar sections for Scotland, Wales, and Northern Ireland
  {
    label: "SCO",
    options: [
      { label: "Highlands", value: "HI" },
      { label: "Lowlands", value: "LO" }
      // Add more regions within Scotland if needed
    ]
  },
  {
    label: "WAL",
    options: [
      { label: "North Wales", value: "NW" },
      { label: "Mid Wales", value: "MW" },
      { label: "South Wales", value: "SW" }
      // Add more regions within Wales if needed
    ]
  },
  {
    label: "NI",
    options: [
      { label: "Belfast", value: "BF" },
      { label: "Derry", value: "DR" }
      // Add more regions within Northern Ireland if needed
    ]
  }
];

export default states;

export const getAllStates = () => {
  const allStates = [{ label: "All", value: "" }];
  for (const country of states) {
    allStates.push(...country.options);
  }
  return allStates;
};

export const getAllWebsites = (allWebsites: Results[]) => {
  const allWebs = [];
  for (const website of allWebsites) {
    !website.is_trash &&
      allWebs.push({
        label: website.title,
        value: website.title,
        id: website.id,
        site_url: website.site_url,
        authorization_key: website.authorization_key
      });
  }
  return allWebs;
};
export const getAllWebsitesOrders = (allWebsites: Results[]) => {
  const allWebs = [{ id: "0", label: "All", value: "all", site_url: "" }];
  for (const website of allWebsites) {
    !website.is_trash &&
      allWebs.push({
        label: website.title,
        value: website.title,
        id: website.id,
        site_url: website.site_url
      });
  }
  return allWebs;
};

export const getAllWebsitesWithoutAll = (allWebsites: Results[]) => {
  const allWebs = [];
  for (const website of allWebsites) {
    allWebs.push({
      label: website.title,
      value: website.title,
      id: website.id,
      site_url: website.site_url
    });
  }
  return allWebs;
};

export const getAllCustomers = (customers: UserData[]) => {
  const allCustomer = [];
  for (const customer of customers) {
    allCustomer.push({
      value: customer?.id,
      label: customer?.first_name
    });
  }
  return allCustomer;
};
