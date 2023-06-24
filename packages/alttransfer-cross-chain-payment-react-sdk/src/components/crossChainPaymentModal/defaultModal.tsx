// import React, { ReactNode, useState } from "react";
// import * as Dialog from "@radix-ui/react-dialog";
// import SelectToken from "./selectToken";
// import HomePage from "./homepage";
// import ModifyWallet from "./modifyWallet";
// import SelectChain from "./selectChain";
// import "./defaultModal.css";



// interface modalProps {
//   children: React.ReactNode;
//   transferAmount: string;
// }

// const DialogDemo: React.FC<modalProps> = (props) => {
//   const [currentScreen, setCurrentScreen] = useState(pages.HomeScreen);
//   const [curChain, setCurChain] = useState("Fantom");



//   return (
//     <Dialog.Root>
//       <Dialog.Trigger asChild>{props.children}</Dialog.Trigger>
//       <Dialog.Portal>
//         <Dialog.Overlay className="DialogOverlay" />
//         {renderPage()}
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// };

// export default DialogDemo;
