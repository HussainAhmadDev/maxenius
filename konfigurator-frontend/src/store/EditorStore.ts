import { P5CanvasInstance } from '@p5-wrapper/react';
import p5 from 'p5';
import { create } from 'zustand';

import { FloorPlanManager } from '@/components/editor/floorPlanManager';
import { PointManager } from '@/components/editor/PointManager';
import { Profile } from '@/components/editor/profiles';
import { EditorState, FileType } from '@/components/editor/types';
import { PDFFormState } from '@/types/PdfProfile';
import { ProjectDetails, ProjectResponse } from '@/types/Project';

export interface ProfilePart {
  length: number;
  aMass: number;
  isOuter: boolean;
  z_profile_a: boolean;
  wallW: number;
  out: number;
  inn: number;
  cMass: number;
  z_profile_c: boolean;
}

export interface ProfileData {
  profiles: string[];
  values: number[];
  aMasses: number[];
  wallWidths: number[];
  inns: number[];
  outs: number[];
  cMasses: number[];
  zProfilesA?: boolean[];
  zProfilesC?: boolean[];
}

interface EditorRootState extends EditorState {
  canvasInstance: P5CanvasInstance;
  renderer: p5.Renderer | null;
  projectData: ProjectDetails | null;
  allProjects: ProjectResponse[];
  openProjects: ProjectResponse[];
  lockedProfile: boolean;
  selectedRoute: 'allProjects' | 'openProjects' | 'finishedProjects';
  finishedProjects: ProjectResponse[];
  profileData: ProfileData;
  pdfForm: PDFFormState;
  projectFile: null | FileType;
  projectDetails: null | ProjectDetails;
  setProfileData: (val: Partial<ProfileData>) => void;
  selectedProfileForm: Array<ProfilePart[]>;
  updatedProfiles: Array<Profile[]>;
  setFloorPlan: (val: FloorPlanManager) => void;
  setIsSidebarOpen: (val: boolean) => void;
  setCanvasInstance: (val: P5CanvasInstance) => void;
  setCameraPosition: (val: { x: number; y: number }) => void;
  setZoomVal: (val: number) => void;
  setTrashPM: (val: PointManager) => void;
  setCam: (val: boolean) => void;
  setNickainley: (val: p5.Font) => void;
  setDrawingData: (val: string) => void;
  setRenderer: (val: p5.Renderer) => void;
  setProjectData: (val: ProjectDetails) => void;
}

export const useEditorStore = create<EditorRootState>()((set) => ({
  floorPlan: null,
  renderer: null,
  canvasInstance: null as any,
  isSidebarOpen: false,
  zoomVal: 1,
  lockedProfile: false,
  selectedRoute: 'allProjects',
  cameraPosition: { x: 0, y: 0 },
  trashPM: null,
  cam: false,
  updatedProfiles: [],
  projectFile: null,
  nickainley: '',
  drawingData: '',
  projectData: null,
  allProjects: [],
  openProjects: [],
  finishedProjects: [],
  selectedProfileForm: [],
  projectDetails: null,
  profileData: {
    profiles: [],
    values: [],
    aMasses: [],
    wallWidths: [],
    inns: [],
    outs: [],
    cMasses: [],
    zProfilesA: [],
    zProfilesC: [],
  },
  pdfForm: {
    id: 0,
    profiles: [],
    material: '',
    stärke: '',
    korrosionsschutz: '',
    gebHöhe: '',
    name: '',
    datum: '',
    artikelnr: '',
    au_nr: '',
    kunde: '',
    kom: '',
    blatt: '',
    data_uri: '',
    image: {
      url: '',
      public_id: '',
    },
  },
  setFloorPlan: (val) => set(() => ({ floorPlan: val })),
  setIsSidebarOpen: (val) => set(() => ({ isSidebarOpen: val })),
  setCanvasInstance: (val) => set(() => ({ canvasInstance: val })),
  setCameraPosition: (val) => set(() => ({ cameraPosition: val })),
  setZoomVal: (val) => set(() => ({ zoomVal: val })),
  setTrashPM: (val) => set(() => ({ trashPM: val })),
  setCam: (val) => set(() => ({ cam: val })),
  setNickainley: (val) => set(() => ({ nickainley: val })),
  setDrawingData: (val) => set(() => ({ drawingData: val })),
  setRenderer: (val) => set(() => ({ renderer: val })),
  setProjectData: (val) => set(() => ({ projectData: val })),
  setProfileData: (val) =>
    set((state) => ({ profileData: { ...state.profileData, ...val } })),
}));
