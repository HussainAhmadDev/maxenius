import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Button from "Components/Button";
import EditBillingShipping from "../EditBillingShipping/";
import MuiIcon from "Components/icons/MuiIcons";
import { useModal } from "Hooks/useModal";
import { Address, CompanyData, Contact } from "Interfaces/Company";
import { useCreateBillingShippingAddress } from "Hooks/useAddresses";
import { useCreateCompany } from "Hooks/useCompanies";
import { OrderData } from "Interfaces/Order";
import Prompt from "Components/Prompt";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ModalPopup from "Components/ModalPopup";

import FilterTable from "Components/Customer/FilterTable";
import { useEditOrder } from "Hooks/useOrders";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  customerParamsContactKeys,
  customerParamsGeneralKeys
} from "Utils/queryParamKeys";
import { useBrand } from "Context/BrandContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    customerHeading: {
      color: theme.palette.text.primary
    },
    container: {
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      padding: "15px",
      background: theme.palette.gray[100]
    },
    headerSection: {
      borderBottom: `1px solid ${theme.palette.gray[700]}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    customerName: {
      color: theme.palette.primary.main,
      fontWeight: 600
    },
    buttonSection: {
      display: "flex",
      justifyContent: "flex-end"
    },
    btnSection1: {
      display: "flex",
      marginTop: "10px"
    },
    infoSection: {
      display: "flex",
      flexWrap: "wrap"
    },
    infoDiv: {
      width: "50%"
    },
    infoHeading: {
      color: theme.palette.gray[500]
    },
    info: {
      color: theme.palette.text.primary,
      fontSize: "14px",
      marginTop: "0px",
      marginBottom: "5px"
    },
    infoEmailAndPhone: {
      color: theme.palette.primary.main,
      textDecoration: "none",
      cursor: "pointer"
    },
    activeLabel: {
      background: theme.palette.gray[200],
      borderRadius: "6px",
      padding: "5px",
      fontSize: "12px",
      marginTop: "5px"
    },
    selectButton: {
      marginTop: "10px"
    }
  })
);
interface Props {
  readonly type: string;
  readonly address: Address;
  readonly company?: CompanyData;
  orderId: string;
  order: OrderData;
}
const Info: React.FC<Props> = ({ address, type, company, orderId, order }) => {
  const classes = useStyles();
  const { mutate } = useCreateBillingShippingAddress(
    orderId,
    type === "Billing" ? "shipping" : "billing"
  );
  const [checked, setChecked] = React.useState(true);
  const [showCopyWarning, setShowCopyWarning] = React.useState(false);

  // const getFullName = ({ first_name = "", last_name = "" }: Address) =>
  //   `${first_name} ${last_name}`;
  // const getAddress = ({ city = "", state = "", zip = "" }: Address) =>
  //   `${city} ${state} ${zip}`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const copyToType = type === "Billing" ? "shipping" : "billing";
  const promptMessage = `This will copy ${type.toLowerCase()} address to ${copyToType} address`;

  // Modal Functions
  const { handleSave, handleModalClose, modalOpen } = useModal();
  return (
    <div>
      <Prompt
        promptMsg={promptMessage}
        title={`Copy to ${copyToType} address`}
        openModal={showCopyWarning}
        onCancel={() => setShowCopyWarning(false)}
        onProceed={() => {
          setShowCopyWarning(false);
          mutate(
            Object.fromEntries(Object.entries(address).filter(([_, v]) => v != null))
          );
        }}
      />
      <div className={classes.infoDiv}>
        {/* edit billing chipping modal */}
        <EditBillingShipping
          saveText="Confirm Update"
          title={`Edit ${type} Information`}
          handleSaveChanges={handleSave}
          handleCloseModal={handleModalClose}
          checkBox={{
            text: "Update Original Customer",
            value: checked,
            handleChange: handleChange
          }}
          openModal={modalOpen}
          address={address}
          type={type === "Billing" ? "billing" : "shipping"}
          company={company?.name || ""}
        />

        {/* edit billing chipping modal */}
        <h4 className={classes.infoHeading}>{type} Information</h4>

        {address && (
          <div>
            {/* {!company?.is_individual && <p className={classes.info}>{company?.name}</p>} */}
            {type === "Shipping" && order?.shipping_address && (
              <>
                <p className={classes.info}>
                  {order.shipping_address.first_name && order.shipping_address.last_name
                    ? `${order.shipping_address.first_name} ${order.shipping_address.last_name}`
                    : null}
                </p>
                <p className={classes.info}>{order.shipping_address.company || null}</p>
                <p className={classes.info}>{order.shipping_address.street1 || null}</p>
                <p className={classes.info}>{order.shipping_address.street2 || null}</p>
                <p className={classes.info}>
                  {order.shipping_address.city && order.shipping_address.country
                    ? `${order.shipping_address.city} ${order.shipping_address.country}`
                    : null}
                </p>
                <p className={classes.info}>{order.shipping_address.zip || null}</p>
              </>
            )}

            {type === "Billing" && order?.billing_address && (
              <>
                <p className={classes.info}>
                  {order.billing_address.first_name && order.billing_address.last_name
                    ? `${order.billing_address.first_name} ${order.billing_address.last_name}`
                    : null}
                </p>
                <p className={classes.info}>{order.billing_address.company || null}</p>
                <p className={classes.info}>{order.billing_address.street1 || null}</p>
                <p className={classes.info}>{order.billing_address.street2 || null}</p>
                <p className={classes.info}>
                  {order.billing_address.city && order.billing_address.country
                    ? `${order.billing_address.city} ${order.billing_address.country}`
                    : null}
                </p>
                <p className={classes.info}>{order.billing_address.zip || null}</p>
              </>
            )}

            <p className={classes.info}>
              {/* <span
                className={classes.infoEmailAndPhone}
                onClick={() => {
                  navigator.clipboard.writeText(address.email || "");
                }}
              >
                {company?.address.city + " " + company?.address.country}
              </span> */}
              <Tooltip
                title={
                  <React.Fragment>
                    <Typography color="inherit">Copy to clipboard.</Typography>
                  </React.Fragment>
                }
                placement="top"
              >
                <span
                  className={classes.infoEmailAndPhone}
                  onClick={() => {
                    navigator.clipboard.writeText(address.email || "");
                  }}
                >
                  {address.email}
                </span>
              </Tooltip>
            </p>

            <p className={classes.info}>
              {/* <NumberFormat
                displayType="text"
                value={address?.phone ?? ""}
                format="###-###-####"
              /> */}
              {address?.phone ? address.phone.replace(/-/g, "") : ""}
            </p>
          </div>
        )}
        <div className={classes.btnSection1}>
          {/* <Button
            loading={isLoading}
            text={`Copy to ${type === "Billing" ? "Shipping" : "Billing"}`}
            type="secondary"
            icon={<MuiIcon icon="copy" />}
            disabled={!address}
            onClick={() => setShowCopyWarning(true)}
          />{" "}
          &nbsp;&nbsp;
          <Button
            text="Edit"
            type="secondary"
            icon={<MuiIcon icon="edit" />}
            onClick={() => handleModalOpen()}
          /> */}
        </div>
      </div>
    </div>
  );
};

interface InfoProps {
  order: OrderData;
  customer: CompanyData;
}

// interface ColumnsProps {
//   readonly name: string;
//   readonly sortable?: boolean;
//   readonly width?: string;
//   readonly selector: (row: CompanyContact) => string | React.ReactNode | undefined;
// }

const CustomerInfo: React.FC<InfoProps> = ({ order, customer }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [selectedContact] = React.useState<Contact>();
  const [changedCustomer, setChangedCustomer] = React.useState<CompanyData>();
  const [showWarning, setShowWarning] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { activeBrand } = useBrand();
  // const { data: companyNotes, isLoading: notesLoading } = useCompanyNotes(customer.id);
  // const { data: contacts, isLoading: contactsLoading } = useCompanyContacts(customer.id);
  const { mutateAsync: changeOrderCustomer } = useEditOrder(order?.id || "");
  const { mutate: createCompany } = useCreateCompany();

  const queryParamsKeys = [
    ...customerParamsContactKeys,
    ...customerParamsGeneralKeys,
    "search_by_bill_to",
    "search_by_ship_to"
  ];

  // const defaultOpen = companyNotes && companyNotes.results.length > 0;
  // const isFirstRender = React.useRef(true);
  // const popUpModal = useModal({
  //   defaultOpen
  // });

  const changeContactModal = useModal();

  // const columns: ColumnsProps[] = [
  //   {
  //     name: "Name",
  //     selector: ({ contact }) => {
  //       const contactInfo: Address = contact.is_billing
  //         ? contact.billing_address
  //         : contact.shipping_address;
  //       return (
  //         <Typography
  //           variant="subtitle1"
  //           className={classes.customerName}
  //           style={{ fontSize: "12px" }}
  //         >
  //           {contactInfo.first_name} {contactInfo.last_name}
  //         </Typography>
  //       );
  //     },
  //     sortable: true
  //   },
  //   {
  //     name: "Address",
  //     selector: ({ contact }) => {
  //       const contactInfo: Address = contact.is_billing
  //         ? contact.billing_address
  //         : contact.shipping_address;
  //       return (
  //         <>
  //           <Typography
  //             variant="subtitle1"
  //             style={{ fontSize: "12px", textAlign: "left" }}
  //           >
  //             {contact.title}
  //           </Typography>
  //           <Typography
  //             variant="subtitle1"
  //             style={{ fontSize: "12px", textAlign: "left" }}
  //           >
  //             {contactInfo.street1}
  //           </Typography>
  //           <Typography
  //             variant="subtitle1"
  //             style={{ fontSize: "12px", textAlign: "left" }}
  //           >
  //             {contactInfo.street2}
  //           </Typography>
  //           <Typography
  //             variant="subtitle1"
  //             style={{ fontSize: "12px", textAlign: "left" }}
  //           >
  //             {contactInfo.country} {contactInfo.state} {contactInfo.city}{" "}
  //             {contactInfo.zip}
  //           </Typography>
  //         </>
  //       );
  //     },
  //     sortable: true
  //   },
  //   {
  //     name: "Type",
  //     width: "270px",
  //     selector: ({ contact }) => (
  //       <Typography variant="subtitle1">
  //         {contact.is_billing && (
  //           <span className={classes.activeLabel} style={{ fontSize: "12px" }}>
  //             Billing Contact
  //           </span>
  //         )}{" "}
  //         {contact.is_shipping && (
  //           <span className={classes.activeLabel} style={{ fontSize: "12px" }}>
  //             Shipping Contact
  //           </span>
  //         )}
  //       </Typography>
  //     ),
  //     sortable: true
  //   },
  //   {
  //     name: "",
  //     selector: ({ contact_id, contact }) => (
  //       <div className={classes.selectButton}>
  //         <Button
  //           text="Select"
  //           variant={selectedContact?.id === contact_id ? "contained" : "outlined"}
  //           icon={
  //             selectedContact?.id === contact_id ? (
  //               <CheckCircleOutlineIcon />
  //             ) : (
  //               <CheckCircleIcon />
  //             )
  //           }
  //           onClick={() => {
  //             setSelectedContact(contact);
  //           }}
  //         />
  //       </div>
  //     )
  //   }
  // ];
  const changeCustomerModal = useModal();
  const deleteQueryParams = () => {
    const params = new URLSearchParams(searchParams);
    queryParamsKeys.forEach(key => params.delete(key));
    setSearchParams(params);
  };

  const { billing_address, shipping_address } = order;

  // React.useEffect(() => {
  //   if (
  //     isFirstRender &&
  //     !notesLoading &&
  //     companyNotes &&
  //     companyNotes?.results?.length > 0
  //   ) {
  //     popUpModal.handleModalOpen();
  //     isFirstRender.current = false;
  //   }
  // }, [companyNotes, notesLoading]); // eslint-disable-line

  const handleSelectCustomer = (customer: CompanyData) => {
    setChangedCustomer(customer);
  };

  return (
    <div>
      <Prompt
        promptMsg={
          "This will create a customer with the customer number only. You'll have to add the rest of the customer information after creation."
        }
        title={`Create new customer`}
        openModal={showWarning}
        onCancel={() => setShowWarning(false)}
        onProceed={() => {
          setShowWarning(false);
          createCompany(activeBrand);
        }}
      />
      <h2 className={classes.customerHeading}> Customer</h2>
      <div className={classes.container}>
        <div className={classes.headerSection}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ paddingBottom: "15px" }}
          >
            <Grid item md={4} lg={4} sm={12} xs={12}>
              <div>
                <p className={classes.customerName} aria-label="customer name">
                  {customer.name}
                </p>
              </div>
            </Grid>
          </Grid>
        </div>
        <Grid container>
          <Grid item md={6} lg={6} sm={12} xs={12}>
            <Info
              type="Billing"
              address={billing_address}
              orderId={order.id}
              company={customer}
              order={order}
            />
          </Grid>
          <Grid item md={6} lg={6} sm={12} xs={12}>
            <Info
              type="Shipping"
              address={shipping_address}
              orderId={order.id}
              company={customer}
              order={order}
            />
          </Grid>
        </Grid>
      </div>
      <ModalPopup
        maxWidth="lg"
        modalTitle={"Change Customer"}
        saveBtnText={"Confirm Change"}
        disableSaveBtn={!changedCustomer}
        openModal={changeCustomerModal.modalOpen}
        handleCloseModal={() => {
          deleteQueryParams();
          changeCustomerModal.handleModalClose();
        }}
        handleSaveChanges={() => {
          if (changedCustomer !== undefined) {
            changeOrderCustomer({
              company_id: changedCustomer?.id,
              contact_id: changedCustomer?.billing_contact_id
            });
            deleteQueryParams();
            changeCustomerModal.handleSave();
          }
        }}
      >
        <FilterTable handleSelectCustomer={handleSelectCustomer} />
      </ModalPopup>
      {/* <PopUpNotes
        handleSaveChanges={() => null}
        title="Customer Popup Notes"
        companyId={customer?.id || ""}
        handleCloseModal={popUpModal.handleModalClose}
        openModal={popUpModal.modalOpen}
        noFooter={true}
      /> */}
      <ModalPopup
        maxWidth="md"
        modalTitle={"Change Contact"}
        saveBtnText={"Confirm Change"}
        disableSaveBtn={false}
        openModal={changeContactModal.modalOpen}
        handleCloseModal={changeContactModal.handleModalClose}
        handleSaveChanges={() => {
          if (selectedContact) {
            changeOrderCustomer({
              contact_id: selectedContact.id
            });
            changeContactModal.handleSave();
          }
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p className={classes.customerName} aria-label="customer name">
            {customer.name}
          </p>
          <Button
            text="Create Contact"
            variant="outlined"
            icon={<MuiIcon icon="add" />}
            onClick={() => {
              navigate(`/customers/${customer.id}/contact`);
            }}
          />
        </div>
        {/* <Typography>Contacts</Typography> */}
        {/* <DataTable columns={columns} data={contacts?.results} loading={contactsLoading} /> */}
      </ModalPopup>
    </div>
  );
};

export default CustomerInfo;
