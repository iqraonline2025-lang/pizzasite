import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Changed to String and removed 'required' so manual/guest reviews work
  productId: { 
    type: String, 
    default: "pizzahq-general" 
  },
  // Changed to String/ObjectId mix and removed 'required' for manual entries
  userId: { 
    type: String, 
    default: "admin" 
  },
  customerName: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true 
  },
  isApproved: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

// ESM Export
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;