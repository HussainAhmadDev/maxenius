import React, { createContext, useContext, useState, ReactNode } from "react";

interface LabelContextType {
  isClickLabel: boolean;
  setIsClickLabel: React.Dispatch<React.SetStateAction<boolean>>;
  onClickLabel: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const initialContext: LabelContextType = {
  isClickLabel: false,
  setIsClickLabel: () => {},
  onClickLabel: () => {}
};

export const LabelContext = createContext<LabelContextType>(initialContext);

interface LabelProviderProps {
  children: ReactNode;
}

export const LabelProvider: React.FC<LabelProviderProps> = ({ children }) => {
  const [isClickLabel, setIsClickLabel] = useState(false);

  const onClickLabel = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsClickLabel(prevState => !prevState);
  };

  return (
    <LabelContext.Provider value={{ isClickLabel, setIsClickLabel, onClickLabel }}>
      {children}
    </LabelContext.Provider>
  );
};

export const useLabel = () => useContext(LabelContext);
