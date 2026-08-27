import React from 'react';
import { Grid, Link } from '@mui/material';

import { languageData } from '@/constants';

import { StyledTypography } from './style';

const Footer: React.FC = () => {
  const {
    editor: {
      pdf: {
        form: {
          footer: { contact },
        },
      },
    },
  } = languageData;
  return (
    <footer>
      <Grid container spacing={2} my="1rem">
        <Grid item xs={12} md={2.5} sm={4}>
          <StyledTypography variant="h6">{contact.pohlDWSGmbH}</StyledTypography>
          <StyledTypography>
            {contact.nickePutz} {contact.code} {contact.duren}
            {contact.germany}
          </StyledTypography>
        </Grid>
        <Grid item xs={12} md={2.5} sm={4}>
          <StyledTypography>
            Tel{' '}
            <Link href={`tel:${contact.tel2?.replace(/[\s-]/g, '')}`}>
              {contact.tel2}
            </Link>
          </StyledTypography>
          <StyledTypography>
            Fax{' '}
            <Link href={`tel:${contact.fax2?.replace(/[\s-]/g, '')}`}>
              {contact.fax2}
            </Link>
          </StyledTypography>
          <StyledTypography>
            <Link href={`mailto:${contact.mail}"`}>{contact.mail}</Link>
          </StyledTypography>
          <StyledTypography>
            <Link href={`https://${contact.site}`} target="_blank">
              {contact.site}
            </Link>
          </StyledTypography>
        </Grid>
        <Grid item xs={12} md={2} sm={4}>
          <StyledTypography>{contact.managingDirector} :</StyledTypography>
          <StyledTypography>Heinrich Robert Pohl</StyledTypography>
          <StyledTypography>Andreas Palli</StyledTypography>
          <StyledTypography>Karsten Puck</StyledTypography>
        </Grid>
        <Grid item xs={12} md={2.5} sm={4}>
          <StyledTypography>HRB Düren 7929</StyledTypography>
          <StyledTypography>USt.ID.-Nr. DE297065385</StyledTypography>
          <StyledTypography>St.-Nr. 207/5731/0892</StyledTypography>
        </Grid>
        <Grid item xs={12} md={2.5} sm={4}>
          <StyledTypography>{contact.bankDetails} :</StyledTypography>
          <StyledTypography>Sparkasse Köln/Bonn</StyledTypography>
          <StyledTypography>BIC: COLDE33</StyledTypography>
          <StyledTypography>IBAN: DE10370501980158642959</StyledTypography>
        </Grid>
      </Grid>
    </footer>
  );
};

export default Footer;
