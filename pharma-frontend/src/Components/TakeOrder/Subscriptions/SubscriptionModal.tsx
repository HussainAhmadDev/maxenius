import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ModalPopup from "Components/ModalPopup";
import ReNewSubscription from "./SubscriptionForms/ReNewSubscription";
import { OrderData } from "Interfaces/Order";
import SubscriptionForm from "./SubscriptionForms";
import Grid from "@mui/material/Grid";
import { Form } from "Interfaces/Subscriptions";
import {
  useCreateGovBuddySubscription,
  useExtendGovBuddySubscription,
  useUpgradeSubscription
} from "Hooks/useSubscriptions";
import { reducer } from "Reducers/subscriptionForm";
import { PaymentModal } from "./SubscriptionForms/PaymentModal";
import { initialCardState } from "Components/Payments/data";
import { CreditCardState } from "Components/Payments/types";
import { createFormReducer } from "Reducers/formReducer";
import { PaymentType } from "Interfaces/Payment";
import { useModal } from "Hooks/useModal";
// import { useProducts } from "Hooks/useProducts";
import { isoToMarshmallow } from "Utils/Regex";

interface Props {
  readonly handleSaveChanges: () => void;
  readonly handleCloseModal: () => void;
  readonly openModal: boolean;
  readonly order: OrderData;
}

type TabTypes =
  | "newSubscriptionForm"
  | "upgradeSubscriptionForm"
  | "reNewSubscriptionForm";

const newInitData: Array<Form> = [
  {
    id: "new_person",
    icon: "person",
    title: "individual",
    description: "For individual users",
    fields: [
      { label: "Price", type: "number", name: "price", value: 0 },
      { name: "email", type: "text", label: "Enter your email", value: "" },
      { label: "Auto Renew", type: "boolean", name: "is_auto_renew", value: false }
    ]
  },
  {
    id: "new_team",
    icon: "persons",
    title: "teams",
    description: "For teams",
    fields: [
      { label: "Price per Member", type: "number", name: "price", value: 0 },
      { name: "email", type: "text", label: "Enter your email", value: "" },
      { label: "Auto Renew", type: "boolean", name: "is_auto_renew", value: false }
    ]
  },
  {
    id: "new_enterprise",
    icon: "city",
    title: "enterprise",
    description: "For large organizations",
    fields: [
      { label: "Customer Price", type: "number", name: "price", value: 0 },
      { label: "No. of Seats", type: "number", name: "seats", value: 0 },
      { name: "email", type: "text", label: "Enter your email", value: "" },
      { label: "Auto Renew", type: "boolean", name: "is_auto_renew", value: false }
    ]
  }
];

const reNewInitData: Array<Form> = [
  {
    id: "renew",
    title: "renewSubscription",
    fields: [
      { label: "Sticky Order ID", type: "text", name: "sticky_order_id", value: "" },
      {
        label: "Confirm Sticky Order ID",
        type: "text",
        name: "confirm_sticky_order_id",
        value: ""
      }
    ]
  }
];

const upgradeInitData: Array<Form> = [
  {
    id: "upgrade_team",
    icon: "persons",
    title: "teams",
    description: "For teams",
    fields: [
      { label: "No. of Team Member", type: "number", name: "seats", value: 0 },
      { label: "Sticky Order ID", type: "text", name: "sticky_order_id", value: "" },
      { label: "Yearly Cost", type: "number", name: "yearly_cost", value: 0 },
      { label: "Auto Renew", type: "boolean", name: "is_auto_renew", value: false }
    ]
  },
  {
    id: "upgrade_enterprice",
    icon: "city",
    title: "enterprise",
    description: "For large organizations",
    fields: [
      { label: "No. of Seats", type: "number", name: "seats", value: 0 },
      { label: "Sticky Order ID", type: "text", name: "sticky_order_id", value: "" },
      { label: "Yearly Cost", type: "number", name: "yearly_cost", value: 0 },
      { label: "Auto Renew", type: "boolean", name: "is_auto_renew", value: false }
    ]
  }
];

const creditCardReducer = createFormReducer<CreditCardState>(initialCardState);

const SubscriptionModal: React.FC<Props> = props => {
  const { order } = props;
  const { mutate: createSubscription, isLoading } = useCreateGovBuddySubscription(
    order.id
  );
  const { mutate: extendSubscription, isLoading: isLoadingExtend } =
    useExtendGovBuddySubscription(order.id);
  const { mutate: upgradeSubscription, isLoading: isLoadingUpgrade } =
    useUpgradeSubscription(order.id);
  const [currentTab, setCurrentTab] = React.useState<TabTypes>("newSubscriptionForm");
  const [selectedForm, setSelectedForm] = React.useState(newInitData[0].id);
  const [activePaymentMethod, setActivePaymentMethod] =
    React.useState<PaymentType>("none");

  const [newSubState, dispatchNewSub] = React.useReducer(reducer, newInitData);
  const [upgradeSubState, dispatchUpgradeSub] = React.useReducer(
    reducer,
    upgradeInitData
  );
  const [renewSubState, dispatchRenewSub] = React.useReducer(reducer, reNewInitData);
  const [cardState, cardDispatch] = React.useReducer(creditCardReducer, initialCardState);

  const selectedFormDetails = [...newSubState, ...renewSubState, ...upgradeSubState].find(
    form => form.id === selectedForm
  );

  const paymentModal = useModal({
    onSave: () => null
  });

  const handeChangeSelectedForm = (formid: string) => {
    setSelectedForm(formid);
  };

  const handleChangeTab = (event: React.ChangeEvent<unknown>, value: TabTypes) => {
    setCurrentTab(value);
    if (value === "newSubscriptionForm") {
      setSelectedForm(newInitData[0].id);
    }
    if (value === "upgradeSubscriptionForm") {
      setSelectedForm(upgradeInitData[0].id);
    }
    if (value === "reNewSubscriptionForm") {
      setSelectedForm(reNewInitData[0].id);
    }
  };

  function disableSaveBtn() {
    const notAllFieldsFilled = !selectedFormDetails?.fields.reduce((final, field) => {
      return final && !!field.value;
    }, true);

    if (currentTab === "reNewSubscriptionForm") {
      const stickyId = selectedFormDetails?.fields
        .find(field => field.name === "sticky_order_id")
        ?.value?.toString();
      const confirmStickyId = selectedFormDetails?.fields
        .find(field => field.name === "confirm_sticky_order_id")
        ?.value?.toString();
      return (
        !stickyId ||
        !confirmStickyId ||
        stickyId !== confirmStickyId ||
        notAllFieldsFilled
      );
    }
    return notAllFieldsFilled;
  }

  return (
    <>
      <ModalPopup
        {...props}
        maxWidth="md"
        modalTitle="Add GovBuddy Subsciption"
        saveBtnText={
          currentTab === "newSubscriptionForm" ? "Add Payment Mehtod" : "Confirm"
        }
        disableSaveBtn={disableSaveBtn()}
        saveBtnLoading={isLoading || isLoadingExtend || isLoadingUpgrade}
        handleSaveChanges={() => {
          if (currentTab === "newSubscriptionForm") paymentModal.handleModalOpen();
          if (currentTab === "reNewSubscriptionForm") {
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            extendSubscription({
              order_id: order.id,
              sticky_order_id:
                selectedFormDetails?.fields
                  .find(field => field.name === "sticky_order_id")
                  ?.value?.toString() || "",
              extension_date: isoToMarshmallow(oneYearFromNow)
            });
          }
          if (currentTab === "upgradeSubscriptionForm") {
            upgradeSubscription({
              subscription: selectedFormDetails?.title || "",
              sticky_order_id:
                selectedFormDetails?.fields
                  .find(field => field.name === "sticky_order_id")
                  ?.value?.toString() || "",
              order_id: order.id,
              subscriber_count: Number(
                selectedFormDetails?.fields.find(field => field.name === "seats")?.value
              ),
              is_auto_renew: !!selectedFormDetails?.fields.find(
                field => field.name === "is_auto_renew"
              )?.value,
              yearly_cost: Number(
                selectedFormDetails?.fields.find(field => field.name === "yearly_cost")
                  ?.value
              ),
              product_id: ""
            });
          }
        }}
      >
        <Tabs
          style={{ marginBottom: "10px" }}
          value={currentTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeTab}
          aria-label="disabled tabs example"
        >
          <Tab value="newSubscriptionForm" label="New Subscription" />
          <Tab
            value="reNewSubscriptionForm"
            label="Extend Subscription"
            disabled={!(order.products && order.products?.length <= 0)}
          />
          <Tab
            value="upgradeSubscriptionForm"
            label="Upgrade Subscription"
            disabled={!(order.products && order.products?.length <= 0)}
          />
        </Tabs>
        {currentTab === "newSubscriptionForm" ? (
          <Grid container spacing={2}>
            {newSubState.map(form => (
              <Grid item xs={12} lg={4} key={form.id}>
                <SubscriptionForm
                  active={selectedForm === form.id}
                  form={form}
                  order={props.order}
                  dispatch={dispatchNewSub}
                  handeChangeSelectedForm={handeChangeSelectedForm}
                />
              </Grid>
            ))}
          </Grid>
        ) : currentTab === "upgradeSubscriptionForm" ? (
          <Grid container spacing={2} justifyContent="center">
            {upgradeSubState.map(form => (
              <Grid item xs={12} lg={4} key={form.id}>
                <SubscriptionForm
                  active={selectedForm === form.id}
                  form={form}
                  order={props.order}
                  dispatch={dispatchUpgradeSub}
                  handeChangeSelectedForm={handeChangeSelectedForm}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {renewSubState.map(form => (
              <ReNewSubscription key={form.id} form={form} dispatch={dispatchRenewSub} />
            ))}
          </>
        )}
      </ModalPopup>
      <PaymentModal
        openModal={paymentModal.modalOpen}
        cardState={cardState}
        handleInputChange={(name: string, value: string) => {
          cardDispatch({ type: "HANDLE_INPUT_TEXT", field: name, payload: value });
        }}
        activePaymentMethod={activePaymentMethod}
        handleChangePaymentMethod={method => {
          setActivePaymentMethod(method);
        }}
        handleSaveChanges={() => {
          const oneYearFromNow = new Date();
          oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
          if (
            selectedFormDetails?.fields.find(field => field.name === "email")?.value &&
            currentTab === "newSubscriptionForm"
          )
            createSubscription({
              subscription: selectedFormDetails?.title,
              firstName: order.billing_address.first_name,
              lastName: order.billing_address.last_name,
              currency: order.currency,
              billingFirstName: order.billing_address.first_name,
              billingLastName: order.billing_address.last_name,
              billingAddress1: order.billing_address.street1,
              billingCity: order.billing_address.city,
              billingState: order.billing_address.state,
              billingZip: order.billing_address.zip,
              billingCountry: order.billing_address.country,
              phone: order.billing_address.phone || order.shipping_address.phone || "",
              email:
                selectedFormDetails?.fields
                  .find(field => field.name === "email")
                  ?.value?.toString() || "",
              creditCardType: activePaymentMethod === "offline" ? "offline" : "visa",
              creditCardNumber: cardState.card_number,
              expirationDate: cardState.exp_date,
              CVV: cardState.csc,
              shippingAddress1: order.shipping_address.street1,
              shippingCity: order.shipping_address.city,
              shippingState: order.shipping_address.state,
              shippingZip: order.shipping_address.zip,
              shippingCountry: order.shipping_address.country,
              expiration_date: isoToMarshmallow(oneYearFromNow),
              subscriber_count: 1,
              is_auto_renew: !!selectedFormDetails?.fields.find(
                field => field.name === "is_auto_renew"
              ),
              product_id: "",
              brand_id: order.brand_id,
              order_id: order.id,
              company_id: order.company_id,
              user_id: order.company.billing_contact.user.id,
              created_from_advocacy: false,
              shipping_address_id: order.shipping_address.id,
              number_of_seats:
                selectedFormDetails?.title === "enterprise"
                  ? Number(
                      selectedFormDetails?.fields.find(field => field.name === "seats")
                        ?.value
                    )
                  : 1,
              customer_price:
                selectedFormDetails?.title === "enterprise"
                  ? Number(
                      selectedFormDetails?.fields.find(field => field.name === "price")
                        ?.value
                    )
                  : 0
            });

          paymentModal.handleSave();
          props.handleSaveChanges();
        }}
        handleCloseModal={() => {
          paymentModal.handleModalClose();
        }}
      />
    </>
  );
};

export default SubscriptionModal;
