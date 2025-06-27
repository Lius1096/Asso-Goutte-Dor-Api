const mongoose = require("mongoose");

const projectIdeaSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
        default: null,  // Permet de le laisser vide
      },
      projectType: {
        type: String,
        enum: ["Site vitrine", "E-commerce", "Blog", "Portfolio", "Autre"],
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      budget: {
        type: String,
        enum: ["<500€", "500-1000€", "1000-3000€", ">3000€"],
        default: null,  // Permet de laisser vide
      },
      deadline: {
        type: String, // ou Date si plus précis
        default: null,  // Permet de laisser vide
      },
      additionalInfo: {
        type: String,
        default: null,  // Permet de laisser vide
      },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("ProjectIdea", projectIdeaSchema);
  