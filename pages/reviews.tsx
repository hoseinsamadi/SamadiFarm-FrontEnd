import ReviewsPage from "../src/pages/ReviewsPage";
import { getReviews } from "../src/lib/reviewsApi";

export const getServerSideProps = async () => {
  try {
    const { reviews } = await getReviews();
    return { props: { reviews } };
  } catch {
    return { props: { reviews: [] } };
  }
};

export default ReviewsPage;
