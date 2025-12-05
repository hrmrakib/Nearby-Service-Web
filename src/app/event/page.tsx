"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Eye,
  Users,
  Heart,
  Star,
  Bookmark,
  MoreHorizontal,
  Clock,
} from "lucide-react";

interface EventDetailPageProps {
  eventId: string;
}

export default function EventDetailPage({ eventId }: EventDetailPageProps) {
  const [isAttending, setIsAttending] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const eventImages = [
    "/event/1.jpg",
    "/event/2.jpg",
    "/event/3.jpg",
    "/event/4.jpg",
  ];

  const relatedPosts = [
    {
      id: 1,
      title: "Live Jazz Night",
      image: "/event/1.jpg",
      rating: 4.9,
      distance: "2.3 miles",
    },
    {
      id: 2,
      title: "Cozy Coffee Spot",
      image: "/event/2.jpg",
      rating: 4.9,
      distance: "2.3 miles",
    },
    {
      id: 3,
      title: "Live Jazz Night",
      image: "/event/3.jpg",
      rating: 4.9,
      distance: "2.3 miles",
    },
    {
      id: 4,
      title: "Cozy Coffee Spot",
      image: "/event/4.jpg",
      rating: 4.9,
      distance: "2.3 miles",
    },
  ];

  const attendees = [
    { id: 1, name: "John", avatar: "/profile.png" },
    { id: 2, name: "Sarah", avatar: "/profile.png" },
    { id: 3, name: "Mike", avatar: "/profile.png" },
    { id: 4, name: "Emma", avatar: "/profile.png" },
  ];

  return (
    <div className='min-h-screen bg-[#F3F4F6]'>
      <div className='container mx-auto py-6 px-4 lg:px-0'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Image Gallery */}
            <div className='space-y-4'>
              <div className='relative aspect-[3/2] rounded-xl overflow-hidden'>
                <Image
                  src={eventImages[selectedImage] || "/event/main-img.png"}
                  alt='Event main image'
                  fill
                  className='object-cover'
                />
              </div>

              <div className='flex items-center gap-4 overflow-x-auto pb-1'>
                {eventImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-[200px] h-[200px] relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Event image ${index + 1}`}
                      width={200}
                      height={200}
                      className='object-cover w-full h-full'
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Event Info */}
            <div className='space-y-4 bg-[#F3FFF4] p-6 rounded-xl'>
              <div className='flex items-start justify-between'>
                <h1 className='text-3xl font-bold text-gray-900'>
                  Night at Casa Verde
                </h1>
                <Button variant='ghost' size='icon'>
                  <MoreHorizontal className='h-5 w-5' />
                </Button>
              </div>

              <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600'>
                <div className='flex items-center gap-1'>
                  <MapPin className='h-4 w-4' />
                  <span>0.8 mi</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='h-4 w-4' />
                  <span>Tonight 6:00 PM</span>
                </div>
                <div className='flex items-center gap-1'>
                  <MapPin className='h-4 w-4 text-[#15B826]' />
                  <span>2118 Thornridge Cir</span>
                </div>
              </div>

              <div className='flex items-center gap-6'>
                <div className='flex items-center gap-1'>
                  <div className='flex'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= 4
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-sm font-medium'>4.7</span>
                </div>

                <div className='flex items-center gap-4 text-sm text-gray-600'>
                  <div className='flex items-center gap-1'>
                    <Eye className='h-4 w-4' />
                    <span>100+</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Users className='h-4 w-4' />
                    <span>50+</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Heart className='h-4 w-4' />
                    <span>23</span>
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <span className='text-sm text-gray-600'>Post by:</span>
                  <div className='flex items-center gap-2'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src='/jacob-jones-profile.jpg' />
                      <AvatarFallback>JJ</AvatarFallback>
                    </Avatar>
                    <span className='text-sm font-medium'>Jacob Jones</span>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-600'>Attending</span>
                  <div className='flex -space-x-2'>
                    {attendees.map((attendee) => (
                      <Avatar
                        key={attendee.id}
                        className='h-8 w-8 border-2 border-white'
                      >
                        <AvatarImage
                          src={attendee.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className='text-sm text-[#15B826] font-medium'>
                    See all
                  </span>
                </div>
              </div>

              <div className='flex gap-3'>
                <Button
                  className='flex-1 bg-[#15B826] hover:bg-green-700'
                  onClick={() => setIsAttending(!isAttending)}
                >
                  {isAttending ? "Attending" : "Attending"}
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setIsSaved(!isSaved)}
                  className={`w-32 bg-transparent border border-[#15B826] text-[#15B826] ${
                    isSaved ? "border-[#15B826] text-[#15B826]" : ""
                  }`}
                >
                  <Bookmark className='h-4 w-4' /> Save
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-32 bg-transparent border border-[#15B826] text-[#15B826] ${
                    isLiked ? "border-red-500 text-red-500" : ""
                  }`}
                >
                  <Heart className='h-4 w-4' /> Like
                </Button>
              </div>
            </div>

            {/* About Section */}
            <div className='space-y-4 bg-white p-6 rounded-xl'>
              <h2 className='text-2xl lg:text-[36px] font-semibold text-[#1F2937]'>
                About The Event
              </h2>
              <div className='space-y-6 text-[#374151] text-lg leading-loose'>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Pellentesque lacus in
                  orci pharetra. Ipsum augue nunc vitae in pellentesque id leo
                  morbi dignissim. Odio massa lacus facilisis eget duis
                  adipiscing magna porttitor ante. Amet elit euismod magna hac
                  nisl pellentesque adipiscing arcu mauris. Neque mi volutpat
                  erat id sapien. Cursus consectetur at integer nisl dolor
                  varius posuere enim. Non nibh odio molestie magna ornare nibh
                  in ut quis. Amet elementum eget velit malesuada semper proin
                  scelerisque a. Massa quam nulla ut quam ut blandit aliquet.
                  Egestas elit tincidunt ut lacinia. Convallis facilisis leo
                  pretium vel condimentum dolor morbi nibh. Enim mattis
                  fermentum cursus ut iaculis.
                </p>

                <p>
                  Turpis nibh volutpat at vitae. Non varius urna turpis
                  habitant. Pellentesque enim dignissim neque vitae. Porttitor
                  congue posuere interdum nibh pellentesque placerat. Egestas
                  urna consectetur cursus convallis. At est a ut augue mauris mi
                  egestas. In ac dapibus sed libero sed elit pretium gravida
                  pulvinar. Quam elementum ornare nisl ac.
                </p>

                <p>
                  Congue varius aliquam felis in tempor diam quis at lorem.
                  Neque volutpat lacus in viverra in tristique purus tempus
                  ipsum. Sem imperdiet orci fringilla et quis. Vitae pulvinar ut
                  id sollicitudin nunc mi pharetra tristique sed. Gravida cras
                  dui at elit etiam. Nunc imperdiet fringilla ac a. Diam neque
                  nisl dis cursus cras vitae fermentum congue. Sollicitudin
                  egestas arcu lectus sed sollicitudin egestas porttitor. Etiam
                  varius sit facilisis et nullam. Rhoncus hac ipsum justo
                  placerat. Enim molestie nisl orci habitant elit ultricies
                  lacus maecenas.
                </p>

                <p>
                  Voluptate incidunt quo, hic totam unde molestiae ratione
                  tempore facere placeat error odio repellendus quidem illum
                  inventore esse, repudiandae nulla! Unde libero placeat debitis
                  accusantium suscipit illo officia tempora amet? Sequi mollitia
                  deserunt voluptas ex et eaque sit quidem deleniti alias
                  aliquam nesciunt autem quo nihil, doloribus odit dolore
                  suscipit vel facilis? Commodi molestiae ipsam aspernatur amet
                  reprehenderit voluptate libero ducimus dolorem illo laboriosam
                  pariatur dolores sit ipsum dignissimos veniam quo nesciunt
                  esse modi quos eius soluta facere, voluptatibus eligendi!
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Map */}
            <Card className='p-4'>
              <h3 className='text-center text-2xl font-bold text-[#374151] mb-3'>
                Map
              </h3>
              <div className='relative aspect-squar rounded-lg overflow-hidden mb-3'>
                <Image
                  src='/map.png'
                  alt='Event location map'
                  width={400}
                  height={400}
                  className='object-cover w-full h-full rounded-lg'
                />
              </div>
              <p className='text-sm text-gray-600 text-center'>
                3517 W. Gray St. Utica,
                <br />
                Pennsylvania 57867
              </p>
            </Card>

            {/* Related Posts */}
            <Card className='p-4 bg-transparent shadow-none border-none'>
              <h3 className='font-semibold text-gray-900 mb-4'>
                Related Posts
              </h3>
              <div className='space-y-8'>
                {relatedPosts.map((post) => (
                  <div
                    key={post.id}
                    className='bg-white shadow-md rounded-2xl flex flex-col gap-3'
                  >
                    <div className='relative w-full h-48 rounded-lg overflow-hidden flex-shrink-0'>
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1 min-w-0 p-5'>
                      <h4 className='font-semibold text-[#374151] text-2xl truncate mb-3'>
                        {post.title}
                      </h4>
                      <div className='flex items-center gap-3 mt-1'>
                        <div className='flex'>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className='h-6 w-6 fill-[#17CA2A] text-[#17CA2A]'
                            />
                          ))}
                        </div>
                        <span className='text-lg font-medium text-[#374151]'>
                          {post.rating}
                        </span>
                        <span className='text-lg font-medium text-[#374151]'>
                          • {post.distance}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
