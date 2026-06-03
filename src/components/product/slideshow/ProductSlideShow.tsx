"use client";

import React, { useState } from 'react'
import {Swiper, SwiperSlide}from 'swiper/react'
import {Swiper as SwiperObject} from 'swiper'
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './slideshow.css'
import Image from 'next/image';
import { ProductImage } from '../product-image/ProductImage';

interface Props{
  images?: string[];
  title?: string;
  className?: string
}


export const ProductSlideShow = ({images, title="imagen", className}:Props) => {

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();

  return (
    <div className={className}>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
          'height':"70vh",
          'marginBottom':10,
    
        }as React.CSSProperties} 

        spaceBetween={10}
        navigation={true}
        autoplay={{
          delay:2500,
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >
        {
          images?.map(image =>(
            <SwiperSlide key={image}>
              <ProductImage
                src={image}
                alt={title}
                className='rounded-lg'
                width={1024}
                height={800}
              />
            </SwiperSlide>
          ))
        }

      </Swiper>


      <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper"
          style={{height:120, width:400}}
        >
          {
            images?.map(image =>(
              <SwiperSlide key={image}>
                <ProductImage
                  width={280}
                  height={280}
                  src={image}
                  alt={title}
                  className='rounded-lg object-fill'
                />
              </SwiperSlide>
            ))
          }

        </Swiper>




    </div>

    )
}
