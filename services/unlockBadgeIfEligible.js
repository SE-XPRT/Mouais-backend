const User = require("../models/users");
const Badge = require("../models/badges");
const Photos = require("../models/photos");

async function unlockBadgeIfEligible(userId, criteria) {
  const user = await User.findById(userId)
    .populate("badges")
    .populate("photos")
    .populate("subscription");
  if (!user) return;

  // Est-ce que le badge correspondant au critère a déjà été débloqué ?
  const alreadyUnlocked = user.badges.some(
    (badge) => badge.criteria === criteria
  );
  if (alreadyUnlocked) return;

  let isEligible = false;

  switch (criteria) {
    case "firstPhotoUploaded":
      const photoCount = await Photos.countDocuments({ userId });
      isEligible = photoCount === 1;
      break;
    case "coins3":
      isEligible = user.coins >= 3;
      break;
    case "profileCompleted":
      isEligible = !!user.avatarURL && !!user.pseudo && user.photos.length > 0;
      break;
    case "firstSubscription":
      isEligible = user.subscription && user.subscription.isActive === true;
      break;
    default:
      console.log("Critère inconnu :", criteria);
  }

  if (isEligible) {
    const badge = await Badge.findOne({ criteria });
    if (badge) {
      user.badges.push(badge._id);
      await user.save();
      return badge; // on renvoie le badge ici
    }
  }

  return null;
}

module.exports = { unlockBadgeIfEligible };
