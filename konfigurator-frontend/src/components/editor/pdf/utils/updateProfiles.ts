import { useEditorStore } from '@/store/EditorStore';

export const updateProfilesHandler = async (data: any) => {
  // eslint-disable-next-line no-console
  console.log('🚀 ~ updateProfilesHandler ~ data:', data);
  const { projectData, floorPlan } = useEditorStore.getState();

  if (!projectData || !floorPlan) {
    return;
  }
  const pdf_data = projectData?.file.pdf[projectData?.file.pdf.length - 1].pdf_data;
  let combinedProfiles: any[] = [];
  data.profiles.forEach((profile: any) => {
    combinedProfiles = combinedProfiles.concat(profile.pieces_data);
  });

  pdf_data[1][0].p.length = 2.69;
  // floorPlan.autoProfilesCompact?.forEach((profile: any) => {
  // const matchedprofile = combinedProfiles.find(
  //   (p: any) => p.profileId == profile.profile.id,
  // );
  // console.log(profile.profile.id === pdf_data[1][0]?.p.id);
  // profile = p;
  // });
};

export const calculateValue = (value: number | undefined): string => {
  const { canvasInstance, floorPlan } = useEditorStore.getState();
  if (value === undefined) return '';
  return (
    1000 *
    canvasInstance.round(floorPlan?.autoProfileGeometry?.grid.toUnit(value) as number, 5)
  ).toString();
};
