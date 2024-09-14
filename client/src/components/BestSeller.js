import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis/product";
import Product from "./Product";
import Slider from "react-slick";

import laptop1 from "../assets/laptop1.png";
import laptop2 from "../assets/laptop2.png";
const tabs = [
  { id: 1, name: "best sellers" },
  { id: 2, name: "new arrivals" },
];
var settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};
const BestSeller = () => {
  // phần này không để ở Home vì nó chỉ dùng một chỗ, nếu đặt ở home thì nó sẽ render để set lại thằng state
  const [bestSellers, setBestSellers] = useState(null);
  const [newProducts, setNewProducts] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [products, setProducts] = useState(null);
  const fetchProducts = async () => {
    // chờ 2 api trả về hết mới xử lý
    const response = await Promise.all([
      apiGetProducts({ sort: "-sold" }),
      apiGetProducts({ sort: "-createdAt" }),
    ]);
    if (response[0]?.success) {
      setBestSellers(response[0].products);
      setProducts(response[0].products);
    }
    if (response[1]?.success) setNewProducts(response[1].products);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    if (activeTab === 1) setProducts(bestSellers);
    if (activeTab === 2) setProducts(newProducts);
  }, [activeTab]);

  return (
    <>
      <div className="flex text-[20px]  ml-[-32px]">
        {tabs.map((el) => (
          <span
            key={el.id}
            className={`font-semibold px-8 border-r cursor-pointer capitalize text-gray-400 ${
              activeTab === el.id ? "text-gray-900" : ""
            }`}
            onClick={() => setActiveTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="mx-[-10px] border-t-2 border-main pt-4 ">
        <Slider {...settings}>
          {products?.map((el) => (
            <Product
              key={el.slug}
              productData={el}
              isNew={activeTab === 1 ? false : true}
            />
          ))}
        </Slider>
      </div>
      <div className="w-full flex gap-4 mt-6">
        <img src={laptop1} alt="banner" className="flex-1 object-contain" />
        <img src={laptop2} alt="banner" className="flex-1 object-contain" />
      </div>
    </>
  );
};

export default BestSeller;
