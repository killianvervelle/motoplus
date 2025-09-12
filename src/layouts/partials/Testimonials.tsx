'use client'

import ImageFallback from '@/helpers/ImageFallback'
import { markdownify } from '@/lib/utils/textConverter'
import { TranslatedTestimonial } from '@/types'
import { useRef, useState } from 'react'
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from 'react-icons/hi'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TestimonialsProps } from '@/types'


const Testimonials = ({ title, testimonials }: TestimonialsProps) => {
  const [, setInit] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const prevRef = useRef(null)
  const nextRef = useRef(null)

  return (
    <section className='section'>
      <div className='container'>
        <div className='row'>
          <div className='mx-auto mb-8 text-center md:col-10 lg:col-8 xl:col-6'>
            <h2 dangerouslySetInnerHTML={markdownify(title)} className='mb-4' />
            {/* <p
              dangerouslySetInnerHTML={markdownify(
                data.frontmatter.description!,
              )}
            /> */}
          </div>
          <div className='relative' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={24}
              slidesPerView={3}
              breakpoints={{
                0: {        
                  slidesPerView: 1
                },
                640: {          
                  slidesPerView: 2
                },
                768: {          
                  slidesPerView: 2
                },
                1024: {          
                  slidesPerView: 3
                }
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current
              }}
              onInit={() => setInit(true)}
            >
              {testimonials.map((item: TranslatedTestimonial, index: number) => (
                <SwiperSlide key={index}>
                  <div className='rounded-lg relative flex flex-col items-center bg-light py-10 dark:bg-darkmode-light'>
                    <div className='text-text-dark dark:text-white absolute opacity-25'>
                    </div>
                    <blockquote
                      className='text-center px-6 h-32 col-10 md:col-10 lg:col-9 z-10 line-clamp-4'
                      dangerouslySetInnerHTML={markdownify(item.content)}
                    />
                    <div className='mt-11 flex flex-col items-center gap-1'>
                      <div className='text-text-dark dark:text-white mb-4'>
                        <ImageFallback
                          height={50}
                          width={50}
                          className='rounded-full'
                          src={item.image}
                          alt={item.name}
                        />
                      </div>

                      <h3 dangerouslySetInnerHTML={markdownify(item.name)} className='h5 font-primary font-semibold' />
                      <p
                        dangerouslySetInnerHTML={markdownify(item.designation)}
                        className='text-text-dark dark:text-white'
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              <div
                className={` flex justify-between w-full absolute top-1/2 z-10 px-6 text-text-dark ${isHovered
                  ? 'opacity-100 transition-opacity duration-300 ease-in-out'
                  : 'opacity-0 transition-opacity duration-300 ease-in-out'
                  }`}
              >
                <div ref={prevRef} className='p-2 lg:p-4 rounded-md bg-body cursor-pointer shadow-sm'>
                  <HiOutlineArrowNarrowLeft size={24} />
                </div>
                <div ref={nextRef} className='p-2 lg:p-4 rounded-md bg-body cursor-pointer shadow-sm'>
                  <HiOutlineArrowNarrowRight size={24} />
                </div>
              </div>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
