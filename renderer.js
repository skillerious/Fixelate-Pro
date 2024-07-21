document.getElementById('select-files').addEventListener('click', async () => {
  const filePaths = await window.electronAPI.selectFiles();
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = '';
  filePaths.forEach(filePath => {
    const li = document.createElement('li');
    li.textContent = filePath;
    fileList.appendChild(li);
  });
});

document.getElementById('select-resize-files').addEventListener('click', async () => {
  const filePaths = await window.electronAPI.selectFiles();
  const fileList = document.getElementById('resize-file-list');
  const imageInfo = document.getElementById('image-info');
  const imageDimensions = document.getElementById('image-dimensions');
  const imageSize = document.getElementById('image-size');
  const imagePreview = document.getElementById('image-preview');
  const resizeOptions = document.getElementById('resize-options');
  const resizeActionButtons = document.getElementById('resize-action-buttons');
  const clearResizeFilesButton = document.getElementById('clear-resize-files');
  const customSizeSection = document.getElementById('custom-size-section');
  const iconSizesSection = document.getElementById('icon-sizes-section');
  const previewContainer = document.getElementById('resize-preview');
  const iconPreviews = document.getElementById('icon-previews');
  const saveResizedButton = document.getElementById('save-resized-button');
  const bulkResizeButton = document.getElementById('bulk-resize-button');
  const imageSavedPath = document.getElementById('image-saved-path');
  const openSavePathButton = document.getElementById('open-save-path-button');
  const resizePreviewText = document.getElementById('resize-preview-text');
  const iconPreviewsText = document.getElementById('icon-previews-text');

  fileList.innerHTML = '';
  imageInfo.style.display = 'none';
  resizeOptions.style.display = 'none';
  resizeActionButtons.style.display = 'none';
  clearResizeFilesButton.style.display = 'none';
  previewContainer.style.display = 'none';
  iconPreviews.style.display = 'none';
  saveResizedButton.style.display = 'none';
  bulkResizeButton.style.display = 'none';
  customSizeSection.style.display = 'none';
  iconSizesSection.style.display = 'none';
  imageSavedPath.style.display = 'none';
  openSavePathButton.style.display = 'none';
  resizePreviewText.style.display = 'none';
  iconPreviewsText.style.display = 'none';

  if (filePaths.length > 0) {
    const filePath = filePaths[0];  // Only display info for the first selected file
    const metadata = await window.electronAPI.getImageMetadata(filePath);

    imageDimensions.textContent = `Dimensions: ${metadata.width}x${metadata.height}`;
    imageSize.textContent = `Size: ${(metadata.size / 1024).toFixed(2)} KB`;
    imagePreview.src = filePath;
    imageInfo.style.display = 'block';
    resizeOptions.style.display = 'block';
    clearResizeFilesButton.style.display = 'block';
  }

  filePaths.forEach(filePath => {
    const li = document.createElement('li');
    li.textContent = filePath;
    fileList.appendChild(li);
  });
});

document.getElementById('clear-resize-files').addEventListener('click', () => {
  const fileList = document.getElementById('resize-file-list');
  const imageInfo = document.getElementById('image-info');
  const resizeOptions = document.getElementById('resize-options');
  const resizeActionButtons = document.getElementById('resize-action-buttons');
  const previewContainer = document.getElementById('resize-preview');
  const iconPreviews = document.getElementById('icon-previews');
  const clearResizeFilesButton = document.getElementById('clear-resize-files');
  const customSizeSection = document.getElementById('custom-size-section');
  const iconSizesSection = document.getElementById('icon-sizes-section');
  const saveResizedButton = document.getElementById('save-resized-button');
  const bulkResizeButton = document.getElementById('bulk-resize-button');
  const widthInput = document.getElementById('width-input');
  const heightInput = document.getElementById('height-input');
  const resizedImagePreview = document.getElementById('resized-image-preview');
  const iconPreviewContainer = document.getElementById('icon-preview-container');
  const imageSavedPath = document.getElementById('image-saved-path');
  const openSavePathButton = document.getElementById('open-save-path-button');
  const resizePreviewText = document.getElementById('resize-preview-text');
  const iconPreviewsText = document.getElementById('icon-previews-text');

  fileList.innerHTML = '';
  imageInfo.style.display = 'none';
  resizeOptions.style.display = 'none';
  resizeActionButtons.style.display = 'none';
  previewContainer.style.display = 'none';
  iconPreviews.style.display = 'none';
  clearResizeFilesButton.style.display = 'none';
  customSizeSection.style.display = 'none';
  iconSizesSection.style.display = 'none';
  saveResizedButton.style.display = 'none';
  bulkResizeButton.style.display = 'none';
  widthInput.value = '';
  heightInput.value = '';
  resizedImagePreview.src = ''; // Clear the resized image preview
  iconPreviewContainer.innerHTML = ''; // Clear the icon previews
  imageSavedPath.style.display = 'none';
  openSavePathButton.style.display = 'none';
  resizePreviewText.style.display = 'none';
  iconPreviewsText.style.display = 'none';
});

document.getElementById('icon-sizes-button').addEventListener('click', () => {
  document.getElementById('icon-sizes-section').style.display = 'block';
  document.getElementById('custom-size-section').style.display = 'none';
  document.getElementById('resize-action-buttons').style.display = 'block';
  document.getElementById('icon-previews').style.display = 'none';
  document.getElementById('resize-preview').style.display = 'none';
  document.getElementById('resize-preview-text').style.display = 'none';
  document.getElementById('save-resized-button').style.display = 'none';
  document.getElementById('bulk-resize-button').style.display = 'none';
  document.getElementById('icon-previews-text').style.display = 'none';
});

document.getElementById('custom-size-button').addEventListener('click', () => {
  document.getElementById('icon-sizes-section').style.display = 'none';
  document.getElementById('custom-size-section').style.display = 'block';
  document.getElementById('resize-action-buttons').style.display = 'block';
  document.getElementById('icon-previews').style.display = 'none';
  document.getElementById('resize-preview').style.display = 'none';
  document.getElementById('resize-preview-text').style.display = 'none';
  document.getElementById('save-resized-button').style.display = 'none';
  document.getElementById('bulk-resize-button').style.display = 'none';
});

document.getElementById('resize-button').addEventListener('click', async () => {
  const filePaths = Array.from(document.getElementById('resize-file-list').children).map(li => li.textContent);
  console.log('Selected files for resizing:', filePaths);  // Log selected file paths
  const progressBar = document.getElementById('resize-progress-bar');
  const progressContainer = document.getElementById('resize-progress-container');
  const previewContainer = document.getElementById('resize-preview');
  const resizedImagePreview = document.getElementById('resized-image-preview');
  const resizedImageDimensions = document.getElementById('resized-image-dimensions');
  const saveButton = document.getElementById('save-resized-button');
  const bulkSaveButton = document.getElementById('bulk-resize-button');
  const resizeCompleteText = document.getElementById('resize-complete-text');
  const imageSavedPath = document.getElementById('image-saved-path');
  const savedImagePath = document.getElementById('saved-image-path');
  const openSavePathButton = document.getElementById('open-save-path-button');
  const iconPreviewContainer = document.getElementById('icon-preview-container');
  const iconPreviews = document.getElementById('icon-previews');
  const customSizeSection = document.getElementById('custom-size-section');
  const iconSizesSection = document.getElementById('icon-sizes-section');
  const resizePreviewText = document.getElementById('resize-preview-text');
  const iconPreviewsText = document.getElementById('icon-previews-text');

  const settings = await window.electronAPI.loadSettings();
  const outputDirectory = settings.resizeOutputDir || path.dirname(filePaths[0]);

  const isIconSizeSelected = iconSizesSection.style.display === 'block';
  const iconSizes = [];
  if (isIconSizeSelected) {
    if (document.getElementById('size-16').checked) iconSizes.push({ width: 16, height: 16 });
    if (document.getElementById('size-32').checked) iconSizes.push({ width: 32, height: 32 });
    if (document.getElementById('size-64').checked) iconSizes.push({ width: 64, height: 64 });
    if (document.getElementById('size-128').checked) iconSizes.push({ width: 128, height: 128 });
    if (document.getElementById('size-256').checked) iconSizes.push({ width: 256, height: 256 });
  } else {
    const width = parseInt(document.getElementById('width-input').value);
    const height = parseInt(document.getElementById('height-input').value);
    iconSizes.push({ width, height });
  }

  console.log(`Resizing to dimensions: ${iconSizes.map(size => `${size.width}x${size.height}`).join(', ')}`);

  progressContainer.style.display = 'block';
  previewContainer.style.display = 'none';
  resizePreviewText.style.display = 'none';
  saveButton.style.display = 'none';
  bulkSaveButton.style.display = 'none';
  resizeCompleteText.style.display = 'none';
  imageSavedPath.style.display = 'none';
  openSavePathButton.style.display = 'none';
  iconPreviews.style.display = 'none';
  iconPreviewsText.style.display = 'none';
  progressBar.style.width = '0%';
  progressBar.textContent = '0%';

  const sizesToResize = iconSizes.length > 0 ? iconSizes : [{ width, height }];

  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    try {
      iconPreviewContainer.innerHTML = '';  // Clear previous previews
      for (const size of sizesToResize) {
        console.log(`Resizing file: ${filePath} to ${size.width}x${size.height}`);
        const resizedImageBuffer = await window.electronAPI.resizeImage({ filePath, width: size.width, height: size.height });
        console.log(`Resized: ${filePath}`);
        const progress = ((i + 1) / filePaths.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${Math.round(progress)}%`;

        if (i === 0 && size === sizesToResize[0]) {  // Preview only the first resized image
          const blob = new Blob([resizedImageBuffer], { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          resizedImagePreview.src = url;
          resizedImageDimensions.textContent = `New Dimensions: ${size.width}x${size.height}`;
          if (!isIconSizeSelected) {
            previewContainer.style.display = 'block';
            saveButton.style.display = 'block';
            resizePreviewText.style.display = 'block';
          } else {
            previewContainer.style.display = 'none';
            saveButton.style.display = 'none';
            resizePreviewText.style.display = 'none';
          }

          bulkSaveButton.style.display = 'block';
          iconPreviewsText.style.display = 'block';

          saveButton.onclick = async () => {
            const savedPath = await window.electronAPI.saveResizedImage({
              filePath,
              buffer: resizedImageBuffer,
              width: size.width,
              height: size.height,
              outputDirectory
            });
            savedImagePath.textContent = savedPath;
            imageSavedPath.style.display = 'inline';
            openSavePathButton.style.display = 'inline';

            openSavePathButton.onclick = () => {
              window.electronAPI.openPath(savedPath);
            };
          };

          previewContainer.scrollIntoView({ behavior: 'smooth' });
        }

        // Add preview for icon sizes
        const iconBlob = new Blob([resizedImageBuffer], { type: 'image/jpeg' });
        const iconUrl = URL.createObjectURL(iconBlob);
        const iconImg = document.createElement('img');
        iconImg.src = iconUrl;
        iconImg.alt = `Icon ${size.width}x${size.height}`;
        iconImg.style.margin = '5px';
        iconImg.style.border = '1px solid #ccc';
        iconImg.style.width = `${size.width}px`; // Maintain the original aspect ratio
        iconImg.style.height = `${size.height}px`; // Maintain the original aspect ratio
        iconPreviewContainer.appendChild(iconImg);
      }
    } catch (error) {
      console.error('Resizing failed:', error);
      alert(`Failed to resize ${filePath}: ${error.message}`);
    }
  }

  progressContainer.style.display = 'none';
  resizeCompleteText.style.display = 'inline';
  if (isIconSizeSelected) {
    iconPreviews.style.display = 'block';
    iconPreviewsText.style.display = 'block';
  } else {
    iconPreviews.style.display = 'none';
    iconPreviewsText.style.display = 'none';
  }
});

document.getElementById('bulk-resize-button').addEventListener('click', async () => {
  const filePaths = Array.from(document.getElementById('resize-file-list').children).map(li => li.textContent);
  const progressBar = document.getElementById('resize-progress-bar');
  const progressContainer = document.getElementById('resize-progress-container');
  const resizeCompleteText = document.getElementById('resize-complete-text');
  const imageSavedPath = document.getElementById('image-saved-path');
  const savedImagePath = document.getElementById('saved-image-path');
  const openSavePathButton = document.getElementById('open-save-path-button');

  const isIconSizeSelected = document.getElementById('icon-sizes-section').style.display === 'block';
  const iconSizes = [];
  if (isIconSizeSelected) {
    if (document.getElementById('size-16').checked) iconSizes.push({ width: 16, height: 16 });
    if (document.getElementById('size-32').checked) iconSizes.push({ width: 32, height: 32 });
    if (document.getElementById('size-64').checked) iconSizes.push({ width: 64, height: 64 });
    if (document.getElementById('size-128').checked) iconSizes.push({ width: 128, height: 128 });
    if (document.getElementById('size-256').checked) iconSizes.push({ width: 256, height: 256 });
  } else {
    const width = parseInt(document.getElementById('width-input').value);
    const height = parseInt(document.getElementById('height-input').value);
    iconSizes.push({ width, height });
  }

  console.log(`Resizing to dimensions: ${iconSizes.map(size => `${size.width}x${size.height}`).join(', ')}`);

  progressContainer.style.display = 'block';
  resizeCompleteText.style.display = 'none';
  imageSavedPath.style.display = 'none';
  openSavePathButton.style.display = 'none';
  progressBar.style.width = '0%';
  progressBar.textContent = '0%';

  try {
    // Open a save dialog to get the desired location for saving the zip file
    const { canceled, filePath } = await window.electronAPI.showSaveDialog({
      title: 'Save Resized Images as Zip',
      buttonLabel: 'Save',
      defaultPath: 'resized_images.zip',
      filters: [{ name: 'Zip Files', extensions: ['zip'] }]
    });

    if (canceled || !filePath) {
      alert('Save operation canceled.');
      progressContainer.style.display = 'none';
      resizeCompleteText.style.display = 'none';
      return;
    }

    const zipFilePath = await window.electronAPI.saveBulkResizedImagesAsZip({ filePaths, sizes: iconSizes, zipFilePath: filePath });
    savedImagePath.textContent = zipFilePath;
    imageSavedPath.style.display = 'inline';
    openSavePathButton.style.display = 'inline';

    openSavePathButton.onclick = () => {
      window.electronAPI.openPath(zipFilePath);
    };

    alert(`Bulk resized images saved to: ${zipFilePath}`);
  } catch (error) {
    console.error('Bulk resizing failed:', error);
    alert(`Failed to bulk resize images: ${error.message}`);
  }

  progressContainer.style.display = 'none';
  resizeCompleteText.style.display = 'inline';
});

document.getElementById('select-output-directory-resize').addEventListener('click', async () => {
  const directoryPath = await window.electronAPI.selectDirectory();
  document.getElementById('output-directory-resize').value = directoryPath;
});

document.getElementById('select-output-directory-convert').addEventListener('click', async () => {
  const directoryPath = await window.electronAPI.selectDirectory();
  document.getElementById('output-directory-convert').value = directoryPath;
});

document.getElementById('save-settings-button').addEventListener('click', async () => {
  const resizeOutputDir = document.getElementById('output-directory-resize').value;
  const convertOutputDir = document.getElementById('output-directory-convert').value;

  await window.electronAPI.saveSettings({
    resizeOutputDir,
    convertOutputDir
  });

  alert('Settings saved!');
});

document.getElementById('open-output-directory-resize').addEventListener('click', async () => {
  const directoryPath = document.getElementById('output-directory-resize').value;
  if (directoryPath) {
    await window.electronAPI.openDirectory(directoryPath);
  } else {
    alert('No directory selected');
  }
});

document.getElementById('open-output-directory-convert').addEventListener('click', async () => {
  const directoryPath = document.getElementById('output-directory-convert').value;
  if (directoryPath) {
    await window.electronAPI.openDirectory(directoryPath);
  } else {
    alert('No directory selected');
  }
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    document.querySelector(`#${link.getAttribute('data-section')}-section`).classList.add('active');
    document.querySelectorAll('.nav-link').forEach(navLink => {
      navLink.classList.remove('active');
    });
    link.classList.add('active');
  });
});

// Initial load
document.querySelector('.nav-link[data-section="convert"]').click();

// Load settings on startup
window.addEventListener('DOMContentLoaded', async () => {
  const settings = await window.electronAPI.loadSettings();
  document.getElementById('output-directory-resize').value = settings.resizeOutputDir || '';
  document.getElementById('output-directory-convert').value = settings.convertOutputDir || '';
});
