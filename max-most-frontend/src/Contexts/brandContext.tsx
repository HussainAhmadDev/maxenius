/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useLayoutEffect,
  useMemo
} from "react";
import { BrandList } from "../Interfaces/brandType";
import { useUserBrand } from "../Hooks/useBrand";
import { useUser } from "./userContext";

const localStorageKey = "brandDetail";

const BrandContext = createContext<
  | {
      brand: BrandList | null;
      updateBrand: (brand: BrandList) => void;
      brands?: BrandList[];
      brandLoading: boolean;
      refreshBrands(): void;
    }
  | undefined
>(undefined);

export const useBrandContext = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
};

export const BrandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, accessToken } = useUser();
  const { data: brandsData, isLoading, mutateAsync } = useUserBrand();

  const [brand, setBrand] = useState<BrandList | null>(() => {
    const storedBrand = localStorage.getItem(localStorageKey);
    return storedBrand ? JSON.parse(storedBrand) : null;
  });
  const fetchBrands = () => {
    if (user?.id && accessToken) {
      mutateAsync({ userId: user?.id });
    }
  };
  const id = useMemo(() => {
    return user?.id;
  }, [user?.id]);

  const updateBrand = (brandDetail: BrandList) => {
    localStorage.setItem(localStorageKey, JSON.stringify(brandDetail));
    setBrand(brandDetail);
  };

  useLayoutEffect(() => {
    fetchBrands();
    //eslint-disable-next-line
  }, [id]);
  useLayoutEffect(() => {
    if (brandsData?.length) {
      if (!brand) {
        updateBrand(brandsData?.[0]);
      } else if (brand) {
        const tempBrand = brandsData?.find(el => el?.id === brand?.id);
        if (tempBrand) {
          updateBrand(tempBrand);
        }
      }
    }
    //eslint-disable-next-line
  }, [brandsData]);

  return (
    <BrandContext.Provider
      value={{
        brand,
        updateBrand,
        brandLoading: isLoading,
        brands: brandsData,
        refreshBrands: fetchBrands
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};
