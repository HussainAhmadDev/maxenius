import * as React from "react";

interface Props {
  onSave?: () => void;
  onClose?: () => void;
  defaultOpen?: boolean;
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useModal = (props: Props = { defaultOpen: false }) => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(Boolean(props.defaultOpen));

  const handleSave = () => {
    props?.onSave?.();
    setModalOpen(false);
  };

  const handleModalClose = () => {
    props.onClose?.();
    setModalOpen(false);
  };

  return {
    handleModalOpen: () => setModalOpen(true),
    handleModalClose,
    handleSave,
    modalOpen
  };
};
