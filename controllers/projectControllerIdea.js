const fs = require("fs");
const path = require("path");
const ProjectIdea = require("../models/ProjectIdea");
const generateQuote = require("../utils/generateQuote");
const PDFDocument = require("pdfkit");
const sendEmailWithAttachment = require('../utils/sendEmail'); // Importer la fonction

// Soumettre une nouvelle idée de projet
exports.submitProject = async (req, res) => {
    try {
      const { name, email, phone, projectType, description, budget, deadline, additionalInfo } = req.body;
  
      // ✅ Validation des champs requis
      if (!name || !email || !projectType || !description) {
        return res.status(400).json({ error: "Tous les champs requis doivent être fournis." });
      }
  
      // ✅ Validation des champs facultatifs
      if (budget && !["<500€", "500-1000€", "1000-3000€", ">3000€"].includes(budget)) {
        return res.status(400).json({ error: "Budget invalide." });
      }
  
      if (deadline && isNaN(Date.parse(deadline))) {
        return res.status(400).json({ error: "Date limite invalide." });
      }
  
      // ✅ Enregistrement dans la base
      const newIdea = new ProjectIdea({
        name,
        email,
        phone,
        projectType,
        description,
        budget,
        deadline,
        additionalInfo,
      });
  
      const savedIdea = await newIdea.save();
  
      // ✅ Génération du devis PDF
      const fileName = `devis-${savedIdea._id}.pdf`;
      const filePath = path.join(__dirname, "../quotes", fileName);
      try {
        await generateQuote(savedIdea, filePath);
      } catch (pdfErr) {
        console.error("Erreur lors de la génération du PDF :", pdfErr);
      }
       
      // ✅ Optionnel : envoi par email
      await sendEmailWithAttachment(email, filePath);
  
      // ✅ Réponse avec succès + nom du fichier PDF
      res.status(201).json({
        message: "Projet soumis avec succès.",
        fileName,
      });
    } catch (err) {
      console.error("Erreur lors de la soumission du projet :", err);
      res.status(500).json({ error: "Erreur lors de la soumission du projet." });
    }
  };

  exports.downloadQuote = async (req, res) => {
    const { fileName } = req.params;
  
    // Sécuriser le nom de fichier
    if (!fileName || !fileName.endsWith(".pdf")) {
      return res.status(400).json({ error: "Nom de fichier invalide." });
    }
  
    const filePath = path.join(__dirname, "../quotes", fileName);
  
    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Fichier introuvable." });
    }
  
    // Envoyer le fichier
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Erreur lors du téléchargement :", err);
        res.status(500).json({ error: "Erreur lors du téléchargement du fichier." });
      }
    });
  };

// Récupérer toutes les idées
exports.getAllProjects = async (req, res) => {
  try {
    const ideas = await ProjectIdea.find().sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des projets." });
  }
};

// Récupérer une idée spécifique par ID
exports.getProjectById = async (req, res) => {
  try {
    const idea = await ProjectIdea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: "Projet non trouvé." });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération du projet." });
  }
};

// Mettre à jour une idée par ID
exports.updateProject = async (req, res) => {
  try {
    const updated = await ProjectIdea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Projet non trouvé." });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du projet." });
  }
};

// Supprimer une idée par ID
exports.deleteProject = async (req, res) => {
  try {
    const deleted = await ProjectIdea.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Projet non trouvé." });
    res.json({ message: "Projet supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression du projet." });
  }
};
