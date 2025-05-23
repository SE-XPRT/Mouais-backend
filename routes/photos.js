const express = require("express");
const router = express.Router();
const Photos = require("../models/photos");

const analyze = [
  {
    tone: "gentil",
    score: 0.75,
    criteria: {
      cheveux: 0.9,
      smile: 0.7,
      makeup: 0.6,
      outfit: 0.8,
    },
    comment: {
      cheveux: "Les cheveux sont bien coiffés.",
      smile: "Le sourire est engageant.",
      makeup: "Le maquillage est léger.",
      outfit: "La tenue est appropriée.",
    },
  },
  {
    tone: "gentil",
    score: 0.85,
    criteria: {
      cheveux: 0.9,
      smile: 0.8,
      makeup: 0.9,
      outfit: 0.8,
    },
    comment: {
      cheveux: "Coiffure très soignée.",
      smile: "Sourire naturel et plaisant.",
      makeup: "Maquillage bien dosé.",
      outfit: "Tenue harmonieuse et stylée.",
    },
  },
  {
    tone: "gentil",
    score: 0.76,
    criteria: {
      cheveux: 0.7,
      smile: 0.9,
      makeup: 0.8,
      outfit: 0.65,
    },
    comment: {
      cheveux: "Coiffure simple mais propre.",
      smile: "Beau sourire, très communicatif.",
      makeup: "Maquillage bien maîtrisé.",
      outfit: "Look sympa, peut encore s’affiner.",
    },
  },
  {
    tone: "gentil",
    score: 0.58,
    criteria: {
      cheveux: 0.6,
      smile: 0.55,
      makeup: 0.5,
      outfit: 0.65,
    },
    comment: {
      cheveux: "Cheveux globalement bien mis en place.",
      smile: "Un sourire discret mais présent.",
      makeup: "Un peu plus de maquillage pourrait accentuer les traits.",
      outfit: "Style classique qui fonctionne.",
    },
  },
  {
    tone: "gentil",
    score: 0.93,
    criteria: {
      cheveux: 0.95,
      smile: 0.9,
      makeup: 0.9,
      outfit: 0.95,
    },
    comment: {
      cheveux: "Une coiffure impeccable.",
      smile: "Sourire rayonnant et confiant.",
      makeup: "Parfaitement appliqué.",
      outfit: "Tenue au top, rien à redire.",
    },
  },
  {
    tone: "gentil",
    score: 0.67,
    criteria: {
      cheveux: 0.7,
      smile: 0.6,
      makeup: 0.65,
      outfit: 0.73,
    },
    comment: {
      cheveux: "Un peu décoiffé mais sympa.",
      smile: "Sourire discret mais présent.",
      makeup: "Maquillage plutôt équilibré.",
      outfit: "Bonne base, à styliser davantage.",
    },
  },
  {
    tone: "gentil",
    score: 0.81,
    criteria: {
      cheveux: 0.85,
      smile: 0.75,
      makeup: 0.8,
      outfit: 0.84,
    },
    comment: {
      cheveux: "Très bonne coupe de cheveux.",
      smile: "Joli sourire.",
      makeup: "Maquillage bien ajusté.",
      outfit: "Un bon sens du style.",
    },
  },
  {
    tone: "gentil",
    score: 0.6,
    criteria: {
      cheveux: 0.65,
      smile: 0.55,
      makeup: 0.5,
      outfit: 0.7,
    },
    comment: {
      cheveux: "Cheveux un peu en bataille.",
      smile: "Un effort, mais sourire timide.",
      makeup: "Maquillage minimaliste.",
      outfit: "Style sobre, efficace.",
    },
  },
  {
    tone: "gentil",
    score: 0.72,
    criteria: {
      cheveux: 0.8,
      smile: 0.75,
      makeup: 0.6,
      outfit: 0.73,
    },
    comment: {
      cheveux: "Bonne coupe bien entretenue.",
      smile: "Sourire franc.",
      makeup: "Simple mais adapté.",
      outfit: "Un ensemble cohérent.",
    },
  },
  {
    tone: "gentil",
    score: 0.9,
    criteria: {
      cheveux: 0.95,
      smile: 0.9,
      makeup: 0.85,
      outfit: 0.9,
    },
    comment: {
      cheveux: "Rien à redire sur la coiffure.",
      smile: "Sourire éclatant.",
      makeup: "Très élégant.",
      outfit: "Style affirmé et soigné.",
    },
  },
  {
    tone: "gentil",
    score: 0.66,
    criteria: {
      cheveux: 0.6,
      smile: 0.7,
      makeup: 0.65,
      outfit: 0.7,
    },
    comment: {
      cheveux: "Coiffure correcte, un peu floue.",
      smile: "Sourire doux et discret.",
      makeup: "Maquillage adapté à la situation.",
      outfit: "Style simple mais bien choisi.",
    },
  },
  {
    tone: "gentil",
    score: 0.87,
    criteria: {
      cheveux: 0.9,
      smile: 0.85,
      makeup: 0.85,
      outfit: 0.88,
    },
    comment: {
      cheveux: "Très beau rendu des cheveux.",
      smile: "Sourire agréable et franc.",
      makeup: "Application parfaite.",
      outfit: "Superbe ensemble.",
    },
  },
  {
    tone: "gentil",
    score: 0.79,
    criteria: {
      cheveux: 0.8,
      smile: 0.75,
      makeup: 0.8,
      outfit: 0.8,
    },
    comment: {
      cheveux: "Bonne tenue de la coiffure.",
      smile: "Sourire naturel.",
      makeup: "Maquillage bien posé.",
      outfit: "Un look équilibré.",
    },
  },
  {
    tone: "gentil",
    score: 0.55,
    criteria: {
      cheveux: 0.5,
      smile: 0.6,
      makeup: 0.55,
      outfit: 0.55,
    },
    comment: {
      cheveux: "Peut-être besoin d’un petit coup de peigne.",
      smile: "Sourire timide mais présent.",
      makeup: "Léger, mais ça fonctionne.",
      outfit: "Style discret.",
    },
  },
  {
    tone: "gentil",
    score: 0.7,
    criteria: {
      cheveux: 0.7,
      smile: 0.7,
      makeup: 0.7,
      outfit: 0.7,
    },
    comment: {
      cheveux: "Rien à redire, coiffure propre.",
      smile: "Un sourire équilibré.",
      makeup: "Maquillage neutre, très bien.",
      outfit: "Style classique qui passe partout.",
    },
  },
  {
    tone: "gentil",
    score: 0.88,
    criteria: {
      cheveux: 0.85,
      smile: 0.9,
      makeup: 0.9,
      outfit: 0.85,
    },
    comment: {
      cheveux: "Très jolie coupe.",
      smile: "Un très beau sourire.",
      makeup: "Maquillage bien équilibré.",
      outfit: "Tenue stylée sans en faire trop.",
    },
  },
  {
    tone: "gentil",
    score: 0.65,
    criteria: {
      cheveux: 0.6,
      smile: 0.7,
      makeup: 0.65,
      outfit: 0.65,
    },
    comment: {
      cheveux: "Léger besoin de volume.",
      smile: "Sourire bienveillant.",
      makeup: "Assez sobre.",
      outfit: "Style discret et fonctionnel.",
    },
  },
  {
    tone: "gentil",
    score: 0.95,
    criteria: {
      cheveux: 1.0,
      smile: 0.9,
      makeup: 0.95,
      outfit: 0.95,
    },
    comment: {
      cheveux: "Excellente coupe, très bien réalisée.",
      smile: "Sourire incroyable.",
      makeup: "Maquillage parfaitement dosé.",
      outfit: "Tenue élégante et stylée.",
    },
  },
  {
    tone: "gentil",
    score: 0.61,
    criteria: {
      cheveux: 0.55,
      smile: 0.6,
      makeup: 0.7,
      outfit: 0.6,
    },
    comment: {
      cheveux: "Coiffure à revoir légèrement.",
      smile: "Sourire modéré.",
      makeup: "Assez réussi.",
      outfit: "Tenue neutre, passe-partout.",
    },
  },
  {
    tone: "gentil",
    score: 0.8,
    criteria: {
      cheveux: 0.8,
      smile: 0.8,
      makeup: 0.8,
      outfit: 0.8,
    },
    comment: {
      cheveux: "Très bon look capillaire.",
      smile: "Sourire confiant.",
      makeup: "Rendu très propre.",
      outfit: "Style affirmé et assumé.",
    },
  },
];


router.post("/upload", async (req, res) => {
  const { userToken, imageUrl } = req.body;
  if (!userToken || !imageUrl) {
    return res.status(400).json({ message: "User ID and image URL are required" });
  } 
  const index = Math.floor(Math.random() * analyze.length);
  const { tone, score, criteria, comment } = analyze[index];
  const newPhoto = new Photos({
    userToken: userToken || "invité",
    imageUrl: imageUrl,
    uploadAt: new Date(),
    analyse: [
      {
        tone,
        score,
        criteria,
        comment,
        createAt: new Date(),
      },
    ],
  });
  
  const savedPhoto = await newPhoto.save();
  console.log("New photo data:", newPhoto);
    res.json({
      result: true,
      photo: savedPhoto,
    });
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const photos = await Photos.find({ userId: userId });
  if (!photos) {
    return res.status(404).json({ message: "Photos not found" });
  }
  res.json({
    result: true,
    photos,
  });
});

router.delete("/:photoId", async (req, res) => {
  const photoId = req.params.photoId;
  const photo = await Photos.findByIdAndDelete(photoId);
  if (!photo) {
    return res.status(404).json({ message: "Photo not found" });
  }
  res.json({
    result: true,
    message: "Photo deleted successfully",
  });
});

router.delete("/deleteAll/:userId", async (req, res) => {
  const userId = req.params.userId;
  const photos = await Photos.deleteMany({ userId: userId });
  if (!photos) {
    return res.status(404).json({ message: "Photos not found" });
  }
  res.json({
    result: true,
    message: "All photos deleted successfully",
  });
});

// Route pour ajouter les filtres
router.post("/analyze", (req, res) => {
  const { filters } = req.body;

  if (!filters) {
    return res.status(400).json({ message: "Filtres manquants dans le body" });
  }

  const { zones, tone } = filters;

  console.log("Analyse reçue !");
  console.log("Zones activées :", zones);
  console.log("Degré de gentillesse :", tone);

  // On renvoie les filtres reçus
  res.json({
    result: true,
    message: "Analyse bien reçue",
    filters: {
      zones,
      tone,
    },
  });
});

module.exports = router;
