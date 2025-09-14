import { useEffect, useState } from "react";
import { fetchAds } from "../service/adsService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const FeaturedPromo = () => {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    const loadAds = async () => {
      try {
        const data = await fetchAds();
        if (data?.success) {
          setPromos(data.banner.advertiseBanners || []);
        }
      } catch (err) {
        console.error("Error loading ads:", err);
      }
    };
    loadAds();
  }, []);

  return (
    <section>
      <div className="mx-4 relative pb-2 pt-4">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={12}
          slidesPerView={1} // default mobile
          breakpoints={{
            640: { slidesPerView: 3 }, // show 2 slides on screens >= 640px
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation
          loop={true}
        >
          {promos?.map((promo, i) => (
            <SwiperSlide
              key={i}
              className="rounded-lg cursor-pointer max-h-[280px] sm:h-[200px] overflow-hidden"
            >
              <img
                src={promo}
                alt={`Ad-${i}`}
                className="h-full w-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedPromo;
