/* eslint-disable prefer-const */
export const dataURItoBlob = (dataURI: string) => {
  function dataURLtoBlob(dataurl: any) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  //**blob to dataURL**
  function blobToDataURL(
    blob: Blob,
    callback: { (dataurl: any): void; (arg0: string | ArrayBuffer | null): void },
  ) {
    const a = new FileReader();
    a.onload = function (e) {
      callback(e.target?.result);
    };
    a.readAsDataURL(blob);
  }

  const blob = dataURLtoBlob(dataURI);
  return blobToDataURL(blob, function (dataurl) {
    return dataurl;
  });
};
