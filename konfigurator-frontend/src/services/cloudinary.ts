const cloudName = 'dnjmyu8w5';
const uploadPreset = 'konfigurator';
// const api_key = '519175476388653'; // get from https://console.cloudinary.com/pm/c-b9cb309480e2705fdd11a5a302b9a7/developer-dashboard
// const signature = 'bfd09f95f331f558cbd1320e67aa8d488770583e'; // random string

/**
 * Uploads a file to Cloudinary.
 *
 * @param {File} file - the file to be uploaded
 * @return {string} the URL of the uploaded image
 */

export const uploadToCloudinary = async (
  file: File,
  options: {
    project_id: number;
    public_id?: string;
  },
): Promise<any | null> => {
  const folder = `${uploadPreset}/${options.project_id}`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  // formData.append('api_key', api_key);
  // formData.append('signature', signature);
  // formData.append('timestamp', Date.now().toString());

  // formData.append('signature', 'true');
  if (options.public_id) formData.append('public_id', options.public_id);
  if (!options.public_id) formData.append('folder', folder); // Append the file name to the folder name

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const data = await response.json();
    return data; // Return the uploaded image URL
  } catch (error) {
    return null;
  }
};

// create a function to delete folder from cloudinary
export const deleteFolderFromCloudinary = async (folder: string) => {
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/folders/${folder}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folder,
          cloud_name: cloudName,
        }),
      },
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
