/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AboutEvent from "@/components/event/AboutEvent";
import CommentsSection from "@/components/event/Comments";
import LocationCard from "@/components/event/LocationCard";
import MomentsSection from "@/components/event/Moments";
import RelatedCard from "@/components/event/RelatedCard";
import ReviewSection from "@/components/event/ReviewSection";
import UnlockNextJurnee from "@/components/event/UnlockNextJurnee";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import ReportModal from "@/components/modal/ReportModal";
import AddressDisplay from "@/components/share/AddressDisplay";
import { useAuth } from "@/hooks/useAuth.ts";
import { useNewChatMutation } from "@/redux/features/chat/chatAPI";
import {
  setChatId,
  setNewChatStart,
  setSelectedUser,
} from "@/redux/features/chat/chatSlice";
import {
  useDeletePostMutation,
  useGetPostDetailByIdQuery,
} from "@/redux/features/post/postAPI";
import { useGetReviewsByPostIdQuery } from "@/redux/features/review/reviewAPI";
import formatDate from "@/utils/formatDate";
import getDistanceMiles from "@/utils/getDistanceMiles";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Calendar,
  Eye,
  Loader,
  MapPin,
  MessageSquareText,
  Pencil,
  Trash,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  openPostModal,
  selectPostType,
  setDataForPostUpdate,
  setIsEditMode,
} from "@/redux/features/postModal/postModalSlice";

export default function EventDetailPage() {
  const router = useRouter();
  const { userLat, userLng } = useAuth();

  const id = useParams().id as string;
  const [imagePreview, setImagePreview] = useState("");

  const [attended, setAttended] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAttendingModal, setShowAttendingModal] = useState(false);

  const [newChatMutation] = useNewChatMutation();
  const [deletePostMutation, { isLoading: deletePostLoading }] =
    useDeletePostMutation();

  const { data, isLoading } = useGetPostDetailByIdQuery(id);

  const { data: reviewsData } = useGetReviewsByPostIdQuery(id);
  const dispatch = useDispatch();

  const reviews = reviewsData?.data;

  const postDetail = data?.data?.detail;
  const relevantPosts = data?.data?.relevantPosts;

  const {
    isOpen,
    selectedPostType,
    data: postData,
    isEditMode,
  } = useSelector((state: any) => state.postModal);

  console.log({ isOpen, selectedPostType, postData, isEditMode });

  const thumbnails = postDetail?.media?.filter((m: string) =>
    /\.(jpg|jpeg|png|webp)(\?.*)?$/i?.test(m),
  );

  useEffect(() => {
    if (postDetail?.image) {
      setImagePreview(postDetail?.image);
    }
  }, [postDetail]);

  const handleReport = () => {
    setReportOpen(true);
  };

  const handleChatStart = async () => {
    try {
      const res = await newChatMutation({
        member: postDetail?.author?._id,
      }).unwrap();

      console.log({ res });

      if (res?.success) {
        dispatch(setChatId(res?.data?._id));
        dispatch(
          setSelectedUser({
            members: [res?.data?.members[1]],
          }),
        );
        dispatch(setNewChatStart(true));
        router.push(`/messages`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deletePostMutation(id).unwrap();

      if (res?.success) {
        toast.success(res?.message);
        setShowDeleteModal(false);
        router.push("/profile");
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text='event' />;
  }

  return (
    <div className='min-h-screen bg-[#F3F4F6]'>
      <div className='relative w-full'>
        {/* Hero Section */}
        <div className='relative w-full h-56 md:h-128 overflow-hidden bg-card'>
          <Image
            src={imagePreview}
            alt='Night at Casa Verde'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>

          {/* Title */}
          <div className='absolute bottom-6 left-6 md:left-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
              {postDetail?.title || "No title"}
            </h1>
            <h1 className='text-base md:text-xl font-medium text-white mb-2 capitalize'>
              {postDetail?.category || "No category"}
            </h1>
            <div className='flex flex-wrap gap-2 text-white text-xs md:text-sm'>
              <div className='flex items-center gap-2'>
                <MessageSquareText className='w-5 h-5' />
                <span className='font-semibold'>
                  {postDetail?.category === "event"
                    ? postDetail?.reviewsCount + " comments"
                    : postDetail?.reviewsCount + " reviews"}
                </span>
                <span>•</span>
                <a href='#see-all' className='hover:underline'>
                  See all
                </a>
              </div>

              <div className='flex items-center gap-2'>
                <MapPin className='w-5 h-5 text-[#108F1E]' />
                <span className='font-semibold'>
                  {" "}
                  {getDistanceMiles(
                    userLat!,
                    userLng!,
                    postDetail?.location?.coordinates[1],
                    postDetail?.location?.coordinates[0],
                  ).toFixed(1)}{" "}
                  miles
                </span>
                <span>•</span>
                <AddressDisplay
                  key={postDetail?.address}
                  address={postDetail?.address ?? ""}
                />
              </div>

              <div className='flex items-center gap-2'>
                <Calendar className='w-5 h-5' />
                <span className='font-semibold'>
                  {formatDate(postDetail?.createdAt)}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Eye className='w-5 h-5' />
                <span className='font-semibold'>
                  {postDetail?.views}+ Views
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Photos Bottom Right — outside overflow-hidden, on top of all */}
        <div className='absolute -bottom-4 md:-bottom-8 right-6 flex gap-5 z-[500]'>
          {thumbnails?.map((thumb: string, idx: number) => (
            <div
              key={idx}
              className='w-12 lg:w-24 h-12 lg:h-24 rounded-lg overflow-hidden shadow-lg'
              onClick={() => setImagePreview(thumb)}
            >
              <Image
                src={thumb}
                alt={`Thumbnail ${idx + 1}`}
                width={96}
                height={96}
                className='w-full h-full object-cover'
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className='bg-white'
        style={{ boxShadow: "0 5px 6px rgba(0, 0, 0, 0.1)" }}
      >
        <div className='container mx-auto bg-white flex flex-col items-start justify-center p-4 font-sans'>
          {/* Action Bar */}
          <div className='w-full max-w-2xl bg-white rounded-2xl px-4 py-3'>
            <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
              {/* Action - Boost Button */}
              <button
                onClick={() => router.push(`/boost-post/${postDetail?._id}`)}
                disabled={postDetail?.boost}
                className={`
                  flex-1 min-w-0 flex items-center justify-center gap-2
                  px-4 py-3 rounded-xl font-semibold text-sm sm:text-base
                  transition-all duration-200 active:scale-95 select-none disabled:opacity-50 
                    ${
                      attended
                        ? "bg-green-700 text-white shadow-inner"
                        : "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
                    }
                  `}
              >
                <span
                  className={`transition-transform duration-200 ${attended ? "scale-110" : ""}`}
                ></span>
                <span className='truncate'>
                  {postDetail?.boost ? "Boosted" : "Boost"}
                </span>
              </button>

              <div className='flex-1 flex items-center gap-6'>
                {/* Action - Edit & Delete Button */}
                <button
                  onClick={() => {
                    dispatch(openPostModal());
                    dispatch(selectPostType(postDetail?.category));
                    dispatch(setDataForPostUpdate(postDetail));
                    dispatch(setIsEditMode(true));
                  }}
                  className={`flex-1 w-full flex items-center justify-center gap-1.5
              px-3 sm:px-4 py-3 h-11 sm:h-12 rounded-xl border-2 font-medium text-sm sm:text-base
              transition-all duration-200 active:scale-95 select-none
              border-green-500 text-green-500 hover:bg-green-50`}
                >
                  <Pencil size={16} />
                  <span className='text-[#1F2937]'>Edit</span>
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className={`flex-1 w-full flex items-center justify-center gap-1.5
              px-3 sm:px-4 py-3 h-11 sm:h-12 rounded-xl border-2 font-medium text-sm sm:text-base
              transition-all duration-200 active:scale-95 select-none
              border-green-500 text-green-500 hover:bg-green-50`}
                >
                  <Trash size={16} />
                  <span className='text-[#1F2937]'>Delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Demo label */}
          <style jsx global>{`
            @keyframes fade-in-down {
              from {
                opacity: 0;
                transform: translateY(-8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in-down {
              animation: fade-in-down 0.2s ease-out;
            }
          `}</style>
        </div>
      </div>

      <div className='container mx-auto px-4 py-6 md:py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-7 gap-6 md:gap-8 lg:gap-36'>
          {/* Left Column */}
          <div className='lg:col-span-4 space-y-6'>
            {postDetail?.category === "event" && (
              <div>
                <h2 className='text-lg font-bold text-[#1F2937] tracking-tight mb-3'>
                  Attending{" "}
                </h2>
                <div className='flex items-center gap-1'>
                  {postDetail?.attenders?.length > 0 && (
                    <>
                      <AvatarGroup className='grayscale'>
                        {postDetail?.attenders
                          ?.slice(0, 2)
                          ?.map((attender: any, index: number) => (
                            <Avatar key={index}>
                              <AvatarImage
                                src={attender?.image}
                                alt={attender?.name || "attender"}
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                          ))}
                        {postDetail?.attenders?.length > 2 && (
                          <AvatarGroupCount>
                            +{postDetail?.attenders?.length - 2}
                          </AvatarGroupCount>
                        )}
                      </AvatarGroup>
                      {postDetail?.attenders?.length > 0 && (
                        <button
                          onClick={() => setShowAttendingModal(true)}
                          className='text-sm font-semibold pl-4 text-[#108F1E]'
                        >
                          See all
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Event Details */}
            <AboutEvent postDetail={postDetail} />
            <MomentsSection postId={id} />

            {postDetail?.category === "service" ? (
              <ReviewSection reviews={reviews} />
            ) : (
              <CommentsSection id='comments' postId={id} />
            )}
          </div>

          {/* Right Sidebar */}
          <div className='lg:col-span-3 space-y-4'>
            <LocationCard
              address={postDetail?.address}
              lat={90.39064309999999}
              lng={23.7511665}
              haveServiceAreas={false}
              className='justify-end'
            />

            <RelatedCard
              userLng={userLng}
              userLat={userLat}
              relevantPosts={relevantPosts}
            />

            <UnlockNextJurnee />
          </div>
        </div>
      </div>

      {/* report modal */}
      <ReportModal
        postId={id}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={handleReport}
      />

      {/* Attending Modal */}
      <Dialog open={showAttendingModal} onOpenChange={setShowAttendingModal}>
        <DialogContent className='max-w-sm mx-auto max-h-[80vh] p-0'>
          <DialogHeader className='p-4 pb-2 border-b'>
            <div className='flex items-center justify-between'>
              <DialogTitle className='text-lg font-semibold'>
                Attending ({postDetail?.attenders?.length})
              </DialogTitle>
              <button
                onClick={() => setShowAttendingModal(false)}
                className='p-1 hover:bg-gray-100 rounded-full'
              >
                {/* <X className='w-5 h-5' /> */}
              </button>
            </div>
          </DialogHeader>
          <div className='overflow-y-auto max-h-96 p-4'>
            <div className='space-y-3'>
              {postDetail?.attenders?.map((user: any, index: number) => (
                <div
                  key={index}
                  className='flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <Avatar className='w-10 h-10'>
                      <AvatarImage src={user?.image} alt={user?.name} />
                      <AvatarFallback className='bg-green-100 text-green-700 font-semibold'>
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className='font-medium text-[#1F2937]'>
                      {user?.name}
                    </span>
                  </div>

                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => handleChatStart()}
                      className='flex items-center gap-3 text-sm font-semibold text-[#108F1E] border border-[#108F1E] px-3 py-1 rounded-full'
                    >
                      Chat <MessageSquareText size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className='sm:max-w-sm p-0 overflow-hidden border-0 shadow-2xl rounded-2xl'>
          <div className='relative'>
            <div className='px-6 pt-6 pb-5'>
              {/* Icon */}
              <div className='flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-100 mx-auto mb-4'>
                <Trash2 className='w-5 h-5 text-red-500' />
              </div>

              <DialogHeader className='text-center space-y-1.5 mb-5'>
                <DialogTitle className='text-[17px] font-bold text-gray-900 tracking-tight'>
                  Delete Confirmation
                </DialogTitle>
                <DialogDescription className='text-sm text-gray-500 leading-relaxed'>
                  Are you sure you want to delete this item? <br />
                  This action{" "}
                  <span className='text-red-500 font-semibold'>
                    cannot be undone
                  </span>
                  .
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className='flex gap-2 sm:gap-2'>
                <DialogClose asChild>
                  <Button
                    variant='outline'
                    className='flex-1 h-10 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm'
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleDelete}
                  disabled={deletePostLoading}
                  type='submit'
                  className='flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow-md shadow-red-200 transition-all active:scale-[0.98]'
                >
                  Yes, Delete{" "}
                  {deletePostLoading && <Loader className='animate-spin' />}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
