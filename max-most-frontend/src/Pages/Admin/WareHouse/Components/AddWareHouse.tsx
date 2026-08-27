import {
  Box,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Grid,
  CardActions,
  Button
} from "@mui/material";

import Input from "../../../../Components/Input";
import { InputValueAndLabel } from "../../../../Interfaces/global";

import TextArea from "../../../../Components/Textarea";
import Checkbox from "../../../../Components/Checkbox";
import { useMemo, useState } from "react";
import {
  useCreateWarehouse,
  useUpdateWarehouse,
  useWarehouseById
} from "../../../../Hooks/useWarehouses";
import { Warehouse } from "../../../../Interfaces/warehouseType";
import { useNavigate, useParams } from "react-router-dom";
interface FormState {
  name: string;
  description: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  region: string;
  post_code: string;
  country: string;
  is_active: boolean;
}
function AddWareHouse() {
  const [values, setValues] = useState<FormState>({
    name: "",
    description: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    region: "",
    post_code: "",
    country: "",
    is_active: false
  });
  const handleChange = (event: InputValueAndLabel | null) => {
    if (event) {
      const { label, value } = event;
      setValues({ ...values, [label]: value });
    }
  };
  const { id } = useParams();
  const { data, isLoading: fetchLoading } = useWarehouseById(id!);
  const { mutate: createNewWarehouse, isLoading: createLoading } = useCreateWarehouse();
  const { mutate: UpdateNewWarehouse, isLoading: updateLoading } = useUpdateWarehouse({
    id: id!
  });
  const loading = fetchLoading || createLoading || updateLoading;
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const vals = { ...values, is_active: true } as unknown as Warehouse;
    if (id) {
      UpdateNewWarehouse(
        { ...vals },
        {
          onSuccess: () => {
            navigate(`/admin/warehouse`);
          }
        }
      );
    } else {
      createNewWarehouse(
        { ...vals },
        {
          onSuccess: () => {
            navigate(`/admin/warehouse`);
          }
        }
      );
    }
  };
  useMemo(() => {
    if (data) {
      const {
        address_line_1,
        address_line_2,
        city,
        country,
        is_active,
        region,
        post_code,
        description,
        name
      } = data;
      setValues({
        address_line_1,
        address_line_2,
        city,
        country,
        is_active: Boolean(is_active),
        region,
        post_code,
        description,
        name
      });
    }
  }, [data, setValues]);
  return (
    <>
      <Card>
        <CardHeader
          title={`${id ? "Update" : "Add"} WareHouse`}
          titleTypographyProps={{
            variant: "h4",
            fontWeight: "bold"
          }}
        />
        <Divider />
        <Box width={"100%"} maxWidth={"700px"} component={"form"} onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Input
                  handleChange={handleChange}
                  label="Warehouse Name :"
                  name="name"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.name}
                  required
                  id="cy__EditWarehouseName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextArea
                  label="Description :"
                  name={"description"}
                  handleChange={handleChange}
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.description}
                  id="cy__WarehouseDiscription"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Address Line 1 :"
                  name="address_line_1"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.address_line_1}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Address Line 2 :"
                  name="address_line_2"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.address_line_2}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="City/Town :"
                  name="city"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.city}
                />
              </Grid>

              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Region :"
                  name="region"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.region}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Post code :"
                  name="post_code"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.post_code}
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Country:"
                  name="country"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.country}
                />
              </Grid>
              <Grid item xs={12}>
                <Checkbox
                  label="Mark as not-active"
                  handleChange={handleChange}
                  name="is_active"
                  loading={fetchLoading}
                  disabled={loading}
                  checked={values?.is_active}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions
            sx={{
              justifyContent: "space-between",
              p: 2
            }}
          >
            <Button
              color="secondary"
              variant="contained"
              disabled={loading}
              onClick={() => navigate("/admin/warehouses")}
            >
              Cancel
            </Button>{" "}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              id="cy__WarehouseSaveBtn"
            >
              {id ? "Save" : "Add"} Warehouse
            </Button>
          </CardActions>
        </Box>
      </Card>
    </>
  );
}
export default AddWareHouse;
