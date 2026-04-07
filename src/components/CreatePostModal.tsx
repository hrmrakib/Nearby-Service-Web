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
      <DialogContent className='sm:max-w-md p-0 top-69'>
        <div className='p-6'>
          <h2 className='text-xl font-semibold text-center text-[#1F2937] mb-6'>
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
                className='h-32 flex flex-col items-center justify-center gap-2 bg-[#F3F4F6] hover:bg-[#f3f4f6c2] border-none'
                onClick={() => dispatch(selectPostType(type as any))}
              >
                <Image src={src} alt={label} width={w} height={h} />
                <div className='text-center'>
                  <div className='font-bold text-base text-[#374151]'>
                    {label}
                  </div>
                  <div className='font-normal text-xs text[#4B5563] text-wrap'>
                    {desc}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
