import {
  LoadingGif,
  ConfirmationModal,
  ResponseModal,
} from "@/components/Modal/index";

type ChangeModalContentProps = {
  template: string;
  templates: { [key: string]: JSX.Element };
  onOpen: () => void;
  setCurrentTemplate: (template: string) => void;
};

export const changeModalContent = ({
  template,
  templates,
  onOpen,
  setCurrentTemplate,
}: ChangeModalContentProps) => {
  if (template in templates) {
    onOpen();
    setCurrentTemplate(template);
  }
};

//===================================================
//===================================================
type ModalTemplateType = {
  [key: string]: JSX.Element;
  "01": JSX.Element;
  "02": JSX.Element;
  "03": JSX.Element;
};

type ResponseT = {
  isError: boolean;
  message: string;
};

type ModalTemplateProps = {
  onCancle: () => void;
  onContinue: () => void;
  confirmationMessage: string;
  response: ResponseT;
};

export const ModalTemplates = ({
  onCancle,
  onContinue,
  confirmationMessage,
  response,
}: ModalTemplateProps): ModalTemplateType => {
  return {
    "01": <LoadingGif />,
    "02": (
      <ConfirmationModal
        onCancle={onCancle}
        onContinue={onContinue}
        message={confirmationMessage}
      />
    ),
    "03": (
      <ResponseModal isError={response.isError} message={response.message} />
    ),
  };
};

export default ModalTemplates;
