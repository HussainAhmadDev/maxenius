import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import dayOfYear from "dayjs/plugin/dayOfYear";

dayjs.extend(isoWeek);
dayjs.extend(dayOfYear);

import { SelectOption } from "../Interfaces/ui";

const rangesOptions: SelectOption[] = [
  {
    label: "All Time",
    value: "all_time"
  },
  {
    label: "Today",
    value: dayjs().format("YYYY-MM-DD HH:mm:ss")
  },
  {
    label: "Week to Date",
    value: dayjs().startOf("isoWeek").format("YYYY-MM-DD HH:mm:ss")
  },
  {
    label: "Month to Date",
    value: dayjs().startOf("month").format("YYYY-MM-DD")
  },
  {
    label: "Year to Date",
    value: dayjs().startOf("year").format("YYYY-MM-DD")
  },
  {
    label: "Chose Date Range",
    value: "custom"
  }
];
const paymentMethods = [
  {
    label: "APPLEPAY",
    value: "APPLEPAY"
  },
  {
    label: "CARD",
    value: "CARD"
  },
  {
    label: "CHEQUE",
    value: "CHEQUE"
  },
  {
    label: "COD",
    value: "COD"
  },
  {
    label: "INVOICE",
    value: "INVOICE"
  }
];
export { rangesOptions, paymentMethods };
