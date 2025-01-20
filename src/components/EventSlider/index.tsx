import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import gsap from 'gsap';
import MockData from "../../db/mock-data.json";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface EventSliderProps {
    yearStep: number;
}

const EventSlider: React.FC<EventSliderProps> = ({yearStep}) => {
    const [isBeginning, setIsBeginning] = useState<boolean>(true);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const swiperRef = useRef<SwiperType | null>(null);
    const eventsSliderContainerRef = useRef<HTMLDivElement | null>(null);

    const handleCheckResize = () => {
        if (window.innerWidth <= 768) setIsMobile(true) 
        else setIsMobile(false)
    }

    const handleSlideChange = () => {
        if (swiperRef.current) {
            setIsBeginning(swiperRef.current.isBeginning);
            setIsEnd(swiperRef.current.isEnd);
        }
    };

    useEffect(() => {
        handleCheckResize()

        window.addEventListener('resize', () => {
            handleCheckResize()
        });

        return () => {
          window.removeEventListener('resize', handleCheckResize);
        };
    }, []);

    useEffect(() => {
        if (eventsSliderContainerRef.current) {
            const timeline = gsap.timeline();
            timeline.to(".events-slider-container", { opacity: 0, duration: 0.1 });
            timeline.from(".events-slider-container", { opacity: 1, duration: 0.3, delay: 0.3 });
        }
    }, [yearStep])

    return (
        <div className="events-slider-container" ref={eventsSliderContainerRef}>
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={handleSlideChange}
                modules={[Navigation, Pagination]}
                slidesPerView={isMobile ? 1.5 : 3}
                loop={false}
                pagination={{ clickable: true }}
            >
                {MockData.at(yearStep)?.events.map((event, index) => (
                    <SwiperSlide key={index}>
                        <div className='event-card'>
                            <span className='event-year bebas-neue-regular'>{event.event_year}</span>
                            <p className='event-description pt-sans-regular'>{event.description}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <button
                className="nav-button nav-button-left"
                style={{display: `${isBeginning ? 'none' : ''}`}}
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
            >
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 1L2 6L7 11" stroke="#3877EE" strokeWidth="2"/>
                </svg>
            </button>
            <button
                className="nav-button nav-button-right"
                style={{display: `${isEnd ? 'none' : ''}`}}
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
            >
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L1 11" stroke="#3877EE" strokeWidth="2"/>
                </svg>
            </button>
        </div>
    );
};

export default EventSlider;