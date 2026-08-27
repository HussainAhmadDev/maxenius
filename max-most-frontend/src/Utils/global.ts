import { Website } from "../Interfaces/Company";

export const getAllWebsitesWithoutAll = (allWebsites: Website[]) => {
  const allWebs = [];
  for (const website of allWebsites) {
    allWebs.push({
      label: website.title,
      value: website.id,
      id: website.id,
      site_url: website.site_url
    });
  }

  return allWebs;
};
