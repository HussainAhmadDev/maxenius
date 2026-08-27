import { useAuthStore } from '@/store/AuthStore';
import { PDFFormState } from '@/types/PdfProfile';
import { ProjectDetails } from '@/types/Project';

export const csvHeaders = [
  'LaufNr',
  'Satzart',
  'Kd.-Nr.',
  'Kd.Name',
  'Straße',
  'PLZ',
  'Stadt',
  'Erstellt am',
  'Belegdatum/Uhrzeit',
  'Sachbearbeiter',
  'Produkt/Auftragtyp',
  'Profilnr',
  'Profiltype',
  'Material',
  'Materialstärke',
  'Oberfläche',
  'Oberflächetyp',
  'Oberfläche in m2',
  'Art/Produktspezifikation',
  'Anzahl',
  'ABW in mm',
  'Pos.',
  'Stück',
  'Bezeichnung',
  'Winkel',
  'L-Maße [mm]',
];

export const csvEnglishHeaders = [
  'RunNr',
  'CaseType',
  'CustomerNr',
  'CustomerName',
  'Street',
  'ZipCode',
  'City',
  'CreatedAt',
  'DocumentDate/Time',
  'Employee',
  'Product/OrderType',
  'ProfileNr',
  'ProfileType',
  'Material',
  'MaterialThickness',
  'Surface',
  'SurfaceType',
  'SurfaceAreaInSqM',
  'Art/ProductSpecification',
  'Quantity',
  'EndCapLength',
  'Pos.',
  'Piece',
  'ItemName',
  'Angle',
  'L-MeasureInMm',
];

export const generateCSVData = (project: ProjectDetails | null, data: PDFFormState) => {
  if (!project) {
    return [];
  }
  const csvData = [];

  const { session } = useAuthStore.getState();
  // Customer Data
  csvData.push({
    'Kd.-Nr.': project?.customer.id,
    'Kd.Name': project?.customer.firstName + ' ' + project.customer.lastName,
    Straße: project?.customer.address1 || project.customer.address2,
    PLZ: project?.customer.zipCode,
    Stadt: project?.customer.country,
    'Erstellt am': new Date(project?.customer.created_at).toLocaleDateString(),
    'Belegdatum/Uhrzeit':
      new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
    Sachbearbeiter: session?.user.email,
  });

  for (let i = 0; i < data.profiles.length; i++) {
    const profile = data.profiles[i];
    const profileData = {
      Material: profile.materialwerkstoff || '',
      Materialstärke: profile.materialstärke || '',
      'ABW in mm': profile.abw || '',
      Profilnr: `'000${i + 1}`,
      Profiltype: i + 1,
    };
    csvData.push({ ...profileData });
  }

  // Profiles data

  for (let i = 0; i < data.profiles.length; i++) {
    const profile = data.profiles[i];
    for (const piece of profile.pieces_data) {
      const pieceData = {
        'Pos.': piece.pos,
        Winkel: piece.angle || '',
        Stück: piece.amount || '',
        Bezeichnung: piece.bezeichung || '',
        'L-Maße [mm]': piece.length || '',
        Profilnr: `'000${i + 1}`,
        Profiltype: i + 1,
      };
      csvData.push({ ...pieceData });
    }
  }

  return csvData;
};

export const csvData = [
  { firstname: 'Ahmed', lastname: 'Tomi', email: 'ah@smthing.co.com' },
  { firstname: 'Raed', lastname: 'Labes', email: 'rl@smthing.co.com' },
  { firstname: 'Yezzi', lastname: 'Min l3b', email: 'ymin@cocococo.com' },
];
