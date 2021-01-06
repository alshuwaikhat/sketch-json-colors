import sketch from "sketch";

// documentation: https://developer.sketchapp.com/reference/api/

export default function () {
  const Swatch = sketch.Swatch;
  const doc = sketch.getSelectedDocument();

  const importJson = (jsonFile) => {
    Object.keys(jsonFile).forEach((color) => {
      Object.keys(jsonFile[color]).forEach((density) => {
        const swatch = Swatch.from({
          name: `${color} /  ${density}`,
          color: jsonFile[color][density],
        });
        doc.swatches.push(swatch);
      });
    });
    sketch.UI.message("Import completed ✅");
  };

  const openPanel = NSOpenPanel.openPanel();
  openPanel.setTitle("Choose a JSON File");
  openPanel.setCanCreateDirectories = false;
  openPanel.setCanChooseFiles = true;

  const fileTypes = ["json"];
  const openPanelButtonPressed = openPanel.runModalForDirectory_file_types_(
    nil,
    nil,
    fileTypes
  );

  if (openPanelButtonPressed == NSFileHandlingPanelOKButton) {
    var filePath = openPanel.URL().path();
    var selectedJson = JSON.parse(NSString.stringWithContentsOfFile(filePath));

    log("Open File from: " + filePath);

    importJson(selectedJson);
  }
}
