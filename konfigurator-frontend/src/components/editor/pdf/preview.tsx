import { Box } from '@mui/material';
import { ReactP5Wrapper } from '@p5-wrapper/react';

import { sketch } from './sketch';

function PDFPreview() {
  return (
    <>
      <Box position="relative">
        <ReactP5Wrapper sketch={sketch} />
      </Box>
    </>
  );
}
export default PDFPreview;
