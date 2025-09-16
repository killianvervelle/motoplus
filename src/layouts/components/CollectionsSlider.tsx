'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from 'react-icons/hi'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import LoadingCategory from './loadings/skeleton/SkeletonCategory'

export const dynamic = 'force-dynamic';

const CollectionsSlider = ({ collections }: { collections: any }) => {
  const [, setInit] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [collectionsData, setCollectionsData] = useState([])
  const [loadingCollectionsData, setLoadingCollectionsData] = useState(true)

  const prevRef = useRef(null)
  const nextRef = useRef(null)

  useEffect(() => {
    setCollectionsData(collections)
    setLoadingCollectionsData(false)
  }, [collections])

  if (loadingCollectionsData) {
    return <LoadingCategory />
  }

  return (
    <div className='relative' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Swiper
        modules={[Pagination, Navigation]}
        // navigation={true}
        slidesPerView={2}
        spaceBetween={10}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 24
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24
          }
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current
        }}
        //trigger a re-render by updating the state on swiper initialization
        onInit={() => setInit(true)}
      >
        {collectionsData?.map((item: any) => {
          const { title, handle, featuredImage, priceRange } = item
          return (
            <SwiperSlide key={handle}>
              <div className='text-center relative rounded-md overflow-hidden group'>
                <div className='relative'>
                  <img
                    src={featuredImage.url}
                    width={424}
                    height={306}
                    alt={title}
                    className='h-[150px] md:h-[250px] lg:h-[306px] object-cover rounded-md transform transition-transform duration-300 ease-in-out scale-90 group-hover:scale-93 '
                  />
                  <img
                    src="/images/logo.png"
                    width={50}
                    height={30}
                    alt="Logo"
                    className="absolute top-2 right-2 "
                  />
                </div>

                <div className='py-6'>
                  <h4 className='mb-2 font-medium h5 line-clamp-1'>
                    <Link className='after:absolute after:inset-0' href={`/products/${handle}`}>
                      {title}
                    </Link>
                  </h4>
                  <p className='text-text-light dark:text-darkmode-text-light text-xs md:text-xl'>
                    {priceRange.maxVariantPrice.amount} CHF
                  </p>
                </div>
              </div>
            </SwiperSlide>
          )
        })}

        <div
          className={`block w-full absolute top-[33%] z-10 px-4 text-text-dark ${isHovered
            ? 'opacity-100 transition-opacity duration-300 ease-in-out'
            : 'opacity-0 transition-opacity duration-300 ease-in-out'
            }`}
        >
          <div ref={prevRef} className='p-2 lg:p-3 rounded-md bg-gray-200 cursor-pointer shadow-sm absolute left-4'>
            <HiOutlineArrowNarrowLeft size={24} />
          </div>
          <div ref={nextRef} className='p-2 lg:p-3 rounded-md bg-gray-200 cursor-pointer shadow-sm absolute right-4'>
            <HiOutlineArrowNarrowRight size={24} />
          </div>
        </div>
      </Swiper>
    </div>
  )
}

export default CollectionsSlider
