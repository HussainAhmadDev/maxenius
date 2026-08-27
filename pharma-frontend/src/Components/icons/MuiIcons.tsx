/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Cancel from "@material-ui/icons/Cancel";
import Add from "@material-ui/icons/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Check from "@material-ui/icons/Check";
import Info from "@material-ui/icons/Info";
import LoopIcon from "@material-ui/icons/Loop";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Copy from "@material-ui/icons/FileCopyOutlined";
import PrintIcon from "@material-ui/icons/Print";
import EmailIcon from "@material-ui/icons/Email";
import EmailOutlinedIcon from "@material-ui/icons/EmailTwoTone";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import PersonIcon from "@material-ui/icons/Person";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import CheckOutlined from "@material-ui/icons/CheckCircle";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import GetAppIcon from "@material-ui/icons/GetApp";
import SendIcon from "@material-ui/icons/Send";
import KeyboardBackspaceRoundedIcon from "@material-ui/icons/KeyboardBackspaceRounded";
import UndoIcon from "@material-ui/icons/Undo";
import CallTwoToneIcon from "@material-ui/icons/CallTwoTone";
import LocalShippingTwoToneIcon from "@material-ui/icons/LocalShippingTwoTone";
import TextsmsTwoToneIcon from "@material-ui/icons/TextsmsTwoTone";
import ImageIcon from "@material-ui/icons/Image";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import PersonRoundedIcon from "@material-ui/icons/PersonRounded";
import HelpRoundedIcon from "@material-ui/icons/HelpRounded";
import MenuIcon from "@material-ui/icons/Menu";
import HistoryIcon from "@material-ui/icons/History";
import NotificationsIcon from "@material-ui/icons/Notifications";
import CallMergeIcon from "@material-ui/icons/CallMerge";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import EqualizerIcon from "@material-ui/icons/Equalizer";

// import NoteAddIcon from '@material-ui/icons/NoteAdd';

type IconType =
  | "delete"
  | "add"
  | "minus"
  | "check"
  | "edit"
  | "cancel"
  | "info"
  | "loop"
  | "view"
  | "copy"
  | "print"
  | "email"
  | "file"
  | "person"
  | "persons"
  | "city"
  | "checkOutlined"
  | "dots"
  | "download"
  | "send"
  | "backArrow"
  | "undo"
  | "emailOutlined"
  | "callOutlined"
  | "messageOutlined"
  | "busOutlined"
  | "arrowDown"
  | "arrowLeft"
  | "arrowRight"
  | "image"
  | "user"
  | "menu"
  | "notification"
  | "history"
  | "help"
  | "ship"
  | "radio"
  | "merge"
  | "equalizer";

type Color = "inherit" | "primary" | "secondary" | "action" | "error" | "disabled";
type FontSize = "default" | "inherit" | "large" | "medium" | "small";
interface Props {
  readonly icon: IconType;
  readonly color?: Color;
  readonly fontSize?: FontSize;
  readonly className?: string;
  readonly onClick?: () => void;
}
const MuiIcon: React.FC<Props> = props => {
  switch (props.icon) {
    case "delete":
      return <Delete classes={{ colorPrimary: props.className }} {...props} />;
    case "add":
      return <Add className={props.className} {...props} />;
    case "minus":
      return <RemoveIcon />;
    case "check":
      return <Check classes={{ colorPrimary: props.className }} {...props} />;
    case "edit":
      return <Edit className={props.className} {...props} />;
    case "cancel":
      return <Cancel className={props.className} {...props} />;
    case "info":
      return <Info className={props.className} {...props} />;
    case "file":
      return <AttachFileIcon className={props.className} {...props} />;
    case "loop":
      return <LoopIcon className={props.className} {...props} />;
    case "view":
      return <VisibilityIcon className={props.className} {...props} />;
    case "copy":
      return <Copy className={props.className} {...props} />;
    case "print":
      return <PrintIcon className={props.className} {...props} />;
    case "email":
      return <EmailIcon className={props.className} {...props} />;
    case "emailOutlined":
      return <EmailOutlinedIcon className={props.className} {...props} />;
    case "person":
      return <PersonIcon className={props.className} {...props} />;
    case "persons":
      return <PeopleAltIcon className={props.className} {...props} />;
    case "city":
      return <LocationCityIcon className={props.className} {...props} />;
    case "checkOutlined":
      return <CheckOutlined className={props.className} {...props} />;
    case "dots":
      return <MoreHorizIcon className={props.className} {...props} />;
    case "download":
      return <GetAppIcon className={props.className} {...props} />;
    case "send":
      return <SendIcon className={props.className} {...props} />;
    case "backArrow":
      return <KeyboardBackspaceRoundedIcon className={props.className} {...props} />;
    case "undo":
      return <UndoIcon className={props.className} {...props} />;
    case "callOutlined":
      return <CallTwoToneIcon className={props.className} {...props} />;
    case "messageOutlined":
      return <TextsmsTwoToneIcon className={props.className} {...props} />;
    case "busOutlined":
      return <LocalShippingTwoToneIcon className={props.className} {...props} />;
    case "image":
      return <ImageIcon className={props.className} {...props} />;
    case "arrowDown":
      return <KeyboardArrowDownIcon className={props.className} {...props} />;
    case "arrowLeft":
      return <KeyboardArrowLeftIcon className={props.className} {...props} />;
    case "arrowRight":
      return <KeyboardArrowRightIcon className={props.className} {...props} />;
    case "user":
      return <PersonRoundedIcon className={props.className} {...props} />;
    case "help":
      return <HelpRoundedIcon className={props.className} {...props} />;
    case "menu":
      return <MenuIcon className={props.className} {...props} />;
    case "history":
      return <HistoryIcon className={props.className} {...props} />;
    case "notification":
      return <NotificationsIcon className={props.className} {...props} />;
    case "merge":
      return <CallMergeIcon className={props.className} {...props} />;
    case "ship":
      return <LocalShippingIcon className={props.className} {...props} />;
    case "radio":
      return <RadioButtonUncheckedIcon className={props.className} {...props} />;
    // case "prescription":
    // return <NoteAddIcon className={props.className} {...props}/>;
    case "equalizer":
      return <EqualizerIcon className={props.className} {...props} />;
    default:
      return null;
  }
};
export default MuiIcon;
