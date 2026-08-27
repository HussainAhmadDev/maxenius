import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  Card
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SelectField from "../../../Components/SelectField";
import { useProducts } from "../../../Hooks/useProducts";
import Input from "../../../Components/Input";

interface Product {
  vat_percent: number;
  // cost_price: number;
  title: string | null;
  price: number;
  quantity: number;
  total: number | undefined;
  sub_total_tax: number | undefined;
  value: string;
  orderedProductId?: string;
}
interface SelectorValue {
  label: string;
  value: string;
}

interface IProps {
  rows: Product[];
  setRows: React.Dispatch<React.SetStateAction<Product[]>>;
}

const CreateOrderTable: React.FC<IProps> = ({ rows, setRows }) => {
  const { data: productsData, isLoading: productsLoading } = useProducts(
    new URLSearchParams("?count=2000")
  );
  const handleInputChange = (index: number, field: string, value: string | number) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };

    const price = newRows[index].price;
    const quantity = newRows[index].quantity;
    const totalValue = price * quantity;
    newRows[index].total = totalValue;

    const vatPercent = newRows[index].vat_percent;
    const vatAmount = (totalValue * vatPercent) / 100;
    newRows[index].sub_total_tax = vatAmount;

    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        title: "",
        // cost_price: 0,
        price: 0,
        quantity: 0,
        vat_percent: 0,
        total: 0,
        sub_total_tax: 0,
        value: ""
      }
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const productsOptions = useMemo(() => {
    if (productsData?.results?.length) {
      return productsData.results.map(el => ({
        label: `${el.name}${el.barcode ? ` (${el.barcode})` : ""}`,
        value: el.id_hash
      }));
    } else {
      return [];
    }
  }, [productsData]);

  const handleSelectProduct = (opt: SelectorValue, index: number) => {
    const prod = productsData?.results?.find(
      el => String(el.id_hash) === String(opt.value)
    );

    const newRows = [...rows];
    const quantity = Number(prod?.stock_quantity) > 0 ? Number(prod?.stock_quantity) : 1;
    const price = Number(prod?.retail_price) > 0 ? Number(prod?.retail_price) : 1;
    const totalValue = quantity * price;

    // Assuming a default vat_percent of 0, you can adjust this as needed
    const vatPercent = newRows[index].vat_percent || 0;
    const vatAmount = (totalValue * vatPercent) / 100;

    newRows[index] = {
      title: opt.label,
      vat_percent: 0,
      price: price,
      quantity: quantity,
      total: parseFloat(totalValue.toFixed(2)),
      sub_total_tax: parseFloat(vatAmount.toFixed(2)),
      value: opt.value
    };
    setRows(newRows);
  };
  return (
    <TableContainer component={Card} style={{ padding: "8px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Remove</TableCell>
            <TableCell>Product</TableCell>
            {/* <TableCell>Cost Price</TableCell> */}
            <TableCell>Unit Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>VAT %</TableCell>
            <TableCell>Tax</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <IconButton onClick={() => handleRemoveRow(index)}>
                  <RemoveIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <SelectField
                  options={productsOptions}
                  loading={productsLoading}
                  value={row.value}
                  name="product"
                  handleSelect={opt => handleSelectProduct(opt, index)}
                  fullWidth
                  label={""}
                  style={{ minWidth: "200px" }}
                  id="cy__CreateOrderProduct"
                />
              </TableCell>
              {/* Cost Price Field */}
              {/* <TableCell>
                <Input
                  type="number"
                  value={row.cost_price}
                  onChange={e => {
                    if (Number(e.target.value) >= 0) {
                      handleInputChange(index, "cost_price", parseFloat(e.target.value));
                    }
                  }}
                  name="cost_price"
                  fullWidth
                />
              </TableCell> */}
              <TableCell>
                <Input
                  type="number"
                  value={row.price}
                  onChange={e => {
                    if (Number(e.target.value) >= 0) {
                      handleInputChange(index, "price", parseFloat(e.target.value));
                    }
                  }}
                  name="price"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={row.quantity}
                  onChange={e => {
                    if (Number(e.target.value) <= 0) {
                      handleInputChange(index, "quantity", 1);
                    } else {
                      handleInputChange(index, "quantity", parseInt(e.target.value));
                    }
                  }}
                  name="quantity"
                  fullWidth
                />
              </TableCell>
              {/* <TableCell>{row.total}</TableCell> */}
              <TableCell>
                {(typeof row.total === "number" ? row.total : 0).toFixed(2)}
              </TableCell>

              <TableCell>
                <Input
                  type="number"
                  value={row.vat_percent}
                  onChange={e => {
                    if (Number(e.target.value) >= 0) {
                      handleInputChange(index, "vat_percent", parseFloat(e.target.value));
                    }
                  }}
                  name="vat_percent"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                {(typeof row.sub_total_tax === "number" ? row.sub_total_tax : 0).toFixed(
                  2
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box textAlign="end" mt={2} p={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRow}
          disabled={rows?.slice(-1)[0]?.title?.length === 0 || false}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </Box>
    </TableContainer>
  );
};

export default CreateOrderTable;
