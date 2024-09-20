import React, { useState } from "react";
import { formatMoney, renderStarFromNumber } from "../ultils/helpers";
import newImg from "../assets/new.png";
import trendingImg from "../assets/trending.png";
import SelectOption from "./SelectOption";
import icons from "../ultils/icons";
import { Link } from "react-router-dom";
import path from "../ultils/path";


const { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } = icons;
const Product = ({ productData, isNew }) => {
  const [isShowOption, setIsShowOption] = useState(false);
  return (
    <div className="w-full text-base px-[10px]">
      <Link
        className="w-full border p-[15px] flex flex-col items-center"
        to={`/${path.DETAIL_PRODUCT}/${productData?._id}/${productData?.title}`}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsShowOption(false);
        }}
      >
        <div className="w-full relative">
          {isShowOption && (
            <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top ">
              <SelectOption icon={<AiFillEye />} />
              <SelectOption icon={<AiOutlineMenu />} />
              <SelectOption icon={<BsFillSuitHeartFill />} />
            </div>
          )}
          <img
            src={
              productData?.thumb ||
              "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
            }
            alt="thumb"
            className="w-[274px] h-[274px] object-cover"
          />
          <img
            src={isNew ? newImg : trendingImg}
            alt="trending"
            className="absolute top-[0px] right-[0px] w-[100px] h-[35px] object-cover"
          />
        </div>
        <div className="flex flex-col gap-1 mt-[15px] items-start w-full ">
          <span className="flex h-4">
            {renderStarFromNumber(productData?.totalRatings)?.map(
              (el, index) => (
                <span key={index}>{el}</span>
              )
            )}
          </span>
          <span className="line-clamp-1">{productData?.title}</span>

          <span>{`${formatMoney(productData?.price)} VND`}</span>
        </div>
      </Link>
    </div>
  );
};

export default Product;
