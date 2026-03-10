import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
  postSlug: String,
  name: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema)