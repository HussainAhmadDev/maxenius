import React, { createContext, useContext, useState, ReactNode } from "react";
import { OrderData } from "../../../Interfaces/Orders";

interface DetailContextType {
  isShowDetailItem: boolean;
  setIsShowDetailItem: React.Dispatch<React.SetStateAction<boolean>>;
  detailCard: OrderData | null;
  setDetailCard: React.Dispatch<React.SetStateAction<OrderData | null>>;
  onClickDetail: (order: OrderData | null) => void;
}

const initialDetailCard: OrderData | null = null;

const initialContext: DetailContextType = {
  isShowDetailItem: false,
  setIsShowDetailItem: () => {},
  detailCard: initialDetailCard,
  setDetailCard: () => {},
  onClickDetail: () => {}
};

export const DetailContext = createContext<DetailContextType>(initialContext);

interface DetailProviderProps {
  children: ReactNode;
}

export const DetailProvider: React.FC<DetailProviderProps> = ({ children }) => {
  const [isShowDetailItem, setIsShowDetailItem] = useState(false);
  const [detailCard, setDetailCard] = useState<OrderData | null>(initialDetailCard);
  const onClickDetail = (order: OrderData | null) => {
    setDetailCard(order);
    setIsShowDetailItem(true);
  };

  return (
    <DetailContext.Provider
      value={{
        isShowDetailItem,
        setIsShowDetailItem,
        detailCard,
        setDetailCard,
        onClickDetail
      }}
    >
      {children}
    </DetailContext.Provider>
  );
};

export const useDetail = () => useContext(DetailContext);
