import { useAppDispatch } from "../hooks/useAppDispatch";
import { show as showModal } from "../../Components/store/modal";
import Offers from "../lib/data/discountOffers.json";

import React, { useState } from "react";

const DiscountCard = ({ data }) => {
  const dispatch = useAppDispatch();
  const [codeCopied, setCodeCopied] = useState(false);

  const showDiscountInfo = () => {
    dispatch(showModal({ data, type: "discount" }));
  };

  const copyCouponCode = async (e, text) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div
      className="border border-blue-600 rounded-lg cursor-pointer flex-shrink-0 w-[277px] h-[188px] overflow-hidden flex flex-col mr-4"
      onClick={showDiscountInfo}
    >
      <div className="p-4">
        <div className="w-[52px] h-[35px]">
          <img
            src={data.icon_url}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <h5 className="mt-2 pb-2 text-[20px] font-bold leading-none">
          {data.title}
        </h5>
        <p className="text-xs text-gray-600">{data.subtitle}</p>
      </div>
      <div className="bg-[#f6fbff] py-3 px-4 flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <small className="text-[10px] font-medium text-gray-500">
            {data.offer.key}
          </small>
          <span className="text-xs font-bold text-blue-500">
            {data.offer.value}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => copyCouponCode(e, data.offer.value)}
          className="bg-[#1f1f1f] text-white rounded-lg font-medium lowercase text-sm px-4 py-1.5 h-7"
        >
          {codeCopied ? "Copied" : data.button_cta_text}
        </button>
      </div>
    </div>
  );
};

const DiscountOffers = () => {
  const allOffers = Offers;

  return (
    <section>
      {/* <h3 className="font-semibold text-2xl my-6 mx-4">
        Bank &amp; Wallet Offers
      </h3> */}
      {/* <div className="mx-4 relative">
        <div className="flex overflow-x-auto no-scrollbar">
          {allOffers?.map((offer, i) => (
            <DiscountCard key={i} data={offer} />
          ))}
        </div>
      </div> */}
    </section>
  );
};

export default DiscountOffers;
