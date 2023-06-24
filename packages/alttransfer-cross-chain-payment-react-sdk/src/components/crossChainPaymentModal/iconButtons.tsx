import { ChevronRight, ChevronLeft, XIcon } from "lucide-react";

const size = "1.5em";
export const CrossIconButton = () => {
  return <XIcon width={size} height={size} />;
};

export const RightIconButton = () => {
  return <ChevronRight width={size} height={size} />;
};
export const LeftIconButton = () => {
  return <ChevronLeft width={size} height={size} />;
};
