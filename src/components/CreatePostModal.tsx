/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  closePostModal,
  selectPostType,
  goBack,
} from "@/redux/features/postModal/postModalSlice";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PostDealModal from "@/components/post-modals/PostDealModal";
import PostEventModal from "@/components/post-modals/PostEventModal";
import PostServiceModal from "@/components/post-modals/PostServiceModal";
import PostAlertModal from "@/components/post-modals/PostAlertModal";
import Image from "next/image";

export default function CreatePostModal() {
  const dispatch = useDispatch();
  const { isOpen, selectedPostType } = useSelector(
    (state: any) => state.postModal,
  );

  const handleClose = () => dispatch(closePostModal());
  const handleBack = () => dispatch(goBack());

  if (selectedPostType === "deal")
    return (
      <PostDealModal
        isOpen={isOpen}
        onClose={handleClose}
        onBack={handleBack}
      />
    );
  if (selectedPostType === "event")
    return (
      <PostEventModal
        isOpen={isOpen}
        onClose={handleClose}
        onBack={handleBack}
      />
    );
  if (selectedPostType === "service")
    return (
      <PostServiceModal
        isOpen={isOpen}
        onClose={handleClose}
        onBack={handleBack}
      />
    );
  if (selectedPostType === "alert")
    return (
      <PostAlertModal
        isOpen={isOpen}
        onClose={handleClose}
        onBack={handleBack}
      />
    );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md p-0 top-70'>
        <div className='p-6'>
          <h2 className='text-xl font-semibold text-center text-[#1F2937] mb-8'>
            Create Post
          </h2>
          <div className='grid grid-cols-2 gap-4'>
            {[
              {
                type: "event",
                src: "/nav/event.svg",
                label: "Event",
                desc: "Share upcoming activities, concerts, meetups",
                w: 41,
                h: 42,
              },
              {
                type: "deal",
                src: "/nav/deal.svg",
                label: "Deal",
                desc: "Promote discounts, specials, flash offers",
                w: 45,
                h: 44,
              },
              {
                type: "service",
                src: "/nav/service.svg",
                label: "Service",
                desc: "Add professional services with availability & pricing",
                w: 45,
                h: 44,
              },
              {
                type: "alert",
                src: "/nav/alerts.svg",
                label: "Alerts",
                desc: "Quick community updates (road closures, lost pet)",
                w: 45,
                h: 44,
              },
            ].map(({ type, src, label, desc, w, h }) => (
              <Button
                key={type}
                variant='outline'
                className='h-32 flex flex-col items-center justify-center gap-2 bg-[#E8FAEA] hover:bg-green-100'
                onClick={() => dispatch(selectPostType(type as any))}
              >
                <Image src={src} alt={label} width={w} height={h} />
                <div className='text-center'>
                  <div className='font-bold text-base text-[#374151]'>
                    {label}
                  </div>
                  <div className='text-xs text-[#4B5563] text-wrap'>{desc}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import PostDealModal from "@/components/post-modals/PostDealModal";
// import PostEventModal from "@/components/post-modals/PostEventModal";
// import PostServiceModal from "@/components/post-modals/PostServiceModal";
// import PostAlertModal from "@/components/post-modals/PostAlertModal";
// import Image from "next/image";

// interface CreatePostModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// type PostType = "deal" | "event" | "service" | "alert" | null;

// export default function CreatePostModal({
//   isOpen,
//   onClose,
// }: CreatePostModalProps) {
//   const [selectedPostType, setSelectedPostType] = useState<PostType>(null);

//   const handlePostTypeSelect = (type: PostType) => {
//     setSelectedPostType(type);
//   };

//   const handleBack = () => {
//     setSelectedPostType(null);
//   };

//   const handleModalClose = () => {
//     setSelectedPostType(null);
//     onClose();
//   };

//   if (selectedPostType === "deal") {
//     return (
//       <PostDealModal
//         isOpen={isOpen}
//         onClose={handleModalClose}
//         onBack={handleBack}
//       />
//     );
//   }

//   if (selectedPostType === "event") {
//     return (
//       <PostEventModal
//         isOpen={isOpen}
//         onClose={handleModalClose}
//         onBack={handleBack}
//       />
//     );
//   }

//   if (selectedPostType === "service") {
//     return (
//       <PostServiceModal
//         isOpen={isOpen}
//         onClose={handleModalClose}
//         onBack={handleBack}
//       />
//     );
//   }

//   if (selectedPostType === "alert") {
//     return (
//       <PostAlertModal
//         isOpen={isOpen}
//         onClose={handleModalClose}
//         onBack={handleBack}
//       />
//     );
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={handleModalClose}>
//       <DialogContent className='sm:max-w-md p-0 top-70'>
//         <div className='p-6'>
//           <h2 className='text-xl font-semibold text-center text-[#1F2937] mb-8'>
//             Create Post
//           </h2>

//           <div className='grid grid-cols-2 gap-4'>
//             {/* Event */}
//             <Button
//               variant='outline'
//               className='h-32 flex flex-col items- justify- gap-2 bg-[#E8FAEA] hover:bg-green-100'
//               onClick={() => handlePostTypeSelect("event")}
//             >
//               <div>
//                 <Image
//                   src='/nav/event.svg'
//                   alt='event'
//                   width={41}
//                   height={42}
//                   className=''
//                 />
//               </div>
//               <div className='text-center'>
//                 <div className='font-bold text-base text-[#374151]'>Event</div>
//                 <div className='text-xs text-[#4B5563] text-wrap'>
//                   Share upcoming activities, concerts, meetups
//                 </div>
//               </div>
//             </Button>

//             {/* Deal */}
//             <Button
//               variant='outline'
//               className='h-32 flex flex-col items-center justify-center gap-2 bg-[#E8FAEA] hover:bg-green-100'
//               onClick={() => handlePostTypeSelect("deal")}
//             >
//               <div>
//                 <Image
//                   src='/nav/deal.svg'
//                   alt='event'
//                   width={45}
//                   height={44}
//                   className=''
//                 />
//               </div>
//               <div className='text-center'>
//                 <div className='font-bold text-base text-[#374151]'>Deal</div>
//                 <div className='text-xs text-[#4B5563] text-wrap'>
//                   Promote discounts, specials, flash offers
//                 </div>
//               </div>
//             </Button>

//             {/* Service */}
//             <Button
//               variant='outline'
//               className='h-32 flex flex-col items-center justify-center gap-2 bg-[#E8FAEA] hover:bg-green-100'
//               onClick={() => handlePostTypeSelect("service")}
//             >
//               <div>
//                 <Image
//                   src='/nav/service.svg'
//                   alt='event'
//                   width={45}
//                   height={44}
//                   className=''
//                 />
//               </div>
//               <div className='text-center'>
//                 <div className='font-bold text-base text-[#374151]'>
//                   Service
//                 </div>
//                 <div className='text-xs text-[#4B5563] text-wrap'>
//                   Add professional services with availability & pricing
//                 </div>
//               </div>
//             </Button>

//             {/* Alerts */}
//             <Button
//               variant='outline'
//               className='h-32 flex flex-col items-center justify-center gap-2 bg-[#E8FAEA] hover:bg-green-100'
//               onClick={() => handlePostTypeSelect("alert")}
//             >
//               <div>
//                 <Image
//                   src='/nav/alerts.svg'
//                   alt='event'
//                   width={45}
//                   height={44}
//                   className=''
//                 />
//               </div>
//               <div className='text-center'>
//                 <div className='font-bold text-base text-[#374151]'>Alerts</div>
//                 <div className='text-xs text-[#4B5563] text-wrap'>
//                   Quick community updates (road closures, lost pet)
//                 </div>
//               </div>
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
