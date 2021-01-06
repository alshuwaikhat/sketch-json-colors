import sketch from "sketch";

// documentation: https://developer.sketchapp.com/reference/api/

export default async () => {
  const savePanel = NSSavePanel.savePanel();
  savePanel.canCreateDirectories = true;
  savePanel.showsTagField = false;
  savePanel.nameFieldStringValue = "colors.json";

  const openPanelButtonPressed = savePanel.runModal();

  if (openPanelButtonPressed == NSFileHandlingPanelOKButton) {
    var filePath = savePanel.URL().path();
    const fileData = await executeExport();
    const file = NSString.stringWithString(JSON.stringify(fileData));
    file.writeToFile_atomically_encoding_error_(
      filePath,
      true,
      NSUTF8StringEncoding,
      null
    );
    sketch.UI.message("Export completed ✅");
  }
};

// Parse export file data
const executeExport = () => {
  return new Promise((resolve) => {
    const doc = sketch.getSelectedDocument();
    const swatches = doc.swatches;
    let colors = {};
    swatches.map((swatch) => {
      if (swatch.type === "Swatch") {
        let [base, density] = swatch.name.replace(/\s/g, "").split("/");
        if (!colors.hasOwnProperty(base)) {
          colors[base] = {};
        }
        colors[base][density] = swatch.color;
      }
    });
    resolve(colors);
  });
};
