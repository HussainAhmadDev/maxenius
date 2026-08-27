import * as React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Typography } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { useEditProduct, useSingleProduct } from "Hooks/useProducts";
import { Discount, ProductData } from "Interfaces/Products";
import { NavBar } from "../../Navbar";
import MuiIcon from "../../icons/MuiIcons";
import ProductInfo from "./ProductInfo";
import Button from "../../Button";
// import ProductType from "./ProductType";
import ProductMeta from "./ProductMeta";
// import { useBrand } from "Context/BrandContext";
// import TextInput from "Components/Form/TextInput";
import { nanoid } from "nanoid";
// import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
// import { useWarningMessageByID } from "Hooks/useWarningMessage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: "30px"
    },
    flexDiv: {
      display: "flex",
      width: "fit-content",
      cursor: "pointer"
    },
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end"
    },
    backArrow: {
      display: "flex",
      width: "fit-content",
      cursor: "pointer"
    },
    iconCell: {
      display: "flex",
      justifyContent: "right"
    },
    tableCell: {
      padding: "17px",
      // width: "150px",
      textAlign: "left"
    },
    label1: {
      marginTop: theme.spacing(2)
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    tHead: { borderCollapse: "collapse" },
    tableHeader: {
      background: theme.palette.gray[1000],
      borderRadius: "6px 6px 0px 0px",
      height: "52px",
      color: theme.palette.gray[500],
      fontSize: "12px"
    }
  })
);
const validationSchema = yup.object({
  name: yup
    .string()
    .min(2, "Please enter a valid name")
    .required("Product name is required")
});
interface AddDiscount {
  id?: string;
  from_quantity: number;
  to_quantity: number;
  price: number;
  brand_id?: string;
  barCode?: string;
  quantity_per_pack?: number;
}

const EditProduct = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<"id">();
  const { data } = useSingleProduct(id || "");
  const [productImage, setProductImage] = React.useState("");
  const [addedDiscounts, setAddedDiscounts] = React.useState<Array<AddDiscount>>([]);
  const [editedDiscounts, setEditedDiscounts] = React.useState<Array<AddDiscount>>([]);
  const { mutate: editProduct, isLoading } = useEditProduct(data?.id);
  const [selectedWarning, setSelectedWarning] = React.useState<{
    label: string;
    value: string;
  }>({ label: "", value: "" });

  // const [searchParams, setSearchParams] = useSearchParams()

  // const { data: warningByID, isLoading: warningByIDLoading } = useWarningMessageByID(id ? id : '', searchParams)

  React.useEffect(() => {
    if (data && !selectedWarning.label) {
      setSelectedWarning({
        label: `${data.warning_number || ""}  - ${data.warning_message || ""}`,
        value: data.warning_id || ""
      });
    }
  }, [data, selectedWarning.label]);
  React.useEffect(() => {
    setEditedDiscounts(
      data?.discounts?.map(discount => {
        return {
          id: nanoid(),
          from_quantity: discount.from_quantity,
          to_quantity: discount.to_quantity,
          price: discount.price,
          brand_id: discount.brand_id
        } as AddDiscount;
      }) || ([] as AddDiscount[])
    );
  }, [data?.discounts, data?.warning_message]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data || ({} as Partial<ProductData>),
    validationSchema: validationSchema,
    onSubmit: values => {
      const value = Object.fromEntries(
        //eslint-disable-next-line
        Object.entries(values).filter(([_, v]) => v != null)
      );

      delete value["warning_number"];

      value.image = productImage;

      const updatedValue = {
        ...value,
        warning_message: selectedWarning?.label?.split("-")[1]?.trim() || "",
        warning_id: selectedWarning.value
      };

      // value.attributes = value.attributes.map(({ product_id, ...rest }) => rest);
      delete value.images;
      editProduct({
        ...updatedValue,
        discounts: [...addedDiscounts, ...editedDiscounts]
          .map(discount => {
            delete discount.id;
            return discount as Discount;
          })
          .filter(
            discount =>
              discount.price > 0 && discount.to_quantity > 0 && discount.from_quantity > 0
          )
      });
      setAddedDiscounts([]);
    }
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <NavBar pageTitle={data?.name}>
          <div className={classes.headerButtons}>
            <Button
              aria-label="cancel"
              text="Cancel"
              type="secondary"
              onClick={() => navigate(-1)}
            />
            &nbsp;
            <Button
              text="Save Product"
              variant="contained"
              loading={isLoading}
              submit="submit"
            />
          </div>
        </NavBar>
        <div className={classes.container}>
          <Typography variant="body2">
            <span onClick={() => navigate(-1)} className={classes.backArrow}>
              <MuiIcon icon="backArrow" fontSize="small" />
              {"Products"}
            </span>
          </Typography>
          <br />
          <br />
          <ProductInfo
            setProductImage={setProductImage}
            data={formik.values}
            formik={formik}
            setSelectedWarning={setSelectedWarning}
            selectedWarning={selectedWarning}
          >
            {/* <ProductType data={formik.values} formik={formik} /> */}
            <ProductMeta data={formik.values} formik={formik}>
              {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography variant="subtitle1" className={classes.label1}>
                  Discount Table{" "}
                </Typography>
                <table className={classes.table}>
                  <thead className={classes.tHead}>
                    <tr className={classes.tableHeader}>
                      <th className={classes.tableCell}>Quantity Range</th>
                      <th className={classes.tableCell}>Price ($)</th>
                      <th className={classes.tableCell}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editedDiscounts.length > 0 &&
                      editedDiscounts?.map(discount => (
                        <DiscountEditingRow
                          key={discount.id}
                          discount={discount}
                          setDiscounts={setEditedDiscounts}
                        />
                      ))}
                    {addedDiscounts?.map(discount => (
                      <DiscountAddingRow
                        key={discount.id}
                        discount={discount}
                        setDiscounts={setAddedDiscounts}
                      />
                    ))}
                  </tbody>
                </table>
                <br />
                <div style={{ display: "flex" }}>
                  <Button
                    text="Add Discount"
                    type="secondary"
                    icon={<MuiIcon icon="add" />}
                    style={{ marginRight: "5px" }}
                    onClick={() => {
                      setAddedDiscounts(discounts => [
                        ...discounts,
                        { id: nanoid(), from_quantity: 0, to_quantity: 0, price: 0 }
                      ]);
                    }}
                  />
                </div>
              </Grid> */}
            </ProductMeta>
          </ProductInfo>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;

// const DiscountAddingRow: React.FC<{
//   discount: AddDiscount;
//   setDiscounts: React.Dispatch<React.SetStateAction<AddDiscount[]>>;
// }> = ({ discount, setDiscounts }) => {
//   const { activeBrand } = useBrand();
//   const [isEditing, setIsEditing] = React.useState(
//     discount.brand_id === undefined ? true : false
//   );
//   const [currentDiscount, setCurrentDiscount] = React.useState(discount);
//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (Number(value) >= 0) {
//       // This is actually from Quantity
//       if (name === "to_quantity") {
//         setCurrentDiscount({
//           ...currentDiscount,
//           to_quantity: parseInt(value)
//         });
//       }
//       // This is actually to Quantity
//       if (name === "from_quantity") {
//         setCurrentDiscount({
//           ...currentDiscount,
//           from_quantity: parseInt(value)
//         });
//       }
//       if (name === "price") {
//         setCurrentDiscount({
//           ...currentDiscount,
//           price: Number(value)
//         });
//       }
//     }
//   };

//   const classes = useStyles();
//   return isEditing ? (
//     <tr>
//       <td className={classes.tableCell}>
//         <div style={{ display: "inline-flex", width: "min-content" }}>
//           <TextInput
//             name="to_quantity"
//             margin="dense"
//             label="From Quanity"
//             type="number"
//             value={currentDiscount.to_quantity}
//             variant="outlined"
//             onChange={handleChange}
//             error={currentDiscount.to_quantity >= currentDiscount.from_quantity}
//             style={{ width: "70px", marginRight: "10px" }}
//           />
//         </div>
//         <div style={{ display: "inline-flex", width: "min-content" }}>
//           <TextInput
//             name="from_quantity"
//             label="To Quantity"
//             margin="dense"
//             type="number"
//             value={currentDiscount.from_quantity}
//             variant="outlined"
//             onChange={handleChange}
//             error={currentDiscount.from_quantity <= currentDiscount.to_quantity}
//             style={{ width: "70px", marginRight: "10px" }}
//           />
//         </div>
//       </td>
//       <td className={classes.tableCell}>
//         <TextInput
//           name="price"
//           margin="dense"
//           type="number"
//           value={currentDiscount.price}
//           variant="outlined"
//           onChange={handleChange}
//           style={{ width: "150px", marginRight: "10px" }}
//         />
//       </td>
//       <td>
//         <div className={classes.iconCell}>
//           <Button
//             icon={<MuiIcon fontSize="small" icon="check" />}
//             onlyIcon={true}
//             onClick={() => {
//               setDiscounts(discounts =>
//                 discounts.map(data =>
//                   data.id === discount.id
//                     ? { ...currentDiscount, brand_id: activeBrand }
//                     : data
//                 )
//               );
//               setIsEditing(false);
//             }}
//             type="secondary"
//             variant="outlined"
//             size="small"
//           />
//           &nbsp;&nbsp;
//           <Button
//             size="small"
//             icon={<MuiIcon fontSize="small" icon="cancel" />}
//             onlyIcon={true}
//             onClick={() => {
//               setIsEditing(false);
//             }}
//             type="secondary"
//             variant="outlined"
//           />
//         </div>
//       </td>
//     </tr>
//   ) : (
//     <tr>
//       <td className={classes.tableCell}>
//         {discount.from_quantity}-{discount.to_quantity}
//       </td>
//       <td className={classes.tableCell}>${discount.price}</td>
//       <td>
//         <div className={classes.iconCell}>
//           <Button
//             icon={<MuiIcon fontSize="small" icon="edit" />}
//             onlyIcon={true}
//             onClick={() => {
//               setIsEditing(true);
//             }}
//             type="secondary"
//             variant="outlined"
//             size="small"
//           />
//           &nbsp;&nbsp;
//           <Button
//             icon={<MuiIcon fontSize="small" icon="delete" />}
//             onlyIcon={true}
//             onClick={() => {
//               setDiscounts(discounts =>
//                 discounts.filter(data => data.id !== discount.id)
//               );
//             }}
//             type="secondary"
//             variant="outlined"
//             size="small"
//           />
//         </div>
//       </td>
//     </tr>
//   );
// };

// const DiscountEditingRow: React.FC<{
//   discount: AddDiscount;
//   setDiscounts: React.Dispatch<React.SetStateAction<AddDiscount[]>>;
// }> = ({ discount, setDiscounts }) => {
//   const [isEditing, setIsEditing] = React.useState(false);
//   const [state, setState] = React.useState(discount.price);

//   const classes = useStyles();
//   return (
//     <tr>
//       <td className={classes.tableCell}>
//         {discount.from_quantity}-{discount.to_quantity}
//       </td>

//       {isEditing ? (
//         <>
//           <td className={classes.tableCell}>
//             <TextInput
//               name="price"
//               margin="dense"
//               type="number"
//               value={state}
//               variant="outlined"
//               onChange={e => {
//                 setState(Number(e.target.value));
//               }}
//               style={{ width: "150px", marginRight: "10px" }}
//             />
//           </td>
//           <td>
//             <div className={classes.iconCell}>
//               <Button
//                 icon={<MuiIcon fontSize="small" icon="check" />}
//                 onlyIcon={true}
//                 onClick={() => {
//                   setDiscounts(discounts =>
//                     discounts.map(data =>
//                       data.id === discount.id ? { ...discount, price: state } : data
//                     )
//                   );
//                   setIsEditing(false);
//                 }}
//                 type="secondary"
//                 variant="outlined"
//                 size="small"
//               />
//               &nbsp;&nbsp;
//               <Button
//                 size="small"
//                 icon={<MuiIcon fontSize="small" icon="cancel" />}
//                 onlyIcon={true}
//                 onClick={() => {
//                   setIsEditing(false);
//                 }}
//                 type="secondary"
//                 variant="outlined"
//               />
//             </div>
//           </td>
//         </>
//       ) : (
//         <>
//           <td className={classes.tableCell}>${discount.price}</td>
//           <td>
//             <div className={classes.iconCell}>
//               <Button
//                 icon={<MuiIcon fontSize="small" icon="edit" />}
//                 onlyIcon={true}
//                 onClick={() => {
//                   setIsEditing(true);
//                 }}
//                 type="secondary"
//                 variant="outlined"
//                 size="small"
//               />
//               &nbsp;&nbsp;
//               <Button
//                 icon={<MuiIcon fontSize="small" icon="delete" />}
//                 onlyIcon={true}
//                 onClick={() => {
//                   setDiscounts(discounts =>
//                     discounts.filter(data => data.id !== discount.id)
//                   );
//                 }}
//                 type="secondary"
//                 variant="outlined"
//                 size="small"
//               />
//             </div>
//           </td>
//         </>
//       )}
//     </tr>
//   );
// };
