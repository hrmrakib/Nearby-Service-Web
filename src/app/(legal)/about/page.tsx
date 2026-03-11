"use client";

import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { useGetCommunityGuidelinesQuery } from "@/redux/features/community/communityGuidelineAPI";

const AboutPage = () => {
  const { data, isLoading } = useGetCommunityGuidelinesQuery({});

  console.log({ data });

  return (
    <div className='bg-[#F3F4F6] min-h-[90vh]'>
      <div className='container mx-auto'>
        <h2 className='text-center text-xl md:text-2xl text-[#15B826] font-bold pt-8 pb-5'>
          About
        </h2>

        <div className='mt-4 space-y-10 text-white text-lg md:text-xl'>
          {isLoading && <LoadingSpinner />}

          {!isLoading && data?.description && (
            <div dangerouslySetInnerHTML={{ __html: data?.description }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
