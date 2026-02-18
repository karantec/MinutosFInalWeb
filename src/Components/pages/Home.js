import Misc from "../lib/data/layout.json";
import HeroArea from "../home/HeroArea";
import FeaturedPromo from "../home/FeaturedPromo";
import CategoriesList from "../home/CategoriesList";
import DiscountOffers from "../home/DiscountOffers";
import ProductsRow from "../home/ProductsRow";
import ProductCard from "../home/ProductCard";
import ProductCard3 from "../home/ProductCard3";
import ChocolatePage from "../home/ChoclatePage";
import Mithai from "../home/Mithai";
const Home = () => {
  const productItems = Misc.filter((item) => item.type === 77).map((el) => ({
    data: el.data,
    objects: el.objects,
  }));

  return (
    <div className="_container mt-3">
      <HeroArea />
      <FeaturedPromo />
      <CategoriesList />
      <DiscountOffers />
      <ProductCard3 />
      <ChocolatePage />
      <Mithai />
      {/* <HighlightedPromo/> */}
      {/* {productItems.map((products, i) => (
        <ProductsRow key={i} {...products} />
      ))} */}
    </div>
  );
};

export default Home;
