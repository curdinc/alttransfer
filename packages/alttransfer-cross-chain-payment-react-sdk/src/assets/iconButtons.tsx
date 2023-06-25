import { ChevronLeft, ChevronRight, UserCircle2, XIcon } from "lucide-react";

const size = "1.5em";
export const CrossIconButton = () => {
  return <XIcon width={size} height={size} strokeWidth={2.5} />;
};

export const RightIconButton = () => {
  return <ChevronRight width={size} height={size} strokeWidth={2.5} />;
};
export const LeftIconButton = () => {
  return <ChevronLeft width={size} height={size} strokeWidth={2.5} />;
};

export const ProfileEmptyIcon = () => {
  return <UserCircle2 width={"1.75em"} height={"1.75em"} strokeWidth={2} />;
};
