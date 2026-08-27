import { useEditorStore } from '@/store/EditorStore';

const { projectData, canvasInstance } = useEditorStore.getState();
const fileData = projectData?.file;

export const PDFInitialState = {
  name: '',
  material: fileData ? fileData.default.al.toPrecision(2).replace('.', ',') : '',
  stärke: fileData ? fileData.default.al.toPrecision(2).replace('.', ',') + ' mm' : '',
  gebHöhe: '',
  gefalle: '',
  gefalle1: fileData ? fileData.default.st.toString().replace('.', ',') + '°' : '',
  halterabst: fileData?.default.ha || '',
  formteil: 'Profil ' + fileData?.default.pt || '',
  materialstärke: fileData?.default.al.toPrecision(2).replace('.', ','),
  lfm: '',
  abw: '',
  ai_ie: '',
  ai_ie1: '',
  ge_te: '',
  ge_te1: '',
  ak: '',
  ek: '',
  stuck: '',
  davon: '',
  ae_stuck: '',
  ie_stuck: '',
  profiles: [
    {
      pieces_data: [],
    },
  ],
};

if (projectData && canvasInstance) {
  PDFInitialState.name = projectData.name;
  const pdf_data = projectData?.file.pdf[0].pdf_data;
  // Wall offsets mm
  const uber = document.getElementsByName('uberstand') as any;
  for (let i = 0; i < uber.length; i++) {
    const j = projectData?.file.pdf[i].pdf_data[i][0].p;

    let maxID = 0;
    let maxX = Number.NEGATIVE_INFINITY;
    for (let x = 0; x < j.inns.length; x++) {
      if (j.inns[x] + j.outs[x] + j.wallWidths[x] > maxX) {
        maxX = j.inns[x] + j.outs[x] + j.wallWidths[x];
        maxID = x;
      }
    }
    const grid = projectData?.file.default.grid || 0;
    const inn = j.inns[maxID] * grid * 1000;
    const out = j.outs[maxID] * grid * 1000;

    uber[i].value = inn.toString() + '/' + out.toString();
  }

  // Slope mm
  let val;
  val = 0;
  let b = 0;

  const j = projectData?.file.pdf[0].pdf_data[0][0].p;
  b += j.inns[0];
  b += j.outs[0];
  b += j.wallWidths[0];

  val =
    fileData!.default.grid * 1000 * b * Math.sin((fileData!.default.st * Math.PI) / 180);
  val = Math.round(val * 1e3) / 1e3;

  PDFInitialState.gefalle = val.toString().replace('.', ',') + ' mm';

  // Total length

  let value = 0;
  for (const j of pdf_data[0]) {
    switch (j.p.type) {
      case 'End':
        value += j.am * j.p.length;
        value += j.am * j.p.upLength;
        break;
      case 'Straight':
        value += j.am * j.p.length;
        break;
      case 'Angled':
        value += j.am * canvasInstance.round(j.p.realRightLength + j.p.realLeftLength, 6);
        break;
      case 'T-shape':
        value +=
          j.am *
          canvasInstance.round(j.p.realXLength + j.p.realYLength + j.p.realZLength, 6);
        break;
      default:
        value +=
          j.am *
          j.lengths.reduce((a: any, b: any) => Math.round((a + b) * 10e5) / 10e5, 0);
        break;
    }
  }
  PDFInitialState.lfm =
    canvasInstance.round(value, 6).toString().replace('.', ',') + ' m';

  // Total profile length
  let profileLengthVal = 0;

  profileLengthVal += j.aMasses[0];
  profileLengthVal += j.cMasses[0];
  profileLengthVal += j.inns[0];
  profileLengthVal += j.outs[0];
  profileLengthVal += j.wallWidths[0];

  profileLengthVal *= fileData!.default.grid * 1000;

  PDFInitialState.abw = profileLengthVal.toString().replace('.', ',') + ' mm';

  //Profile counts
  let ai_ie_90_c = 0;
  let ai_ie_n90_c = 0;
  let ge_te_90_c = 0;
  let ge_te_n90_c = 0;
  let ak_c = 0;
  let ek_c = 0;

  for (const j of pdf_data[0]) {
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

  PDFInitialState['ai_ie'] = ai_ie_90_c + ' Stck';
  PDFInitialState['ai_ie1'] = ai_ie_n90_c + ' Stck';
  PDFInitialState['ge_te'] = ge_te_90_c + ' Stck';
  PDFInitialState['ge_te1'] = ge_te_n90_c + ' Stck';
  PDFInitialState.ak = ak_c + ' Stck';
  PDFInitialState.ek = ek_c + ' Stck';

  // Halter

  const lfm = PDFInitialState.lfm.toString().replace(',', '.');
  const halterabst =
    parseFloat(PDFInitialState.halterabst.toString()?.replace(',', '.')) / 1000;

  let totalCount = 0;
  for (const d of pdf_data[0]) {
    totalCount += d.am;
  }

  if (fileData?.closed) {
    PDFInitialState.stuck = Math.ceil(+lfm / halterabst) + 1 + ' Stck';
    PDFInitialState.davon = totalCount - 1 + ' Stck';
  } else {
    PDFInitialState.stuck = Math.ceil(+lfm / halterabst) + ' Stck';
    PDFInitialState.davon = totalCount + ' Stck';
  }

  // AE, IE Halter

  let totalAECount = 0;
  let totalIECount = 0;
  for (const d of pdf_data[0]) {
    if (d.p.type == 'Angled') {
      if (d.p.angle > Math.PI) {
        totalIECount += d.am;
      } else {
        totalAECount += d.am;
      }
    }
  }

  PDFInitialState.ae_stuck = totalAECount + ' Stck';
  PDFInitialState.ie_stuck = totalIECount + ' Stck';
}
