import { decimalRoundAngle, decimalRoundCoordinate } from './constants';
import { mousePos, zoom } from './others';

export function mouseWheel(event: any) {
  if (event.target == document.getElementById('defaultCanvas0')) {
    const mP = mousePos();
    if (event.delta < 0) {
      zoom('in', 0.1, mP.x, mP.y, event);
    } else {
      zoom('out', 0.1, mP.x, mP.y, event);
    }

    event.preventDefault();
  }
}

export function jiri_round(x: number, type = 'coordinate') {
  switch (type) {
    case 'coordinate':
      return (
        Math.round(x * Math.pow(10, decimalRoundCoordinate)) /
        Math.pow(10, decimalRoundCoordinate)
      );
    case 'angle':
      return (
        Math.round(x * Math.pow(10, decimalRoundAngle)) / Math.pow(10, decimalRoundAngle)
      );
    default:
      throw new Error('Unsuported rounding type.');
  }
}

export function getBase64FromImageUrl(url: string) {
  const img = new Image();

  img.setAttribute('crossOrigin', 'anonymous');

  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(img, 0, 0);

    const dataURL = canvas.toDataURL('image/png');

    alert(dataURL);
  };

  img.src = url;
}

export const generateImageBlob = () => {
  const canvas = document.getElementById('defaultCanvas0') as any;
  const dataURL = canvas?.toDataURL();
  return dataURL;
};
