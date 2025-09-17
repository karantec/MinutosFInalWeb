import { useEffect, useState } from "react";
import { fetchAds } from "../service/adsService";

const HeroArea3 = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const loadAds = async () => {
      try {
        const data = await fetchAds();
        if (data?.success) {
          // you can include multiple banners if you want
          setBanners([{ id: 3, banner: data.banner.homeBanner3 }]);
        }
      } catch (err) {
        console.error("Error loading hero banners:", err);
      }
    };
    loadAds();
  }, []);

  return (
    <section className="mt-4 md:mt-0 px-2 md:px-0">
      {banners.map((ad) => (
        <div key={ad.id} className="mb-4">
          <div className="relative w-full overflow-hidden rounded-xl">
            {/* Desktop / tablet */}
            <img
              src={ad.banner}
              alt={`Home Banner ${ad.id}`}
              className="hidden sm:block w-full h-[180px] md:h-[240px] lg:h-[300px] object-cover rounded-xl"
            />
            {/* Mobile */}
            <img
              src={ad.banner}
              alt={`Home Banner ${ad.id}`}
              className="sm:hidden w-full h-[140px] object-cover rounded-lg"
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default HeroArea3;
