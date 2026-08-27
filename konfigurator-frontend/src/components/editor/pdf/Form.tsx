import { useCallback, useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';
import { Backdrop, Box, Button, CircularProgress, Stack } from '@mui/material';

import { languageData } from '@/constants';
import { SupabaseTableNames } from '@/services/queries';
import { supabaseClient } from '@/services/supabaseService';
import { useEditorStore } from '@/store/EditorStore';
import { csvHeaders, generateCSVData } from '@/utils/csv';

import {
  getABW,
  getAEIEStuck,
  getDefaultMasses,
  getGefalle,
  getLFM,
  getStck,
  getStuckDavon,
  getUberstand,
} from './utils/profilesData';
import generatePDF from './generatePDF';
import Profile from './profile';
import Progress from './progress';
import { PDFHeader } from '.';

type LoadingType = 'save' | 'generatePdf' | 'csv' | 'regeneratePDF' | 'fetching profiles';
const PDFForm = () => {
  const { floorPlan, projectData, canvasInstance, pdfForm, projectDetails } =
    useEditorStore();
  const { id: projectId } = useParams();
  const [loadingType, setLoadingType] = useState<LoadingType | null>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [exportCSVData, setExportCSVData] = useState([]);
  const [params, setParams] = useSearchParams();
  const pdfRef = useRef<HTMLButtonElement>(null);
  const methods = useForm({
    values: {
      ...pdfForm,
    },
  });
  const { handleSubmit, getValues } = methods;

  const { fields, replace } = useFieldArray({
    name: 'profiles',
    control: methods.control,
  });
  const generatePDFHandler = async () => {
    try {
      const values = { ...pdfForm, ...getValues() } as any;
      setLoadingType('generatePdf');
      await generatePDF(values);
      if (params.get('generate_pdf')) {
        params.delete('generate_pdf');
        setParams(params);
      }
      setLoadingType(null);
    } catch (error) {
      setLoadingType(null);
      return;
    }
  };
  const fetchProfiles = useCallback(async () => {
    if (!projectData || !projectData?.file || !canvasInstance || !floorPlan) {
      return;
    }

    const fileData = projectData?.file;
    const profiles = [];
    const pdf = await projectData.file.pdf[projectData.file.pdf.length - 1];

    if (pdf.formData) {
      return;
    }
    for (let i = 0; i < pdf.pdf_data.length; i++) {
      const pdf_data = pdf.pdf_data[i];

      let end_c = 0;
      let str_c = 0;
      let ang_c = 0;
      let Tpr_c = 0;
      let oth_c = 0;
      let _d: any[] = [];
      const profile: any = {
        materialstärke: parseFloat(fileData?.default?.al?.toString())
          .toPrecision(2)
          .replace('.', ','),
        gefalle1: fileData.default.st?.toString().replace('.', ',') + '°',
        formteil: 'Profile ' + fileData.default.pt,
        halterabst: fileData.default.ha,
        gefalle: '',

        a_mass_angle: '90°',
        b_mass_angle: 90 - fileData.default.st + '°',
        c_mass_angle: '90°',
        a_mass_overhang: '0 mm',
        c_mass_overhang: '0 mm',
      };

      profile.lfm = getLFM(pdf_data, canvasInstance);
      const { ai_ie, ai_ie1, ak, ge_te, ge_te1, ek } = getStck(pdf_data);
      profile.ai_ie = ai_ie;
      profile.ai_ie1 = ai_ie1;
      profile.ak = ak;
      profile.ge_te = ge_te;
      profile.ge_te1 = ge_te1;
      profile.ek = ek;

      getStuckDavon(pdf_data, fileData, profile);
      const { ae_stuck, ie_stuck } = getAEIEStuck(pdf_data);
      profile.ae_stuck = ae_stuck;
      profile.ie_stuck = ie_stuck;

      for (let j = 0; j < pdf_data.length; j++) {
        const pr = pdf_data[j];

        const maxID = 0;

        let type_id;
        let type_c;
        let type_profileType;
        let type_angle = '0';
        let type_length;

        switch (pr.p?.type) {
          case 'End':
            end_c++;
            type_id = 3;
            type_c = end_c;
            if (pr.p?.up) {
              type_profileType = 'ak';
            } else {
              type_profileType = 'ek';
            }
            type_angle = '0';
            type_length =
              Math.round(pr.p.length * 1000) + ` (Höhe: ${pr.p.upLength * 1000})`;
            break;
          case 'Straight':
            str_c++;
            type_id = 1;
            type_c = str_c;
            type_profileType = 'l';
            type_angle = '0';
            type_length = Math.round(pr.p.length * 1000);
            break;
          case 'Angled':
            ang_c++;
            type_id = 2;
            type_c = ang_c;
            if (pr.p.angle > Math.PI) {
              type_profileType = 'ie';
            } else {
              type_profileType = 'ae';
            }
            type_angle = Math.round(((pr.p.angle * 180) / Math.PI) * 1e2) / 1e2 + '°';
            type_length =
              Math.round(pr.p.realLeftLength * 1000) +
              '/' +
              Math.round(pr.p.realRightLength * 1000);

            break;
          case 'T-shape':
            Tpr_c++;
            type_id = 4;
            type_c = Tpr_c;
            type_profileType = 'gete';
            type_angle = `${Math.round(((pr.p.xyAngle * 180) / Math.PI) * 1e2) / 1e2}°/${Math.round(((pr.p.yzAngle * 180) / Math.PI) * 1e2) / 1e2}°`;
            type_length =
              Math.round(pr.p.realXLength * 1000) +
              '/' +
              Math.round(pr.p.realYLength * 1000) +
              '/' +
              Math.round(pr.p.realZLength * 1000);
            break;
          default:
            oth_c++;
            type_id = 5;
            type_c = oth_c;
            type_profileType = '';
            type_angle = '0';
            type_length = await pr.p.lengths
              ?.map((x: number) => Math.round(x * 1000 * 1e2) / 1e2)
              .reduce((a: string, b: string) => a + '/' + b);
            break;
        }

        const pieceData = {
          profile: pr.p,
          profileId: pr.p.id,
          id: 100 * (i + 1) + 10 * type_id + type_c,
          pos: `${i + 1}.${type_id}.${type_c}`,
          amount: pr.am,
          bezeichung: type_profileType,
          angle: type_angle == '0' ? '' : type_angle,
          length: type_length,
          ending: type_profileType,
        };

        _d = _d.sort((a, b) => {
          return parseInt(a.id.toString()) - parseInt(b.id.toString());
        });
        _d.push(pieceData);

        profile.gefalle = getGefalle(pr.p, fileData);
        profile.uberstand = getUberstand(pr.p, fileData);
        profile.abw = getABW(pr.p, fileData);
        const { a_mass, b_mass, c_mass } = getDefaultMasses(pr.p, fileData, maxID);
        profile.a_mass = a_mass;
        profile.b_mass = b_mass;
        profile.c_mass = c_mass;
      }
      profiles.push({
        ...profile,
        pieces_data: _d,
        name: projectData.name,
      });
    }

    replace(profiles);
    if (params.get('generate_pdf')) {
      setTimeout(async () => {
        if (pdfRef.current) {
          pdfRef.current.click();
        }
      }, 1000);
    }
  }, [projectData, canvasInstance, floorPlan, replace, params, pdfRef]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  /**
   * Handles the form submission process, saving profile data to the database.
   *
   * @param {any} data - The data to be submitted, including profiles and other information.
   */
  const onSubmit: SubmitHandler<any> = async (data: any) => {
    if (!projectId || !projectData || !floorPlan?.pdf) {
      return;
    }
    setLoadingType('save');
    try {
      // updateProfilesHandler(data);
      floorPlan.getProfiles();
      const lastPDFId = projectData.file?.pdf.length - 1;
      const pdf = projectData.file?.pdf[lastPDFId];
      pdf.formData = data;

      await supabaseClient
        .from(SupabaseTableNames.project)
        .update({
          file: projectData.file,
        })
        .eq('id', projectId)
        .select('*')
        .single();

      setLoadingType(null);
    } catch (error) {
      setLoadingType(null);
    }
  };

  const calculateValue = useCallback(
    (value: number | undefined): string => {
      if (value === undefined) return '';

      return (
        1000 *
        canvasInstance.round(
          floorPlan?.autoProfileGeometry?.grid.toUnit(value) as number,
          5,
        )
      ).toString();
    },
    [canvasInstance, floorPlan?.autoProfileGeometry?.grid],
  );

  const timer = (ms: number | undefined) => new Promise((res) => setTimeout(res, ms));
  const updateCanvasHandler = async () => {
    if (!floorPlan || !projectData) {
      return;
    }

    setLoadingType('regeneratePDF');
    const updatedValues = getValues();
    const { updatedProfiles } = useEditorStore.getState();

    try {
      // Combine all profiles pieces_data in to single array
      let combinedProfiles: any[] = [];
      updatedValues.profiles.forEach((profile: any) => {
        combinedProfiles = combinedProfiles.concat(profile.pieces_data);
      });

      if (!floorPlan.autoProfiles) {
        return;
      }

      const filterUpdatedProfiles = floorPlan.autoProfiles?.filter(
        (profile: { id: any }) => updatedProfiles?.some((pr: any) => pr.id == profile.id),
      );

      for (const p of filterUpdatedProfiles) {
        const matchedProfile = combinedProfiles.find((pr: any) => pr.profileId == p.id);
        if (matchedProfile) {
          floorPlan.hoverProfile = p;
          floorPlan.changingProfile = p;
          floorPlan.changing = true;

          const selectedSegment = {
            values: matchedProfile.length,
            aMasses: p.parts.map(({ aMass }: { aMass: number }) => calculateValue(aMass)),
            cMasses: p.parts.map(({ cMass }: { cMass: number }) => calculateValue(cMass)),
            inns: p.parts.map(({ inn }: { inn: number }) => calculateValue(inn)),
            outs: p.parts.map(({ out }: { out: number }) => calculateValue(out)),
            wallWidths: p.parts.map(({ wallW }: { wallW: number }) =>
              calculateValue(wallW),
            ),
          };
          switch (matchedProfile.profile.type) {
            case 'Straight':
              selectedSegment.values = [matchedProfile.length.toString()];
              break;
            case 'Angled':
              selectedSegment.values = matchedProfile.length.split('/').map(String);
              break;
            case 'End':
              selectedSegment.values = [matchedProfile.length.split(' ')[0]];
              break;
            case 'T-shape':
              selectedSegment.values = matchedProfile.length.split('/').map(String);
              break;

            default:
              break;
          }
          await floorPlan.setProfileChangesToSavePDF(selectedSegment as any);
          await timer(2000);
        } else {
          return null;
        }
      }
      await floorPlan.draw();
      await timer(1000);
      await floorPlan.addPDF();
      await timer(1000);
      await floorPlan.setTool(projectDetails?.file.tool || 2);
      const updatedFile = await floorPlan.export();

      await supabaseClient
        .from(SupabaseTableNames.project)
        .update({ file: JSON.parse(updatedFile) })
        .eq('id', projectId)
        .select('*')
        .single();
      // revalidate();

      useEditorStore.setState({
        updatedProfiles: [],
        projectData: { ...projectData, file: JSON.parse(updatedFile) },
      });

      setLoadingType(null);
    } catch (error) {
      setLoadingType(null);
    }
  };
  useEffect(() => {
    window.onbeforeprint = () => {
      if (stackRef.current) {
        stackRef.current.style.opacity = '0';
      }
    };
    window.onafterprint = () => {
      if (stackRef.current) {
        stackRef.current.style.opacity = '1';
      }
    };
  }, []);

  return (
    <Box>
      {params.get('generate_pdf') && (
        <Backdrop
          open
          sx={{
            zIndex: 2000,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Progress />
        </Backdrop>
      )}
      <Box id="pdfContent">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <PDFHeader />

            {floorPlan &&
              fields?.map((field, i) => (
                <Box key={field.id} sx={{ my: '2rem' }}>
                  <Profile index={i} field={field} />
                </Box>
              ))}
            <Stack
              direction={'row'}
              gap={1}
              p={1}
              ref={stackRef}
              justifyContent={'space-between'}
              alignItems={'center'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                p: '1rem',
                position: 'sticky',
                bottom: '-1px',
                marginBottom: '-2px',
                zIndex: 99,
                transition: 'all .15s ease-in-out',
                background: '#fff',
              }}
              className="check"
            >
              <Stack
                direction={'row'}
                justifyContent={'start'}
                gap={1}
                width={'100%'}
                flex={1}
              >
                <Button
                  variant="contained"
                  onClick={generatePDFHandler}
                  ref={pdfRef}
                  endIcon={
                    loadingType === 'generatePdf' ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : undefined
                  }
                >
                  {languageData.editor.pdf.buttons.exportPDF}
                </Button>
                <CSVLink
                  asyncOnClick
                  onClick={() => {
                    if (!projectDetails) {
                      return;
                    }
                    const csvData = generateCSVData(projectDetails, getValues());
                    setExportCSVData(csvData as any);
                  }}
                  data={exportCSVData}
                  headers={csvHeaders}
                  filename="konfigurator"
                >
                  <Button variant="contained">
                    {languageData.editor.pdf.buttons.exportCSV}
                  </Button>
                </CSVLink>
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={
                    loadingType === 'save' ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : undefined
                  }
                >
                  {languageData.editor.pdf.buttons.save}
                </Button>
              </Stack>
              <Button
                onClick={updateCanvasHandler}
                variant="contained"
                endIcon={
                  loadingType === 'regeneratePDF' ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : undefined
                }
              >
                {languageData.editor.pdf.buttons.updateCanvas}
              </Button>
            </Stack>
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
};

export default PDFForm;
