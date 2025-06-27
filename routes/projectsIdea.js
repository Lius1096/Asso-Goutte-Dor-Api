const express = require("express");
const router = express.Router();
const {
  submitProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  downloadQuote,
  
} = require("../controllers/projectControllerIdea");

// Créer un nouveau projet
router.post("/submit", submitProject);
//router.post("/submit-pdf", submitProjectIdea);

// Télécharger le formulaire
router.get("/download/:fileName", downloadQuote);

// Récupérer tous les projets
router.get("/", getAllProjects);

// Récupérer un seul projet par ID
router.get("/:id", getProjectById);

// Mettre à jour un projet par ID
router.put("/:id", updateProject);

//  Supprimer un projet par ID
router.delete("/:id", deleteProject);

module.exports = router;
