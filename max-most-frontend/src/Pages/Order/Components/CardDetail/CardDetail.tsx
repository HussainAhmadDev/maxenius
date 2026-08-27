import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { toast, Slide } from "react-toastify";
import dayjs from "dayjs";
import { ButtonClose } from "../ButtonClose/ButtonClose";
import { Textarea } from "../Textarea/Textarea";

import Comment from "../../Components/Comment/Comment";
import Label from "../Label/Label";
// import { Button } from "../Button/Button";
import FormDataTime from "../FormDataTime/FormDataTime";

interface LabelType {
  id: string;
  color: string;
  title: string;
}

interface CommentType {
  id: string;
  cardId: string;
  comment: string;
  datetime: string;
}

interface CardDetailProps {
  detailCard: {
    id: string;
    title: string;
    headline: string;
    src?: string;
    description: string;
    dateStart: string;
    dateEnd: string;
    done: boolean;
  };
  labels: { cardId: string; label: LabelType[] }[];
  comments: CommentType[];
  setIsShowDetailItem: (value: boolean) => void;
  onUpdateTitleValue: (value: string) => void;
  onUpdateDescriptionValue: (value: string) => void;
  onAddNewComment: (value: string) => void;
  onEditComment: (id: string, value: string) => void;
  onDeleteComment: (id: string) => void;
  onSaveDateStart: (date: string) => void;
  onSaveDateEnd: (date: string) => void;
  onUpdateDone: (value: boolean) => void;
}

export const CardDetail: React.FC<CardDetailProps> = ({
  detailCard,
  labels,
  comments,
  setIsShowDetailItem,
  onUpdateTitleValue,
  onUpdateDescriptionValue,
  // onAddNewComment,
  // onEditComment,
  onDeleteComment,
  onSaveDateStart,
  onSaveDateEnd,
  onUpdateDone
}) => {
  const { id, title, headline, src, description, dateStart, dateEnd, done } = detailCard;

  const [detailValueCard, setDetailValueCard] = useState({
    titleValue: title,
    descriptionValue: description,
    doneValue: done
  });
  const { titleValue, descriptionValue, doneValue } = detailValueCard;

  const [commentValue, setCommentValue] = useState("");
  const [editedCommentValue, setEditedCommentValue] = useState("");

  const [isClickEditHeading, setIsClickEditHeading] = useState(false);
  const [isClickEditDescription, setIsClickEditDescription] = useState(false);
  const [isClickEditComment, setIsClickEditComment] = useState(false);
  const [isClickWriteComment, setIsClickWriteComment] = useState(false);
  const [clickedCommentId, setClickedCommentId] = useState("");
  const [isShowFormDateTime, setIsShowFormDateTime] = useState(false);
  const refTitleValue = useRef<HTMLTextAreaElement>(null);
  const refDescriptionValue = useRef<HTMLTextAreaElement>(null);
  const refCommentValue = useRef<HTMLTextAreaElement>(null);
  const refEditCommentValue = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isClickEditHeading && refTitleValue.current) {
      refTitleValue.current.select();
    }
    if (isClickEditDescription && refDescriptionValue.current) {
      refDescriptionValue.current.focus();
    }
    if (isClickWriteComment && refCommentValue.current) {
      refCommentValue.current.focus();
    }
    if (isClickEditComment && refEditCommentValue.current) {
      refEditCommentValue.current.focus();
    }
  }, [
    isClickEditHeading,
    isClickEditDescription,
    isClickWriteComment,
    isClickEditComment
  ]);

  const filteredComments = comments
    .filter(oneComment => oneComment.cardId === id)
    .sort((a, b) => dayjs(b.datetime).unix() - dayjs(a.datetime).unix());

  const filteredLabels = labels.filter(oneLabel => oneLabel.cardId === id);

  const onChangeValueTitle = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDetailValueCard(prevDetailValueCard => ({
      ...prevDetailValueCard,
      titleValue: event.target.value
    }));
  };

  const onChangeDescriptionValue = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDetailValueCard(prevDetailValueCard => ({
      ...prevDetailValueCard,
      descriptionValue: event.target.value
    }));
  };

  const onAddCommentValue = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(event.target.value);
  };

  const onClickEditHeading = () => {
    setIsClickEditHeading(true);
  };

  const onBlurHandlerHeading = () => {
    if (titleValue) {
      setIsClickEditHeading(false);
    } else {
      toast.error("Název karty nesmí být prázdný!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        onClose: () => {
          refTitleValue.current?.focus();
        }
      });
      setIsShowDetailItem(true);
    }
  };

  const onClickEditDescription = () => {
    setIsClickEditDescription(true);
  };

  const onClickButtonClose = () => {
    setIsShowDetailItem(false);
    if (titleValue) {
      onUpdateDescriptionValue(descriptionValue);
      onUpdateTitleValue(titleValue);
      setIsShowDetailItem(false);
    }
  };

  const onBlurHandlerDescription = () => {
    setIsClickEditDescription(false);
  };

  const onClickWriteComment = () => {
    setIsClickWriteComment(true);
  };

  // const onClickCloseComment = () => {
  //   setIsClickWriteComment(false);
  //   setCommentValue("");
  // };

  // const onClickSaveComment = () => {
  //   if (commentValue) {
  //     setIsClickWriteComment(false);
  //     onAddNewComment(commentValue);
  //     setCommentValue("");
  //   } else {
  //     setIsClickWriteComment(true);
  //     toast.error("Nelze vložit prázdný text Comments!", {
  //       position: "top-center",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //       transition: Slide,
  //       onClose: () => {
  //         refEditCommentValue.current?.focus();
  //       }
  //     });
  //   }
  // };

  const onEditCommentValue = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setEditedCommentValue(event.target.value);
  };

  const onClickEditComment = (commentId: string, commentValue: string) => {
    setIsClickEditComment(true);
    setClickedCommentId(commentId);
    setEditedCommentValue(commentValue);
  };

  // const onClickSaveEditComment = () => {
  //   if (editedCommentValue) {
  //     setIsClickEditComment(false);
  //     onEditComment(clickedCommentId, editedCommentValue);
  //     setEditedCommentValue("");
  //   } else {
  //     setIsClickEditComment(true);
  //     toast.error("Nelze vložit prázdný text Comments!", {
  //       position: "top-center",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //       transition: Slide,
  //       onClose: () => {
  //         refEditCommentValue.current?.focus();
  //       }
  //     });
  //   }
  // };

  // const onClickCloseEditComment = () => {
  //   setIsClickEditComment(false);
  // };

  const handleClickDataTime = () => {
    setIsShowFormDateTime(true);
  };

  const termHeading =
    dateEnd !== "" && dateStart === ""
      ? "Date"
      : dateEnd === "" && dateStart !== ""
        ? "Datum zahájení"
        : "Data";

  const formDataTime =
    dateEnd !== "" && dateStart === ""
      ? `${dayjs(dateEnd).format("DD.MM.YYYY")} v ${dayjs(dateEnd).format("HH:mm")}`
      : dateEnd === "" && dateStart !== ""
        ? `${dayjs(dateStart).format("DD.MM.YYYY")}`
        : `${dayjs(dateStart).format("DD.MM.")} - ${dayjs(dateEnd).format("DD.MM.YYYY")} v ${dayjs(dateEnd).format("HH:mm")}`;

  const handleClickDone = () => {
    setDetailValueCard(prevDetailValueCard => ({
      ...prevDetailValueCard,
      doneValue: !doneValue
    }));
    onUpdateDone(!doneValue);
  };

  const termStatusTitle = done
    ? "Done"
    : dayjs(dateEnd).isSame(dayjs(), "day")
      ? "Today Date"
      : dayjs(dateEnd).isBefore(dayjs())
        ? "After Date"
        : "";

  // const classHeadlineCardDetail = done
  //   ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
  //   : dayjs(dateEnd).isSame(dayjs(), "day")
  //     ? "bg-amber-100 text-amber-800 dark:bg-amber-700 dark:text-amber-100"
  //     : dayjs(dateEnd).isBefore(dayjs())
  //       ? "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
  //       : "hidden";

  // const textStatus = done
  //   ? "Dokončeno"
  //   : dayjs(dateEnd).isSame(dayjs(), "day")
  //     ? "Končí dnes"
  //     : dayjs(dateEnd).isBefore(dayjs())
  //       ? "Neplněno"
  //       : "";

  const termStatusStyled = done
    ? "bg-green-700"
    : dayjs(dateEnd).isSame(dayjs(), "day")
      ? "bg-yellow-600"
      : dayjs(dateEnd).isBefore(dayjs())
        ? "bg-red-600"
        : "";

  return (
    <div className="sm:w-[80%] lg:w-[60%] min-h-[80%] bg-[#f1f2f4] text-[#172b4d] rounded-[8px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100]">
      {src && (
        <figure>
          <img
            className="sm:max-h-36 max-h-52 w-full rounded-t-[8px] object-cover"
            src={src}
            alt="***"
          />
        </figure>
      )}
      <div className="p-10 flex flex-col gap-4">
        <div>
          <div className="mx-[-10px] flex flex-row justify-between gap-2">
            {isClickEditHeading ? (
              <Textarea
                height="h-[40px]"
                padding="px-2 py-1"
                className="text-xl border-[2px] border-[#5881fd] font-semibold"
                textareaValue={titleValue}
                onChangeValue={onChangeValueTitle}
                onBlurHandler={onBlurHandlerHeading}
                refValue={refTitleValue}
              />
            ) : (
              <h2
                onClick={onClickEditHeading}
                className="px-[10px] w-full h-10 text-xl font-semibold flex items-center"
              >
                {titleValue}
              </h2>
            )}
            <div className="mr-2.5">
              <ButtonClose
                onClickButtonClose={onClickButtonClose}
                text={""}
                showText={false}
              />
            </div>
          </div>
          <p>
            In a column <span className="underline">{headline}</span>
          </p>
        </div>
        <div className="flex sm:flex-col md:flex-row gap-4">
          <div className="w-[100%] md:w-[80%]">
            {filteredLabels.length > 0 && (
              <div className="mt-0.5 mb-1.5">
                <h3 className="text-[12px] text-[#44546f] font-bold">Label</h3>
                <div className="mt-1.5 flex flex-row">
                  {filteredLabels.map(oneLabel =>
                    oneLabel.label.map(objLabel => (
                      <Label
                        color={objLabel.color}
                        title={objLabel.title}
                        key={objLabel.id}
                        showDetail={true}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
            {((dateEnd !== "" && dateStart === "") ||
              (dateEnd === "" && dateStart !== "") ||
              (dateEnd !== "" && dateStart !== "")) && (
              <div className="mt-0.5 mb-1.5">
                <h3 className="text-[12px] text-[#44546f] font-bold">{termHeading}</h3>
                <div className=" mt-1.5 flex flex-row items-center gap-2">
                  {(dayjs(dateEnd).isBefore(dayjs()) ||
                    dayjs(dateEnd).isSame(dayjs(), "day") ||
                    dayjs(dateEnd).isAfter(dayjs()) ||
                    done) && (
                    <input
                      className="inline-block w-4 h-4"
                      type="checkbox"
                      id="datatime"
                      name="datatime"
                      onClick={handleClickDone}
                      defaultChecked={done ? true : false}
                    />
                  )}
                  <div
                    className="px-[6px] py-3 w-auto bg-[#e5e6ea] hover:bg-[#d1d4db] text-[14px] font-semibold rounded-[3px] cursor-pointer flex flex-row items-center"
                    onClick={handleClickDataTime}
                  >
                    {formDataTime}
                    {(dayjs(dateEnd).isBefore(dayjs()) ||
                      dayjs(dateEnd).isSame(dayjs(), "day") ||
                      done) && (
                      <span
                        className={`ml-2 px-2 text-white ${termStatusStyled} rounded-[2px]`}
                      >
                        {termStatusTitle}
                      </span>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="ml-2 w-4 h-4 inline-block"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            {isShowFormDateTime && (
              <FormDataTime
                dateStart={dateStart}
                dateEnd={dateEnd}
                setIsShowFormDateTime={setIsShowFormDateTime}
                onSaveDateStart={onSaveDateStart}
                onSaveDateEnd={onSaveDateEnd}
              />
            )}
            <div className="mt-6">
              <h3 className="mb-4 font-semibold">Description</h3>
              {isClickEditDescription ? (
                <Textarea
                  padding="px-4 py-2"
                  textareaValue={descriptionValue}
                  onChangeValue={onChangeDescriptionValue}
                  onBlurHandler={onBlurHandlerDescription}
                  refValue={refDescriptionValue}
                />
              ) : descriptionValue ? (
                <div onClick={onClickEditDescription} className="cursor-pointer">
                  {descriptionValue}
                </div>
              ) : (
                <div
                  onClick={onClickEditDescription}
                  className="px-3 py-2 min-h-14 bg-[#e5e6ea] hover:bg-[#d1d4db] text-[14px] font-semibold rounded-[3px] cursor-pointer"
                >
                  {!descriptionValue ? "More detailed description..." : descriptionValue}
                </div>
              )}
            </div>
            <div className="mt-6">
              <h3 className="mb-4 font-semibold">Comments</h3>
              {isClickWriteComment ? (
                <>
                  <Textarea
                    padding="px-4 py-2"
                    textareaValue={commentValue}
                    onChangeValue={onAddCommentValue}
                    refValue={refCommentValue}
                  />
                  {/* <div className="flex flex-row gap-2">
                    <Button text="Save" onClickButton={onClickSaveComment} />{" "}
                    <ButtonClose
                      text="Discard "
                      showText={true}
                      onClickButtonClose={onClickCloseComment}
                    />
                  </div> */}
                </>
              ) : (
                <div
                  onClick={onClickWriteComment}
                  className="px-3 py-2 min-h-14 bg-[#e5e6ea] hover:bg-[#d1d4db] text-[14px] font-semibold rounded-[3px] cursor-pointer"
                >
                  {"Write a comment..."}
                </div>
              )}
              {filteredComments.map(oneComment => (
                <div key={oneComment.id}>
                  <p className="mt-6 mb-1 pl-2 text-[12px]">
                    {dayjs(oneComment.datetime).format("DD.MM.YYYY HH:mm")}
                  </p>
                  {isClickEditComment && clickedCommentId === oneComment.id ? (
                    <>
                      <Textarea
                        padding="px-4 py-2"
                        textareaValue={editedCommentValue}
                        onChangeValue={onEditCommentValue}
                        refValue={refEditCommentValue}
                      />
                      {/* <div className="flex flex-row gap-2">
                        <Button text="Save" onClickButton={onClickSaveEditComment} />
                        <ButtonClose
                          text="Discard changes"
                          showText={true}
                          onClickButtonClose={onClickCloseEditComment}
                        />
                      </div> */}
                    </>
                  ) : (
                    <Comment
                      id={oneComment.id}
                      comment={oneComment.comment}
                      editComment={() =>
                        onClickEditComment(oneComment.id, oneComment.comment)
                      }
                      deleteComment={() => onDeleteComment(oneComment.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="w-[100%] md:w-[20%] flex flex-col gap-6">
            <div>
              <h3 className="text-[12px] text-[#44546f] font-bold">Add to tab</h3>
              <div className="mt-2 flex flex-col gap-2">
                <button
                  className="px-1.5 py-3 h-8 w-full bg-[#e5e6ea] text-[14px] text-[#44546f] font-bold hover:bg-[#d1d4db] flex items-center gap-1 cursor-pointer"
                  title="Labels"
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6h.008v.008H6V6Z"
                    />
                  </svg>
                  <p>Labels</p>
                </button>
                <button
                  className="px-1.5 py-3 h-8 w-full bg-[#e5e6ea] text-[14px] text-[#44546f] font-bold hover:bg-[#d1d4db] flex gap-1 items-center cursor-pointe"
                  title="Date"
                  onClick={() => setIsShowFormDateTime(true)}
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <p>Date</p>
                </button>
                <button
                  className="px-1.5 py-3 h-8 w-full bg-[#e5e6ea] text-[14px] text-[#44546f] font-bold hover:bg-[#d1d4db] flex gap-1 items-center cursor-pointer"
                  title="Side dishes"
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                    />
                  </svg>
                  <p>Side dishes</p>
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-[12px] text-[#44546f] font-bold">Action</h3>
              <div className="mt-2 flex flex-col gap-2">
                <button
                  className="px-1.5 py-3 h-8 w-full bg-[#e5e6ea] text-[14px] text-[#44546f] font-bold hover:bg-[#d1d4db] flex gap-1 items-center cursor-pointer"
                  title="Move"
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                  <p>Move</p>
                </button>
                <button
                  className="px-1.5 py-3 h-8 w-full bg-[#e5e6ea] text-[14px] text-[#44546f] font-bold hover:bg-[#d1d4db] flex gap-1 items-center cursor-pointer"
                  title="Copy"
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                    />
                  </svg>
                  <p>Copy</p>
                </button>
                <hr className="border-1 border-[#d1d4dB]"></hr>
                <button
                  className="px-1.5 py-3 h-8 w-full bg-[#e5e6ea] text-[14px] text-[#44546f] font-bold hover:bg-[#d1d4db] flex gap-1 items-center cursor-pointer"
                  title="Archive"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                    />
                  </svg>
                  <p>Archive</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
