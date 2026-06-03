"use client";

import React from 'react'
import {Swiper, SwiperSlide}from 'swiper/react'
import { Autoplay, FreeMode, Navigation, Pagination} from 'swiper/modules';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import Image from 'next/image';

interface Props{
  images?: string[];
  title?: string;
  className?: string
}


export const ProductMobileSlideShow = ({images, title="imagen", className}:Props) => {


  return (
    <div className={className}>
      <Swiper
        autoplay={{
          delay:2500,
        }}
        pagination
        modules={[FreeMode, Autoplay, Pagination]}
        className="mySwiper2"
        style={{width:'90vw', height:'500px'}}
      >
        {
          images?.map(image =>(
            <SwiperSlide key={image}>
              <Image
                width={600}
                height={500}
                src={`/products/${image}`}
                alt={title}
                className='object-fill'
              />
            </SwiperSlide>
          ))
        }

      </Swiper>

    </div>

    )
}
