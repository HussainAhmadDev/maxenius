import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRevalidator } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

import DialogBox from '@/components/dialog';
import { languageData } from '@/constants';
import { rpcs } from '@/services/customFunctions';
import { supabaseClient } from '@/services/supabaseService';
import { useAuthStore } from '@/store/AuthStore';

import Four from './stepper/Four';
import One from './stepper/One';
import Three from './stepper/Three';
import Two from './stepper/Two';

interface DialogBoxProps {
  open: boolean;
  onClose: () => void;
}

const ProjectForm: React.FC<DialogBoxProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const { session, userRole } = useAuthStore();
  const revalidator = useRevalidator();
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  //----------------------Customer Data form 1 --------------------------
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    firstName: 'John',
    lastName: 'Doe',
    address1: '',
    address2: '',
    country: 'Germany',
    zipCode: '56323',
    email: '',
    phone: '414 141 4143',
  });

  const handleChange = (event: SelectChangeEvent<string>): void => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNext();
  };

  //----------------------Assembler Data form 2 --------------------------
  const [formDataTwo, setFormDataTwo] = useState({
    company: '',
    firstName: 'John',
    lastName: 'Doe',
    address1: '',
    address2: '',
    country: 'Germany',
    zipCode: '56323',
    email: '',
    phone: '414 141 4144',
  });

  const handleChangeTwo = (event: SelectChangeEvent<string>): void => {
    const { name, value } = event.target;
    setFormDataTwo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitTwo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNext();
  };

  //--------------------End Assembler Data form 2---------------------------

  //----------------------Project Data form 3 --------------------------
  const [formDataThree, setFormDataThree] = useState({
    profile_type: 0,
    specialColor: 1,
    def_col: 'rgb(128,128,128)',
    wallThickness: 50,
    outer_W: 50,
    inner_W: 25,
    aMass: 200,
    cMass: 100,
    upLength: 250,
    slope: 3,
    material_thickness: 2,
    halter: 1000,
  });
  const handleChangeThree = (event: SelectChangeEvent<string>): void => {
    const { name, value } = event.target;
    setFormDataThree((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitThree = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNext();
  };

  //---------------------Misc data form 4 --------------------
  const [fClr, setFClr] = useState<boolean>(true);
  const [bClr, setBClr] = useState<boolean>(true);
  const [files, setFiles] = useState<File[]>([]);
  const [sizeKB, setSizeKB] = useState<string[]>([]);

  const [sizeMB, setSizeMB] = useState<string[]>([]);
  const [text, setText] = useState<string>('');

  const handleSubmitFour = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { error } = await supabaseClient.rpc(rpcs.project_creation, {
        project_name: formData.name,
        customer_data: { ...formData, zipCode: Number(formData.zipCode) },
        assembler_data: { ...formDataTwo },
        project_attributes: formDataThree,
        misc_note: text,
        user_id: session?.user.id,
        role: userRole,
      });
      if (error) {
        return toast.error(error.message);
      }
      revalidator.revalidate();
      setBClr(true);
      setFClr(true);
      handleClose();
      setActiveStep(0);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        toast.error(languageData.toastMessage.error.common);
      }
    }
  };

  //---------------------end four ----------------------
  const handleClose = () => onClose();

  const { steps, actions } = languageData.form;
  return (
    <div>
      <DialogBox open={open} onClose={onClose}>
        <Box
          sx={{
            width: '100%',
            px: 5,
            pt: 3.5,
            pb: 1,
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '-ms-overflow-style': 'none',
            scrollbarWidth: 'none',
            height: '100%',
          }}
        >
          <Stepper
            activeStep={activeStep}
            sx={{
              pl: { md: 15, sm: 1, xs: 0 },
              pr: { md: 15, sm: 1, xs: 0 },
              mb: 2,
              gap: 1,
              display: 'flex',
              flexWrap: { xs: 'wrap', sm: 'wrap', md: 'nowrap' },
              alignItems: { xs: 'flex-start', sm: 'flex-start', md: 'center' },
              justifyContent: { xs: 'flex-start', sm: 'center', md: 'center' },
              flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            }}
          >
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};

              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>{languageData.form.actions.reset}</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <form
                onSubmit={
                  activeStep === 0
                    ? handleSubmit
                    : activeStep === 1
                      ? handleSubmitTwo
                      : activeStep === 2
                        ? handleSubmitThree
                        : handleSubmitFour
                }
              >
                {activeStep === 0 ? (
                  <One
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                  />
                ) : activeStep === 1 ? (
                  <Two
                    formDataTwo={formDataTwo}
                    handleChangeTwo={handleChangeTwo}
                    handleSubmitTwo={handleSubmitTwo}
                  />
                ) : activeStep === 2 ? (
                  <Three
                    formDataThree={formDataThree}
                    handleChangeThree={handleChangeThree}
                    handleSubmitThree={handleSubmitThree}
                  />
                ) : (
                  <Four
                    files={files}
                    setFiles={setFiles}
                    sizeKB={sizeKB}
                    setSizeKB={setSizeKB}
                    sizeMB={sizeMB}
                    setSizeMB={setSizeMB}
                    text={text}
                    setText={setText}
                    bClr={bClr}
                    fClr={fClr}
                    setFClr={setFClr}
                    setBClr={setBClr}
                  />
                )}

                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  {activeStep === 1 && (
                    <Button
                      color="inherit"
                      onClick={() =>
                        setActiveStep((prevActiveStep) => prevActiveStep - 1)
                      }
                      sx={{ mr: 1 }}
                    >
                      {actions.back}
                    </Button>
                  )}
                  {isStepOptional(activeStep) && (
                    <Button type="submit">
                      {activeStep === steps.length - 1 ? actions.create : actions.next}
                    </Button>
                  )}
                  {activeStep !== 0 && activeStep !== 1 && (
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={() =>
                        setActiveStep((prevActiveStep) => prevActiveStep - 1)
                      }
                      sx={{ mr: 1 }}
                    >
                      {actions.back}
                    </Button>
                  )}
                  {activeStep === 0 && (
                    <Button color="inherit" onClick={handleClose} sx={{ mr: 1 }}>
                      {actions.cancel}
                    </Button>
                  )}

                  {activeStep !== 1 && (
                    <Button type="submit">
                      {activeStep === steps.length - 1 ? actions.create : actions.next}
                    </Button>
                  )}
                </Box>
              </form>
            </React.Fragment>
          )}
        </Box>
      </DialogBox>
    </div>
  );
};

export default ProjectForm;
