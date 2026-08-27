import { useEffect } from 'react';
import { Box } from '@mui/material';

import PDFForm from '@/components/editor/pdf/Form';
import { getProjectDetailsById } from '@/services/projects';
import { useEditorStore } from '@/store/EditorStore';

const EditorPDF = () => {
  const { projectData } = useEditorStore();

  useEffect(() => {
    if (!projectData?.id) {
      return;
    }
    getProjectDetailsById(projectData?.id.toString() as string).then((res) =>
      useEditorStore.setState({ projectDetails: res }),
    );
  }, [projectData?.id]);

  return (
    <Box sx={{ backgroundColor: 'white', height: '100%' }}>
      <PDFForm />
    </Box>
  );
};

export default EditorPDF;
