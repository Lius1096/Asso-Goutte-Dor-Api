const fs = require('fs');
const path = require('path');

// Supprimer un fichier s'il existe
const deleteFileIfExists = (relativePath) => {
  if (!relativePath) return;

  const filePath = path.join(__dirname, '..', relativePath);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`Erreur lors de la suppression du fichier ${filePath} :`, err);
    }
  });
};

module.exports = {
  deleteFileIfExists,
};
