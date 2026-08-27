import { FC } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, styled, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { FlexItems } from './index.style';

const StyledProfileAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  boxShadow: 'none',

  '& .Mui-expanded': {
    margin: 0,
    minHeight: '36px',
  },
  '& .MuiAccordionSummary-root': {
    border: '1px solid black',
    margin: '1rem',
    borderRadius: '8px',
    '.Mui-expanded': {
      margin: 0,
      minHeight: '36px !important',
    },
    // boxShadow:
    //   '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  },
  '& .MuiAccordionSummary-content': {
    margin: 0,
    '& .Mui-expanded': {
      margin: 0,
      minHeight: '36px',
    },
  },
}));
interface Props {
  children?: React.ReactNode;
}
const ProfileAccordion: FC<Props> = ({ children }: Props) => {
  return (
    <Box>
      <StyledProfileAccordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <FlexItems>
            <FlexItems gap={1}>
              <img src="/profiles/t1.png" width="42.9px" height="30px" alt="s" />
              <Typography color="black">Profile</Typography>
            </FlexItems>
            <Box></Box>
          </FlexItems>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </StyledProfileAccordion>
    </Box>
  );
};

export default ProfileAccordion;
