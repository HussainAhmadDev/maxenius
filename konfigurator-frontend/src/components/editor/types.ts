import { FloorPlanManager } from './floorPlanManager';
import { PointManager } from './PointManager';

export interface EditorState {
  zoomVal: number;
  cameraPosition: { x: number; y: number };
  trashPM: PointManager | null;
  cam: boolean;
  nickainley: string | object;
  floorPlan: null | FloorPlanManager;
  drawingData: string;
  isSidebarOpen: boolean;
}

export interface FileType {
  appType: string;
  closed: boolean;
  addLines: any[];
  pdf: [
    {
      formData?: any;
      pdf_data: any[];
      img: string;
    },
  ];
  profiles: any[];
  default: {
    al: number;
    col: string;
    grid: number;
    ha: number;
    ih: number;
    iw: number;
    oh: number;
    ow: number;
    pt: number;
    st: number;
    ul: number;
    ww: number;
  };
  points: { x: number; y: number }[];
  tool: 2;
}
// export interface ProjectDetails {
//   editRestricted: boolean;
//   editors: string[];
//   file: FileType;
//   id: string;
//   name: string;
//   owner: string;
// }
