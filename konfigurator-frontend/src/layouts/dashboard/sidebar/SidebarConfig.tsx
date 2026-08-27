import StarSharpIcon from '@mui/icons-material/StarSharp';

import { languageData } from '@/constants';

const starIcon = <StarSharpIcon sx={{ fill: 'white', opacity: 0.56 }} />;

const { sidebar } = languageData.dashboard;
const sidebarConfig = [
  {
    title: sidebar.allProjects,
    path: '/dashboard/all-projects',
    icon: starIcon,
  },
  {
    title: sidebar.openProjects,
    path: '/dashboard/open-projects',
    icon: starIcon,
  },
  {
    title: sidebar.finishedProjects,
    path: '/dashboard/finished-projects',
    icon: starIcon,
  },
];

export default sidebarConfig;
