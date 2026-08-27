import Button from "@mui/material/Button";
import { useSearchParams } from "react-router-dom";
import {
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { orderParamsGeneralKeys } from "../../../Utils/queryParamKeys";
import { InputValueAndLabel } from "../../../Interfaces/global";
import PageTitle from "../../../Components/PageTitle";
import Input from "../../../Components/Input";
import { useWebsites } from "../../../Hooks/usePatients";
import SelectField from "../../../Components/SelectField";

import { Website } from "../../../Interfaces/Company";
import SeeDocumentation from "../../../Components/SeeDocumentation";

interface IProps {
  setSelectedSite: React.Dispatch<React.SetStateAction<Website | undefined>>;
  selectedSite: Website | undefined;
}
const PatientFilters: React.FC<IProps> = ({ setSelectedSite, selectedSite }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [show, setShow] = useState(true);
  const [key, setKey] = useState(0);
  const { data: websitesResponse, isLoading: websitesFetchLoading } = useWebsites();
  const websites = useMemo(() => {
    if (websitesResponse?.results?.length) {
      const { results = [] } = websitesResponse;
      const data = results?.map(el => {
        return {
          value: el.id,
          label: el?.title
        };
      });

      return data;
    }
    return [];
  }, [websitesResponse]);
  const handelOrderFilter = (event: InputValueAndLabel | null) => {
    if (event) {
      const { label, value } = event;
      if (value) {
        searchParams.set(label, value?.toString());
      } else {
        searchParams.delete(label);
      }
      setSearchParams(searchParams);
    }
  };
  const handleReset = () => {
    orderParamsGeneralKeys.forEach(el => {
      searchParams.delete(el);
    });
    setSearchParams(searchParams);
    setKey(key + 1);
  };
  const handleToggleFilters = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (!searchParams.get("website_id") && websites?.length) {
      searchParams.set("website_id", websites?.[0]?.value);
      setSearchParams(searchParams);
    }
  }, [websites, searchParams, setSearchParams]);

  useEffect(() => {
    if (
      searchParams.get("website_id") &&
      websitesResponse?.results?.length &&
      selectedSite?.id !== searchParams.get("website_id")
    ) {
      const websiteFound = websitesResponse?.results.find(
        item => item.id === searchParams.get("website_id")
      );
      setSelectedSite(websiteFound ? websiteFound : undefined);
    }
  }, [selectedSite, searchParams, websitesResponse, setSelectedSite]);
  return (
    <>
      <PageTitle icon="/assets/icons/patientIcon.svg" title="Patients" />

      <Card>
        <CardHeader
          title={"Search"}
          titleTypographyProps={{
            fontSize: 20,
            fontWeight: "bold"
          }}
          action={
            <ButtonGroup color="info" variant="contained" size="small">
              <Button onClick={handleToggleFilters}>{show ? "Hide" : "Show"}</Button>
              <Button onClick={handleReset} disabled={!show}>
                Reset
              </Button>
            </ButtonGroup>
          }
        />
        <Collapse in={show} timeout="auto" unmountOnExit>
          <Divider />
          <CardContent key={key}>
            <Grid container spacing={2}>
              <Grid item md={4} sm={6} xs={12}>
                <SelectField
                  id="cy__WebsiteSelect"
                  handleSelect={(opt, name) => {
                    handelOrderFilter({
                      label: name,
                      value: opt?.value === "all" ? "" : opt.value
                    });
                  }}
                  loading={websitesFetchLoading}
                  label="Website :"
                  name="website_id"
                  options={websites}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  id="cy__PatientName"
                  handleChange={handelOrderFilter}
                  label="Patient name :"
                  name="name"
                />
              </Grid>
            </Grid>
            <SeeDocumentation
              title="Patient Listing API Documentation"
              fileName={"usePatients"}
            />
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};

export default PatientFilters;
