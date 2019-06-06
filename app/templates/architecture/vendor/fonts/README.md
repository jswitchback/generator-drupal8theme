
////////////////////////////////////////
//////////// ICON FONTS ///////////////

A base icon font is in place from Icomoon (https://icomoon.io/). A visual represeantaiton of existing icons can be viewed by opening [THEME]/vendor/fonts/source/icomoon/demo.html in a browser. The icon set can be extended or completely replaced as needed. Here are the steps to extend:

1. Go to the icomoon app in the browser (https://icomoon.io/app/#/select). Remove existing icon sets.

2. Click "Import Icons". Find the original downloaded files from Icomoon. Typically [THEME]/vendor/fonts/source/icomoon and select the selections.json file. Click "yes" to accept settings from the imported icon set. Your icons should be display in the content area. Using the selection.json files allows you to add new icons without changing the classes of the existing ones.

3. Click "Add Icons From Library…". Choose an icon set. Typically Font Awesome or another free icon set.

4. Select additional icons needed. Deselect any that won't be used.

5. Click "Generate Font" in the fixed footer. Click the "Download" button in the same fixed footer. Place zip file in the vendor directory for easier manipulation of files.

6. Open zip file. Replace all old font files with new. Typically this includes replacing the font files found in the /vendor/fonts, like /vendor/fonts/icomoon.ttf, with their unzipped equivalents.

7. Update the theme css with the new styles.css. You should only need to replace the "icon-..." rules like:

.icon-user:before {
  content: "\f007";
}

Icon font rules for the theme are typically found in [THEME]/src/sass/01_atoms/icon-font.scss.
