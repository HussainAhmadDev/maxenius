export interface TableColumn {
  id: string;
  name: string;
  filter: {
    label: string;
    value: string;
  };
  styles: {
    color: string;
    border: string;
    background: string;
  };
}

export const columnsData = [
  {
    id: 1,
    name: "Pending",
    filter: {
      label: "Pending",
      value: "pending"
    },
    styles: {
      color: "background: rgba(8, 178, 21, 1)",
      border: "1px solid rgba(8, 178, 21, 1)",
      background: "rgba(197, 232, 200, 1)"
    }
  },
  {
    id: 2,
    name: "Processing",
    filter: {
      label: "Processing",
      value: "processing"
    },
    styles: {
      color: "background: rgba(38, 38, 39, 1)",
      border: "1px solid rgba(229, 126, 47, 1)",
      background: "rgba(229, 126, 47, 0.2)"
    }
  },
  {
    id: 3,
    name: "Dispensed",
    filter: {
      label: "Dispensed",
      value: "dispensed"
    },
    styles: {
      color: " rgba(255, 255, 255, 1)",
      border: "1px solid rgba(38, 38, 39, 1)",
      background: "rgba(38, 38, 39, 1)"
    }
  },

  {
    id: 4,
    name: "On Hold",
    filter: {
      label: "On Hold",
      value: "on_hold"
    },
    styles: {
      color: " rgba(255, 255, 255, 1)",
      border: "1px solid rgba(38, 38, 39, 1)",
      background: "rgba(38, 38, 39, 1)"
    }
  },
  {
    id: 5,
    name: "Completed",
    filter: {
      label: "Completed",
      value: "completed"
    },
    styles: {
      color: "background: rgba(38, 38, 39, 1)",
      border: "1px solid rgba(4, 178, 21, 1)",
      background: "rgba(197, 232, 200, 1)"
    }
  },
  {
    id: 6,
    name: "Cancelled",
    filter: {
      label: "Cancelled",
      value: "cancelled"
    },
    styles: {
      color: "background: rgba(38, 38, 39, 1)",
      border: "1px solid rgba(255, 54, 54, 1)",
      background: "rgba(255, 54, 54, 0.2)"
    }
  },
  {
    id: 7,
    name: "Refunded",
    filter: {
      label: "Refunded",
      value: "refunded"
    },
    styles: {
      color: "background: rgba(38, 38, 39, 1)",
      border: "1px solid rgba(255, 54, 54, 1)",
      background: "rgba(255, 54, 54, 0.2)"
    }
  }
];
