const User = require("../models/users");
const Badge = require("../models/badges");

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
      isEligible = user.photos.length === 1;
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
    if (!badge) return;

    // Ajoute le badge à la liste des badges de l'utilisateur
    user.badges.push(badge._id);
    await user.save();

    console.log(`Badge "${criteria}" débloqué pour ${user.pseudo}`);
  }
}

module.exports = { unlockBadgeIfEligible };
