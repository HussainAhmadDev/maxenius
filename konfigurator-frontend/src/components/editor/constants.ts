export const defaultProfileData =
  '"{"appType":"kantmanufaktur","closed":false,"tool":0,"points":[],"addLines":[],"profiles":[],"default":{"oh":0.2,"ih":0.1,"ww":0.25,"iw":0.025,"ow":0.05,"ul":0.25,"col":"rgb(128,128,128)","pt":"0","st":"3","al":"2","grid":0.02,"ha":"1000"},"pdf":[]}"';

export const maxFPS = 60;
export const cameraPosition = { x: 0, y: 0 };
export const zoomVal = 1;
export const globalAppType = 'kantmanufaktur';
export const showModel = false;
export const nickainley: any = null;

/**
 * @description Amount of decimal places round coordinates to
 */
export const decimalRoundCoordinate = 3;
/**
 * @description Amount of decimal places round angles in radians to
 */
export const decimalRoundAngle = 15;
/**
 * @description A large number used to draw lines.
 */
export const lineLengthMultiplier = 1e6;

export const controls = {
  view: { x: 0, y: 0, zoom: 1 },
  viewPos: { prevX: null, prevY: null, isDragging: false },
};
