import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    businessName: { type: String, default: "Grab My Goods Resell" },
    tagline: {
      type: String,
      default: "Hidden gems. Great finds. Ready for a new home.",
    },
    logo: { type: String },
    favicon: { type: String },
    phone: { type: String, default: "+1 817-715-7028" },
    email: { type: String, default: "grabmygoodsresell@gmail.com" },
    facebook: {
      type: String,
      default: "https://www.facebook.com/61579309705671/",
    },
    instagram: { type: String },
    socialLinks: [
      {
        label: String,
        url: String,
      },
    ],
    businessDescription: { type: String, default: "" },
    primaryColor: { type: String, default: "#C45C3E" },
    secondaryColor: { type: String, default: "#D4C4B0" },
    accentColor: { type: String, default: "#2D2A26" },
    announcementBar: {
      enabled: { type: Boolean, default: true },
      text: {
        type: String,
        default: "New finds added regularly — browse our full inventory online!",
      },
      link: { type: String, default: "/shop" },
    },
    footerText: {
      type: String,
      default:
        "Local pickup in Waxahachie, Texas. Fair prices, friendly service, and constantly changing inventory.",
    },
    copyright: {
      type: String,
      default: "© Grab My Goods Resell. All rights reserved.",
    },
    pickupInfo: {
      type: String,
      default:
        "Local pickup only. Pickup details will be shared after your order is confirmed.",
    },
    businessHours: {
      type: String,
      default: "By appointment — contact us to schedule pickup.",
    },
    seo: {
      title: {
        type: String,
        default: "Grab My Goods Resell | Local Resale Finds in Waxahachie, TX",
      },
      description: {
        type: String,
        default:
          "Browse unique resale finds from Grab My Goods Resell. Vintage, household goods, collectibles, and more. Local pickup in Waxahachie, Texas.",
      },
    },
  },
  { timestamps: true },
);

export type SiteSettingsDocument = InferSchemaType<typeof SiteSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

const SiteSettings =
  (mongoose.models.SiteSettings as Model<SiteSettingsDocument>) ||
  mongoose.model<SiteSettingsDocument>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
