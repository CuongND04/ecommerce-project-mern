import React from "react";
import { formatMoney } from "../ultils/helpers";
import newImg from "../assets/new.png";
import trendingImg from "../assets/trending.png";
const Product = ({ productData, isNew }) => {
  return (
    <div className="w-full text-base px-[10px]">
      <div className="w-full border p-[15px] flex flex-col items-center">
        <div className="w-full relative">
          <img
            src={
              productData?.thumb ||
              "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
            }
            className="w-[243px] h-[243px] object-cover"
          />
          <img
            src={isNew ? newImg : trendingImg}
            alt=""
            className="absolute top-[0px] right-[0px] w-[100px] h-[35px] object-cover"
          />
        </div>
        <div className="flex flex-col gap-1 mt-[15px] items-start w-full ">
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
