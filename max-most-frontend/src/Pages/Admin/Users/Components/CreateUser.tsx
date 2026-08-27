import {
  Box,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Grid,
  CardActions,
  Button,
  Typography,
  Stack,
  Skeleton
} from "@mui/material";
import Input from "../../../../Components/Input";
import { InputValueAndLabel } from "../../../../Interfaces/global";
import Checkbox from "../../../../Components/Checkbox";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateUser, useUpdateUser, useUserByID } from "../../../../Hooks/useUsers";
import { User, UserData } from "../../../../Interfaces/usersType";
import SelectField from "../../../../Components/SelectField";
import { BrandData } from "../../../../Interfaces/brandType";
import { useBrands } from "../../../../Hooks/useBrand";
import { useBrandContext } from "../../../../Contexts/brandContext";
type Option = {
  value: "staff" | "manager" | "super_admin" | "associate";
  label: string;
};
const rolesOptions: Option[] = [
  {
    label: "Staff",
    value: "staff"
  },
  {
    label: "Manager",
    value: "manager"
  },
  {
    label: "Associate",
    value: "associate"
  },
  {
    label: "Super Admin",
    value: "super_admin"
  }
];
function CreateUser() {
  const [values, setValues] = useState<Partial<UserData>>({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
    mobile_phone: "",
    office_phone: "",
    type: "user",
    is_active: true,
    profilePic: "",
    brands: [],
    is_superuser: false,
    is_staff: true,
    is_manager: false,
    is_associate: false
  });
  const handleChange = (event: InputValueAndLabel | null) => {
    if (event) {
      const { label, value } = event;
      setValues({ ...values, [label]: value });
    }
  };
  const { id } = useParams();
  const { data, isLoading: fetchLoading } = useUserByID(id!);
  const { mutateAsync: createUser, isLoading: createLoading } = useCreateUser();
  const { mutateAsync: updateUser, isLoading: updateLoading } = useUpdateUser(id!);
  const { data: brands, isLoading: brandsLoading } = useBrands(
    new URLSearchParams("?count=100")
  );
  const { refreshBrands } = useBrandContext();
  const loading = fetchLoading || createLoading || updateLoading;
  const navigate = useNavigate();
  const handleBrands = (brand: BrandData) => {
    let tempBrands = [...(values?.brands ?? [])];
    if (tempBrands.some(el => el?.id === brand?.id)) {
      tempBrands = tempBrands.filter(el => el?.id !== brand?.id);
    } else {
      const { id, name } = brand;
      tempBrands = [...tempBrands, { id, name }];
    }
    setValues({ ...values, brands: tempBrands });
  };
  const handleRole = (option: { label: string; value: string }) => {
    let key;
    switch (option.value) {
      case "staff":
        key = "is_staff";
        break;
      case "super_admin":
        key = "is_superuser";
        break;
      case "manager":
        key = "is_manager";
        break;
      case "associate":
        key = "is_associate";
        break;
      default:
        key = "";
        break;
    }
    if (key) {
      setValues({
        ...values,
        is_manager: false,
        is_staff: false,
        is_superuser: false,
        [key]: true
      });
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const vals = {
      ...values,
      brands: values?.brands?.map(el => el?.id)?.join(",")
    } as unknown as User;
    if (!vals.password) {
      delete (vals as { password?: string })?.password;
    }
    if (id) {
      updateUser(
        { ...vals },
        {
          onSuccess: () => {
            refreshBrands();
            navigate(`/admin/users`);
          }
        }
      );
    } else {
      createUser(
        { ...vals },
        {
          onSuccess: () => {
            navigate(`/admin/users`);
          }
        }
      );
    }
  };
  const selectedRole = useMemo(() => {
    let role = "";
    switch (true) {
      case values?.is_manager:
        role = "manager";
        break;
      case values?.is_staff:
        role = "staff";
        break;
      case values?.is_superuser:
        role = "super_admin";
        break;
      case values?.is_associate:
        role = "associate";
        break;
      default:
        role = "";
        break;
    }
    return role;
  }, [values]);
  useMemo(() => {
    if (data) {
      const {
        first_name,
        middle_name,
        last_name,
        email,
        mobile_phone,
        office_phone,
        is_active,
        profilePic,
        brands,
        is_superuser,
        is_staff,
        is_manager,
        is_associate
      } = data;
      setValues({
        first_name,
        middle_name,
        last_name,
        email,
        password: "",
        mobile_phone,
        office_phone,
        type: "user",
        is_active: !!is_active,
        profilePic,
        brands,
        is_superuser,
        is_staff,
        is_manager,
        is_associate
      });
    }
  }, [data, setValues]);
  return (
    <>
      <Card>
        <CardHeader
          title={`${id ? "Update" : "Create"} User`}
          titleTypographyProps={{
            variant: "h4",
            fontWeight: "bold"
          }}
        />
        <Divider />
        <Box width={"100%"} maxWidth={"700px"} component={"form"} onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="First Name :"
                  name="first_name"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.first_name}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Middle Name :"
                  name="middle_name"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.middle_name}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Last Name :"
                  name="last_name"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.last_name}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  label="Email :"
                  name={"email"}
                  handleChange={handleChange}
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.email}
                  type="email"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Password :"
                  name="password"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.password}
                  type="password"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Mobile Phone Number :"
                  name="mobile_phone"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.mobile_phone}
                  type="tel"
                  id="cy__MobilePhoneNumber"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  handleChange={handleChange}
                  label="Office Phone Number :"
                  name="office_phone"
                  loading={fetchLoading}
                  disable={loading}
                  value={values?.office_phone}
                  type="tel"
                />
              </Grid>
              <Grid item xs={6}>
                <SelectField
                  handleSelect={handleRole}
                  options={rolesOptions}
                  label="User Role :"
                  name="role"
                  loading={fetchLoading}
                  disable={loading}
                  value={selectedRole}
                />
              </Grid>
              <Grid item xs={12}>
                <Checkbox
                  label="Active/Inactive"
                  handleChange={handleChange}
                  name="is_active"
                  loading={fetchLoading}
                  disabled={loading}
                  checked={values?.is_active}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={"bold"}>Allowed Brands</Typography>
                {brandsLoading || fetchLoading ? (
                  <Skeleton width={"100%"} height={60} />
                ) : (
                  <Stack
                    direction={"row"}
                    width={"100%"}
                    gap={1}
                    flexWrap={"wrap"}
                    justifyContent={"start"}
                  >
                    {brands?.results?.map((brand, key) => {
                      return (
                        <Checkbox
                          key={key}
                          label={brand?.name}
                          loading={fetchLoading}
                          disabled={loading}
                          name={brand.name}
                          handleChange={() => handleBrands(brand)}
                          checked={values?.brands?.some(el => el?.id === brand.id)}
                        />
                      );
                    })}
                  </Stack>
                )}
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
              onClick={() => navigate("/admin/users")}
            >
              Cancel
            </Button>{" "}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              id="cy__SaveUser"
            >
              {id ? "Save" : "Create"} User
            </Button>
          </CardActions>
        </Box>
      </Card>
    </>
  );
}
export default CreateUser;
