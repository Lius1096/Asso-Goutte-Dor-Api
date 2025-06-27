

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateQuote = (data, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      const primaryColor = "#0F172A";
      const accentColor = "#7C3AED";
      const lightGray = "#F3F4F6";

      const tableStartY = 160;
      let currentY = tableStartY;

      // Logo
      const logoPath = path.join(__dirname, "../assets/logo.png");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 40, { width: 100 });
      }

      // Titre principal
      doc
        .fillColor(primaryColor)
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("DEVIS DE PROJET", 0, 50, { align: "center" });

      // ============================
      // TABLEAU INFOS CLIENT & PROJET
      // ============================

      const entries = [
        ["Nom", data.name],
        ["Email", data.email],
        ["Téléphone", data.phone || "Non fourni"],
        ["Type de projet", data.projectType],
        ["Date limite", data.deadline || "Non précisée"],
        ["Budget estimé", data.budget || "Non précisé"],
      ];

      drawTable(doc, entries, currentY);
      currentY += entries.length * 25 + 40;

      // ============================
      // Description du projet
      // ============================
      doc
        .font("Helvetica-Bold")
        .fillColor(accentColor)
        .fontSize(14)
        .text("Description du projet", 50, currentY);
      currentY = doc.y + 5;

      doc
        .fillColor("black")
        .font("Helvetica")
        .fontSize(12)
        .text(data.description, 50, currentY, {
          width: 500,
          lineGap: 4,
        });

      currentY = doc.y + 20;

      // ============================
      // Infos supplémentaires
      // ============================
      if (data.additionalInfo) {
        doc
          .font("Helvetica-Bold")
          .fillColor(accentColor)
          .fontSize(14)
          .text("Informations supplémentaires", 50, currentY);
        currentY = doc.y + 5;

        doc
          .fillColor("black")
          .font("Helvetica")
          .fontSize(12)
          .text(data.additionalInfo, 50, currentY, {
            width: 500,
            lineGap: 4,
          });

        currentY = doc.y + 20;
      }

      // ============================
      // Footer
      // ============================
      doc
        .moveDown(2)
        .font("Helvetica")
        .fontSize(12)
        .fillColor(primaryColor)
        .text("Merci pour votre demande. Nous vous répondrons sous peu.", {
          align: "center",
        });

      doc.end();
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};

// Fonction pour dessiner un tableau simple avec bordures
function drawTable(doc, rows, y) {
  const cellHeight = 25;
  const labelWidth = 150;
  const valueWidth = 400;

  doc.font("Helvetica");

  rows.forEach(([label, value], i) => {
    const rowY = y + i * cellHeight;

    // Background alternate rows
    if (i % 2 === 0) {
      doc.rect(50, rowY, labelWidth + valueWidth, cellHeight)
        .fill("#F9FAFB")
        .fillColor("black");
    }

    // Borders
    doc
      .lineWidth(0.5)
      .strokeColor("#D1D5DB")
      .rect(50, rowY, labelWidth, cellHeight)
      .stroke()
      .rect(50 + labelWidth, rowY, valueWidth, cellHeight)
      .stroke();

    // Text
    doc
      .fillColor("#0F172A")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(label, 55, rowY + 7, { width: labelWidth - 10 });

    doc
      .fillColor("black")
      .font("Helvetica")
      .text(value, 55 + labelWidth, rowY + 7, { width: valueWidth - 10 });
  });
}

module.exports = generateQuote;
