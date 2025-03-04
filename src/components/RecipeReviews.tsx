
import { useState } from "react";
import { Star, MessageCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface RecipeReviewsProps {
  recipeId: string;
}

const RecipeReviews = ({ recipeId }: RecipeReviewsProps) => {
  const { user, addReview, deleteReview, getRecipeReviews } = useUser();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const reviews = getRecipeReviews(recipeId);
  const userHasReview = reviews.some(r => r.userId === user?.id);
  
  const handleSubmitReview = () => {
    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }
    
    setIsSubmitting(true);
    
    addReview(recipeId, {
      rating,
      comment: comment.trim(),
      date: new Date().toISOString()
    });
    
    toast.success("Review added successfully");
    setComment("");
    setRating(5);
    setIsSubmitting(false);
  };
  
  const handleDeleteReview = (reviewId: string) => {
    deleteReview(recipeId, reviewId);
    toast.info("Review deleted");
  };
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-xl font-medium mb-4 flex items-center">
        <MessageCircle className="h-5 w-5 mr-2 text-fridge-600" />
        Reviews & Ratings
      </h2>
      
      {!userHasReview && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium mb-3">Add Your Review</h3>
          
          <div className="flex items-center mb-3">
            {Array.from({ length: 5 }, (_, i) => (
              <button 
                key={i}
                onClick={() => setRating(i + 1)}
                className="mr-1 focus:outline-none"
              >
                <Star 
                  className={`h-6 w-6 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>
          
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this recipe..."
            className="mb-3 resize-none"
            rows={3}
          />
          
          <Button 
            onClick={handleSubmitReview}
            disabled={isSubmitting}
            className="bg-fridge-600 hover:bg-fridge-700 text-white"
          >
            Submit Review
          </Button>
        </div>
      )}
      
      {reviews.length > 0 ? (
        <motion.div 
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {reviews.map((review) => (
            <motion.div 
              key={review.id}
              variants={item}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.date).toLocaleDateString()} by {review.userName}
                  </p>
                </div>
                
                {review.userId === user?.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
              
              <p className="text-sm">{review.comment}</p>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
          No reviews yet. Be the first to review this recipe!
        </p>
      )}
    </div>
  );
};

export default RecipeReviews;
