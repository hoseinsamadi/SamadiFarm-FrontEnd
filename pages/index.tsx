import HomePage from "../src/pages/HomePage";
import { getReviews } from "../src/lib/reviewsApi";

export const getServerSideProps = async () => {
  try {
    const { reviews } = await getReviews();
    return { props: { reviews } };
  } catch {
    return { props: { reviews: [] } };
  }
};

export default HomePage;
