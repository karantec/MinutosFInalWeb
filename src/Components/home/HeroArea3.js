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
          setBanners([{ id: 2, banner: data.banner.homeBanner2 }]);
        }
      } catch (err) {
        console.error("Error loading hero banners:", err);
      }
    };
    loadAds();
  }, []);

  return (
    <section className="mt-4 md:mt-0 py-4 md:py-10 px-2 md:px-4">
      {banners.map((ad) => (
        <div key={ad.id} className="mb-4">
          <div className="relative w-full overflow-hidden rounded-lg md:rounded-xl">
            <img
              src={ad.banner}
              alt={`Home Banner ${ad.id}`}
              className="w-full h-auto min-h-[120px] max-h-[160px] xs:max-h-[140px] sm:min-h-[180px] sm:max-h-[200px] md:min-h-[220px] md:max-h-[280px] lg:min-h-[280px] lg:max-h-[350px] object-contain sm:object-cover rounded-lg md:rounded-xl"
              loading="lazy"
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default HeroArea3;
