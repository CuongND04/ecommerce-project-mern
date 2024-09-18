import React, { memo } from "react";
import Product from "./Product";
import Slider from "react-slick";
var settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};
const CustomSlider = ({ products, activeTab }) => {
  return (
    <Slider {...settings}>
      {products?.map((el) => (
        <Product
          key={el.slug}
          productData={el}
          isNew={activeTab === 1 ? false : true}
        />
      ))}
    </Slider>
  );
};

export default memo(CustomSlider);
