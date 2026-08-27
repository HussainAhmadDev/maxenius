import * as React from "react";
import { OrderData } from "Interfaces/Order";
import { ProductData } from "Interfaces/Products";

interface IOrderContext {
  readonly currentOrder: OrderData;
  readonly isEditableRow: Partial<ProductData> | null;
  readonly selectedProducts: ProductData[];
  readonly setCurrentOrder: React.Dispatch<React.SetStateAction<OrderData>>;
  readonly setIsEditableRow: React.Dispatch<
    React.SetStateAction<Partial<ProductData> | null>
  >;
  readonly handleAddProducts: (products: ProductData[]) => void;
  readonly handleDeleteLineItems: (index: number) => void;
  readonly handleDoneEditing: (product: ProductData) => void;
  readonly handleEditLineItem: (
    index: number,
    fieldName: keyof ProductData,
    value: string
  ) => void;
}

export const OrderContext = React.createContext<IOrderContext>({} as IOrderContext);

const initialState: Partial<ProductData> = {
  name: "",
  description: "",
  is_tax_exempt: false,
  tax_class: null,
  tax_status: null,
  number: 0,
  retail_price: 0,
  shipping_rate: 0,
  shipping_date: "",
  is_downloadable: false,
  is_saas: false,
  seo_slug: "",
  sku: "",
  quantity: 1
};

export const OrderProvider: React.FC = ({ children }) => {
  const [currentOrder, setCurrentOrder] = React.useState<OrderData>({} as OrderData);
  const [isEditableRow, setIsEditableRow] = React.useState<Partial<ProductData> | null>(
    initialState
  );
  const [selectedProducts, setSelectedProducts] = React.useState<ProductData[]>([]);

  const handleAddProducts = (data: ProductData[]) => {
    const lineItems: ProductData[] = [];
    data?.forEach(item => {
      const check = selectedProducts.find(i => i.sku === item.sku);
      if (!check) {
        lineItems.push({ ...item, quantity: 1 });
      }
    });
    setSelectedProducts([...selectedProducts, ...lineItems]);
  };

  const handleDeleteLineItems = (index: number) => {
    setSelectedProducts(
      selectedProducts.filter((item, i) => {
        return i !== index;
      })
    );
  };

  const handleDoneEditing = (data: ProductData) => {
    setSelectedProducts(
      selectedProducts.map(item => {
        if (item.sku === data.sku) {
          item = data;
        }
        return item;
      })
    );
    setIsEditableRow(null);
  };

  const handleEditLineItem = (
    index: number,
    fieldName: keyof ProductData,
    value: string
  ) => {
    const lineItems: ProductData[] = [...selectedProducts];
    lineItems[index] = {
      ...lineItems[index],
      [fieldName]: value
    };
    setSelectedProducts([...lineItems]);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        isEditableRow,
        selectedProducts,
        setCurrentOrder,
        setIsEditableRow,
        handleAddProducts,
        handleDoneEditing,
        handleEditLineItem,
        handleDeleteLineItems
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
