import * as React from "react";
import { useBrandByUserId } from "Hooks/useBrands";
import { useLocation, useSearchParams } from "react-router-dom";
import { mainNavigationPaths } from "Constants";
import { BrandsData } from "Interfaces/Brands";

interface IBrandContext {
  brandDetail: BrandsData | undefined;
  setBrandDetail: (brand: BrandsData) => void;

  activeBrand: string;
  setActiveBrand(value: string): void;
  currency: string;
  setCurrency: (currency: string) => void;
  currencySymbol: string;
  setCurrenSymbol: (currencySymbol: string) => void;
}
/* eslint-disable */
export const BrandContext = React.createContext<IBrandContext>({
  brandDetail: undefined,
  setBrandDetail: value => {},
  activeBrand: "",
  setActiveBrand: value => {},
  currency: "",
  setCurrency: (currency: string) => {},
  currencySymbol: "",
  setCurrenSymbol: (currencySymbol: string) => {}
});
/* eslint-enable */
export const BrandProvider: React.FC = ({ children }) => {
  // first fetch all the brands
  const { data } = useBrandByUserId();
  const { pathname } = useLocation();
  const shouldChangeBrandInUrl = mainNavigationPaths.includes(pathname);
  const [searchParams, setSearchSearchParams] = useSearchParams();
  // This state will store the currently active brand.
  const [activeBrand, setActive] = React.useState("");
  // const [brandSetting, setBrandSetting] = React.useState<BrandsData | null>(null);

  const [brandDetailState, setBrandDetail] = React.useState<BrandsData | undefined>(
    () => {
      const storedBrandDetail = localStorage.getItem("brandDetail");
      return storedBrandDetail ? JSON.parse(storedBrandDetail) : undefined;
    }
  );

  const [currency, setCurrency] = React.useState("");
  const [currencySymbol, setCurrenSymbol] = React.useState("");

  const brandFromURL = searchParams.get("brand_id");
  const brandFromStorage = localStorage.getItem("brand");
  // 😱⁉️🤯🤬
  const defaultBrand =
    data?.find(brand => brand.id === (brandFromStorage || brandFromURL))?.id ||
    data?.[0]?.id ||
    "";

  const defaultCurrency = data?.find(item => item.id === defaultBrand && item);

  React.useEffect(() => {
    if (defaultCurrency) {
      setBrandDetail(defaultCurrency);
    }
    if (defaultCurrency?.currency && defaultCurrency?.currency_symbol) {
      setCurrency(defaultCurrency?.currency);
      setCurrenSymbol(defaultCurrency?.currency_symbol);
    } else {
      setCurrency("GBP");
      setCurrenSymbol(`£`);
    }
  }, [data, defaultCurrency]);

  const setBrandDetailAndUpdateLocalStorage = React.useCallback(
    (brand: BrandsData) => {
      setBrandDetail(brand);
      localStorage.setItem("brandDetail", JSON.stringify(brand));
    },
    [setBrandDetail]
  );
  React.useEffect(() => {
    brandDetailState && setBrandDetailAndUpdateLocalStorage(brandDetailState);
  }, [setBrandDetailAndUpdateLocalStorage, brandDetailState]);

  const setActiveBrand = React.useCallback(
    (brandId: string) => {
      setActive(brandId);
      localStorage.setItem("brand", brandId);
      if (shouldChangeBrandInUrl && brandId) {
        const params = new URLSearchParams(searchParams);
        params.set("brand_id", brandId);
        setSearchSearchParams(params);
      }
    },
    [searchParams, setSearchSearchParams, shouldChangeBrandInUrl]
  );

  React.useEffect(() => {
    if (defaultBrand) {
      setActiveBrand(defaultBrand);
    }
  }, [defaultBrand, setActiveBrand]);

  return (
    <BrandContext.Provider
      value={{
        brandDetail: brandDetailState,
        setBrandDetail,
        activeBrand,
        setActiveBrand,
        currency,
        setCurrency,
        currencySymbol,
        setCurrenSymbol
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};
/* eslint-disable-next-line */
export const useBrand = () => {
  return React.useContext(BrandContext);
};
