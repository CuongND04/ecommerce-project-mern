import React from "react";
import { formatMoney, renderStarFromNumber } from "../ultils/helpers";

const ProductCart = ({ price, totalRatings, title, image }) => {
  return (
    <div className="w-1/3 flex-auto border">
      <div className="flex w-full border">
        <img
          src={image}
          alt="products"
          className="w-[120px] object-contain p-4 "
        />
        <div className="flex flex-col gap-1 mt-[15px] items-start w-full text-xs">
          <span className="line-clamp-1 capitalize text-sm cursor-pointer hover:text-main">
            {title?.toLowerCase()}
          </span>
          <span className="flex h-4">
            {renderStarFromNumber(totalRatings, 14)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
          <span>{`${formatMoney(price)}`} VNĐ</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
