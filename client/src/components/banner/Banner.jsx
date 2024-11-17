import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function Banner() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className='h-100 w-100'>
      <Slider {...settings}>
        <div>
          <a href="https://www.pnj.com.vn/pnj-international/disneypnj/?atm_source=sis_disney&atm_medium=main_banner&atm_campaign=slide1&atm_content=tabsale-disney" target="_blank" rel="noopener noreferrer">
            <img src="/assets/banner/bn1.jpg" className='h-100 w-100 border' style={{ objectFit: "contain" }} alt="Banner 1" />
          </a>
        </div>
        <div>
          <a href="https://www.pnj.com.vn/pnj-international/disneypnj/jasmine/?atm_source=homepage&atm_medium=mainbanner&atm_campaign=slide1&atm_content=jasmine_princess" target="_blank" rel="noopener noreferrer">
            <img src="/assets/banner/a.png" className='h-100 w-100 border' style={{ objectFit: "contain" }} alt="Banner 2" />
          </a>
        </div>
        <div>
          <a href="https://www.pnj.com.vn/khuyen-mai/?position=menu-tab-sale" target="_blank" rel="noopener noreferrer">
            <img src="/assets/banner/b.jpg" className='h-100 w-100 border' style={{ objectFit: "contain" }} alt="Banner 3" />
          </a>
        </div>
      </Slider>
    </div>
  );
} 
