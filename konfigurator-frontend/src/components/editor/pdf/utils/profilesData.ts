import { P5CanvasInstance } from '@p5-wrapper/react';

import { FileType } from '../../types';

// Slope mm
export const getGefalle = (j: any, fileData: FileType) => {
  let val = 0;
  let b = 0;

  b += j.inns[0];
  b += j.outs[0];
  b += j.wallWidths[0];

  val =
    fileData.default.grid *
    1000 *
    b *
    Math.sin((parseFloat(fileData.default.st?.toString()) * Math.PI) / 180);
  val = Math.round(val * 1e3) / 1e3;

  return val.toString().replace('.', ',') + ' mm';
};

// Wall offsets mm
export const getUberstand = (j: any, fileData: FileType) => {
  let maxID = 0;
  let maxX = Number.NEGATIVE_INFINITY;
  for (let x = 0; x < j.inns.length; x++) {
    if (j.inns[x] + j.outs[x] + j.wallWidths[x] > maxX) {
      maxX = j.inns[x] + j.outs[x] + j.wallWidths[x];
      maxID = x;
    }
  }
  const inn = j.inns[maxID] * fileData.default.grid * 1000;
  const out = j.outs[maxID] * fileData.default.grid * 1000;

  return inn.toString() + '/' + out.toString();
};

// Total length
export const getLFM = (pdfData: any, canvasInstance: P5CanvasInstance) => {
  let totalVal = 0;

  pdfData.forEach(
    (j: {
      p: {
        type: any;
        length: number;
        upLength: number;
        realRightLength: any;
        realLeftLength: any;
        realXLength: any;
        realYLength: any;
        realZLength: any;
      };
      am: number;
      lengths: any[];
    }) => {
      switch (j.p.type) {
        case 'End':
          totalVal += j.am * j.p.length;
          totalVal += j.am * j.p.upLength;
          break;
        case 'Straight':
          totalVal += j.am * j.p.length;
          break;
        case 'Angled':
          totalVal +=
            j.am * canvasInstance.round(j.p.realRightLength + j.p.realLeftLength, 6);
          break;
        case 'T-shape':
          totalVal +=
            j.am *
            canvasInstance.round(j.p.realXLength + j.p.realYLength + j.p.realZLength, 6);
          break;
        default:
          totalVal +=
            j.am * j.lengths?.reduce((a, b) => Math.round((a + b) * 10e5) / 10e5, 0);
          break;
      }
    },
  );

  return canvasInstance.round(totalVal, 6).toString().replace('.', ',') + ' m';
};

// Total profile length
export const getABW = (j: any, fileData: FileType) => {
  let val = 0;
  val += j.aMasses[0];
  val += j.cMasses[0];
  val += j.inns[0];
  val += j.outs[0];
  val += j.wallWidths[0];
  val *= fileData.default.grid * 1000;

  return val.toString().replace('.', ',') + ' mm';
};

//Profile counts
export const getStck = (pdf_data: any) => {
  let ai_ie_90_c = 0;
  let ai_ie_n90_c = 0;
  let ge_te_90_c = 0;
  let ge_te_n90_c = 0;
  let ak_c = 0;
  let ek_c = 0;

  for (const j of pdf_data) {
    switch (j.p.type) {
      case 'End':
        if (j.p.up) {
          ak_c += j.am;
        } else {
          ek_c += j.am;
        }
        break;
      case 'Straight':
        break;
      case 'Angled':
        if (
          j.p.angle != Math.round((Math.PI / 2) * 10e6) / 10e6 &&
          j.p.angle != Math.round(Math.PI * 1.5 * 10e6) / 10e6
        ) {
          ai_ie_n90_c += j.am;
        } else {
          ai_ie_90_c += j.am;
        }
        break;
      case 'T-shape':
        if (
          j.p.xyAngle == Math.round((Math.PI / 2) * 1e6) / 1e6 ||
          j.p.yzAngle == Math.round((Math.PI / 2) * 1e6) / 1e6 ||
          j.p.zxAngle == Math.round((Math.PI / 2) * 1e6) / 1e6
        ) {
          ge_te_90_c += j.am;
        } else {
          ge_te_n90_c += j.am;
        }
        break;
      default:
        break;
    }
  }

  return {
    ai_ie: ai_ie_90_c + ' Stück',
    ai_ie1: ai_ie_n90_c + ' Stück',
    ge_te: ge_te_90_c + ' Stück',
    ge_te1: ge_te_n90_c + ' Stück',
    ak: ak_c + ' Stück',
    ek: ek_c + ' Stück',
  };
};

// Halter
export const getStuckDavon = (pdf_data: any, fileData: FileType, profile: any) => {
  let stuck;
  let davon;

  const lfm = parseFloat(profile.lfm?.replace(',', '.'));
  const halterabst = parseFloat(profile.halterabst?.toString()?.replace(',', '.')) / 1000;

  let totalCount = 0;
  for (const d of pdf_data) {
    totalCount += d.am;
  }

  if (fileData.closed) {
    stuck = Math.ceil(lfm / halterabst) + 1 + ' Stück';
    davon = totalCount - 1 + ' Stück';
  } else {
    stuck = Math.ceil(lfm / halterabst) + ' Stück';
    davon = totalCount + ' Stück';
  }
  profile.stuck = stuck;
  profile.davon = davon;

  return profile;
};

// AE, IE Halter
export const getAEIEStuck = (pdf_data: any) => {
  let totalAECount = 0;
  let totalIECount = 0;
  for (const d of pdf_data) {
    if (d.p.type == 'Angled') {
      if (d.p.angle > Math.PI) {
        totalIECount += d.am;
      } else {
        totalAECount += d.am;
      }
    }
  }

  return {
    ae_stuck: totalAECount + ' Stück',
    ie_stuck: totalIECount + ' Stück',
  };
};

// Default masses
export const getDefaultMasses = (p: any, fileData: FileType, maxID: number) => {
  const a_mass = p.aMasses[maxID] * fileData.default.grid * 1000 + ' mm';
  const b_mass =
    (p.inns[maxID] + p.outs[maxID] + p.wallWidths[maxID]) * fileData.default.grid * 1000 +
    ' mm';
  const c_mass = p.cMasses[maxID] * fileData.default.grid * 1000 + ' mm';

  return {
    a_mass,
    b_mass,
    c_mass,
  };
};
