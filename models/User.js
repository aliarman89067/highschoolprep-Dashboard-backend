import mongoose, { now } from "mongoose";

const UserUnitSchema = new mongoose.Schema({
  gradeName: { type: String },
  subjectName: { type: String },
  subjectId: { type: String },
  unitId: { type: String },
  unitName: { type: String },
  playedTime: { type: String },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg",
    },
    isPremium: { type: Boolean, default: false },
    packageName: { type: String },
    purchaseAt: { type: Date },
    expiresAt: { type: Date },
    packagePrice: { type: Number },
    oAuth: { type: Boolean },
    playedSubUnits: [UserUnitSchema],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;
