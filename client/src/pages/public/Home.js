import React from "react";
import { useSelector } from "react-redux";

import {
  Sidebar,
  Banner,
  BestSeller,
  DealDaily,
  FeatureProduct,
  CustomSlider,
} from "../../components";
import icons from "../../ultils/icons";
const { IoIosArrowForward } = icons;

const Home = () => {
  const { newProducts } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.app);
  return (
    <>
      <div className="w-main flex">
        <div className="flex flex-col gap-5 w-[25%] flex-auto">
          <Sidebar />
          <DealDaily />
        </div>
        <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto">
          <Banner />
          <BestSeller />
        </div>
      </div>
      <div className="my-8">
        <FeatureProduct />
      </div>
      <div className="my-8">
        <h3 className="text-[20px] font-semibold py-[15px] uppercase">
          new arrivals
        </h3>
        <div className=" mx-[-10px] border-t-2 border-main py-4">
          <CustomSlider products={newProducts} />
        </div>
      </div>

      <div className="my-8 w-full">
        <h3 className="text-[20px] font-semibold py-[15px] uppercase border-main border-b-2">
          hot collections
        </h3>
        <div className="flex flex-wrap gap-4 mt-4 ">
          {categories
            ?.filter((el) => el.brand.length > 0)
            ?.map((el) => (
              <div key={el._id} className="w-[396px]">
                <div className="border flex p-4 gap-4 min-h-[200px]">
                  <img
                    src={el?.image}
                    alt="collection"
                    className="w-[144px] h-[129px] object-cover flex-1"
                  />
                  <div className="flex-1 text-gray-700">
                    <h4 className="font-semibold uppercase">{el.title}</h4>
                    <ul className="text-sm">
                      {el?.brand?.map((item) => (
                        <span
                          key={item}
                          className="flex cursor-pointer hover:text-main gap-2 items-center text-gray-500"
                        >
                          <IoIosArrowForward size={14} />
                          <li key={item}>{item}</li>
                        </span>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="w-full h-[500px]"></div>
    </>
  );
};

export default Home;
