import React from "react";

type PatientContextValue = {
  site_url: string;
  authorization_key: string;
  setSiteUrl: (url: string) => void;
  setAuthorizationKey: (key: string) => void;
};

const PatientContext = React.createContext<PatientContextValue | undefined>(undefined);

export const PatientProvider: React.FC = ({ children }) => {
  const initialState = {
    site_url: localStorage.getItem("site_url") || "",
    authorization_key: localStorage.getItem("authorization_key") || ""
  };

  const [state, setState] = React.useState(initialState);

  const setSiteUrl = (url: string) => {
    setState(prevState => ({ ...prevState, site_url: url }));
    localStorage.setItem("site_url", url);
  };

  const setAuthorizationKey = (key: string) => {
    setState(prevState => ({ ...prevState, authorization_key: key }));
    localStorage.setItem("authorization_key", key); // Save authorization_key to localStorage
  };

  // Create the context value object
  const contextValue: PatientContextValue = {
    site_url: state.site_url,
    authorization_key: state.authorization_key,
    setSiteUrl,
    setAuthorizationKey
  };

  // Return the provider component with the context value
  return (
    <PatientContext.Provider value={contextValue}>{children}</PatientContext.Provider>
  );
};

export const usePatientContext = (): PatientContextValue => {
  const context = React.useContext(PatientContext);
  if (!context) {
    throw new Error("usePatientContext must be used within a PatientProvider");
  }
  return context;
};
