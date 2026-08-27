import * as React from "react";
import Tab, { TabOwnProps } from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Card, Tabs as CustomTabs, styled, CardOwnProps, useTheme } from "@mui/material";
import { BoxOwnProps } from "@mui/system";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface List extends TabOwnProps {
  title: string;
  comp: React.ReactElement;
  id?: string;
}
interface CustomTabsProps {
  list: List[];
  hasOwnPanel?: string[];
  noshadow?: boolean;
  border?: boolean;
  dense?: boolean;
  urlBase?: boolean;
}

const Tabs: React.FC<CustomTabsProps> = ({
  hasOwnPanel = [],
  list = [],
  noshadow = false,
  border = false,
  dense = false,
  urlBase = false
}) => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState(list?.[0]?.title?.toLowerCase());
  const component = React.useMemo(() => {
    const Comp = list?.find(
      el => el?.title?.toLowerCase() === activeTab?.toLowerCase()
    )?.comp;
    return Comp;
  }, [list, activeTab]);

  const handleNavigate = React.useCallback(
    (val: string) => {
      const basePath = tab
        ? decodeURIComponent(location.pathname?.toLowerCase())?.replace(
            `/${tab}`?.toLowerCase(),
            ""
          )
        : location.pathname?.toLowerCase();
      const newPath = `${basePath}/${val}`;
      navigate(newPath);
    },
    [navigate, location.pathname, tab]
  );

  React.useLayoutEffect(() => {
    if (urlBase) {
      if (!list?.some(el => el?.title?.toLowerCase() === String(tab)?.toLowerCase())) {
        handleNavigate(list?.[0]?.title?.toLowerCase());
      } else if (tab) {
        setActiveTab(tab?.toLowerCase());
      }
    }
  }, [urlBase, tab, setActiveTab, handleNavigate, list, location]);
  return (
    <Container bordered={border ? 1 : 0}>
      <StyledTabsHeader noshadow={noshadow ? 1 : 0} dense={dense ? 1 : 0}>
        <CustomTabs
          value={activeTab}
          onChange={(_e, val) =>
            urlBase ? handleNavigate(val) : setActiveTab(val?.toLowerCase())
          }
        >
          {list.map((tab, key) => (
            <Tab
              label={tab.title}
              value={tab.title?.toLowerCase()}
              key={key}
              id={tab.id}
              {...tab}
            />
          ))}
        </CustomTabs>
      </StyledTabsHeader>
      {component &&
        (hasOwnPanel?.map(itm => itm?.toLowerCase())?.includes(activeTab) ? (
          component
        ) : (
          <StyledTabsBody noshadow={noshadow ? 1 : 0} dense={dense ? 1 : 0}>
            {component}
          </StyledTabsBody>
        ))}
    </Container>
  );
};

interface TabsStyledProps extends CardOwnProps {
  noshadow: number;
  dense: number;
}
interface ContainerProps extends BoxOwnProps {
  bordered: number;
}
const Container = styled(Box)((props: ContainerProps) => {
  const {
    palette: { divider }
  } = useTheme();
  const { bordered } = props;

  return bordered
    ? {
        border: `1px solid ${divider}`,
        borderRadius: "8px"
      }
    : {};
});
const StyledTabsHeader = styled(Card)((props: TabsStyledProps) => {
  const { noshadow, dense } = props;
  return {
    boxShadow: noshadow ? "unset" : "0px 0px 29.3px 0px #0000001A",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    ".MuiButtonBase-root": {
      ...(dense
        ? {
            minHeight: "35px"
          }
        : {})
    },
    ...(dense
      ? {
          ".MuiTabs-scroller": {
            height: "fit-content"
          }
        }
      : {})
  };
});
const StyledTabsBody = styled(Card)((props: TabsStyledProps) => {
  const { noshadow, dense } = props;

  return {
    boxShadow: noshadow ? "unset" : "0px 21px 29.3px 0px #0000001A",
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0",
    ...(dense
      ? {
          ".MuiCardContent-root": {
            padding: "0"
          }
        }
      : {})
  };
});
interface StyledCardProps extends CardOwnProps {
  istrash: number;
}
export const StyledTabBody = styled(Card)<StyledCardProps>(({ istrash }) => ({
  ...(istrash && {
    boxShadow: "0px 21px 29.3px 0px #0000001A",
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0"
  })
}));
export default Tabs;
