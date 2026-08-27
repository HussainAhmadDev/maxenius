const toDataURL = (url: string): Promise<URL> =>
  fetch(url)
    .then(response => response.blob())
    .then(
      blob =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) return resolve(new URL(reader.result?.toString()));
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(",");
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename);
}

export async function convertUrlToFile(url: string, filename: string) {
  const dataURL = await toDataURL(url);
  return dataURLtoFile(dataURL.toString(), filename);
}
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric"
  };
  return date.toLocaleDateString("en-US", options);
}
