export const selectText = (
  event: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement, MouseEvent>
): void => {
  event.currentTarget.select();
};
