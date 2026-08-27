import { Contact } from "./Company";
import { UserData } from "./User";

export interface ModalInterface {
  handleReset?: (user: UserData | undefined) => void;
  readonly handleSaveChanges: () => void;
  readonly handleCloseModal: () => void;
  readonly openModal: boolean;
  readonly title?: string;
  readonly noHeader?: boolean;
  readonly saveText?: string;
  readonly saveBtnLoading?: boolean;
  readonly cancelText?: string;
  readonly data?: Contact;
  selectedEditPassword?: UserData | undefined;
  readonly checkBox?: {
    readonly text: string;
    readonly value: boolean;
    readonly handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
}
