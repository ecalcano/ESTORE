import { getLatestProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/header/product/product-list";

const HomePage = async () => {
  const latestProducts = await getLatestProducts();

  return (
    <div className="space-y-8">
      <h2 className="h2-bold">Latest Products</h2>
      <ProductList title="Newest Arrivals" data={latestProducts} />
    </div>
  );
};

export default HomePage;
