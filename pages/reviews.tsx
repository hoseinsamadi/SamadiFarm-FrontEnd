import ReviewsPage from "../src/pages/ReviewsPage";
import { getReviewRatingSummary, getReviews } from "../src/lib/reviewsApi";

export const getServerSideProps = async () => {
  try {
    const [{ reviews }, ratingSummary] = await Promise.all([getReviews(), getReviewRatingSummary()]);
    return { props: { reviews, ratingSummary } };
  } catch {
    return { props: { reviews: [], ratingSummary: null } };
  }
};

export default ReviewsPage;
