import * as React from "react";
import { useOrganizations } from "../Hooks/useOrgs";

interface IOrgContext {
  activeOrg: string;
  setActiveOrg(value: string): void;
}

export const OrgContext = React.createContext<IOrgContext>({
  activeOrg: "",
  setActiveOrg: value => {
    //
  }
});

export const OrgProvider: React.FC = ({ children }) => {
  const { data } = useOrganizations();
  const [activeOrg, setActive] = React.useState("");

  const defaultOrg =
    data?.results?.find(org => org?.is_default)?.id || data?.results[0].id;

  React.useEffect(() => {
    const storedOrg = localStorage.getItem("org");
    const isStoredOrgInBackend = Boolean(data?.results.find(o => o.id === storedOrg));
    if (storedOrg && isStoredOrgInBackend) {
      setActive(storedOrg);
    } else {
      setActiveOrg(defaultOrg || "");
    }
  }, [defaultOrg, data?.results]);

  const setActiveOrg = (org: string) => {
    setActive(org);
    localStorage.setItem("org", org);
  };

  return (
    <OrgContext.Provider value={{ activeOrg, setActiveOrg }}>
      {children}
    </OrgContext.Provider>
  );
};

export const useOrg = () => {
  return React.useContext(OrgContext);
};
