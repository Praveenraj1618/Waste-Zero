# Image Upload Feature - Quick Start Guide

## Overview
The WasteZero Opportunity Management module now includes a professional image upload system that allows NGOs to add custom photos to their volunteer opportunities.

## How to Use

### For NGO Users Creating Opportunities

1. **Navigate to Create Opportunity**
   - Login with an NGO account (email containing 'ngo')
   - Click "Opportunities" in the navigation
   - Click the "+ Create Opportunity" button

2. **Upload an Image**
   - You have two options:
     - **Drag & Drop**: Drag an image file from your computer onto the upload area
     - **Click to Browse**: Click anywhere in the upload area to open the file picker

3. **Image Requirements**
   - **Supported formats**: JPG, PNG, WebP
   - **Maximum file size**: 5MB
   - **Recommended dimensions**: 1200x675px (16:9 aspect ratio)

4. **Preview & Manage**
   - Once uploaded, you'll see a preview of your image
   - Hover over the image to reveal:
     - **Remove button** (red X in top-right corner)
     - **Change Image button** (at the bottom)

5. **Complete the Form**
   - Fill in the remaining fields (title, description, etc.)
   - Click "Create Opportunity"

### For Editing Existing Opportunities

1. **Navigate to the Opportunity**
   - Go to the opportunity detail page
   - Click the "Edit" button (NGO creators only)

2. **Manage the Image**
   - The current image will be displayed
   - Hover to see change/remove options
   - Upload a new image to replace the existing one
   - Or remove it and upload a different one

3. **Save Changes**
   - Click "Save Changes" to update the opportunity

## Visual Feedback

The system provides real-time feedback through toast notifications:

- **Loading**: "Uploading image..." with animated indicator
- **Success**: "Image uploaded successfully" with checkmark
- **Error**: Helpful error messages if:
  - File type is not supported
  - File size exceeds 5MB
  - Upload process fails
- **Info**: Confirmation when image is removed

## Best Practices

### Choosing the Right Image

✅ **Do:**
- Use high-quality, well-lit photos
- Choose images that clearly show the activity (cleanup, planting, etc.)
- Feature people engaged in volunteer work
- Use landscape-oriented images (16:9 ratio works best)
- Ensure the image is relevant to the opportunity

❌ **Don't:**
- Use blurry or low-resolution images
- Upload copyrighted images without permission
- Use images with excessive text overlays
- Choose generic stock photos when possible

### Image Size & Quality Tips

1. **Optimize Before Upload**
   - Use image editing tools to resize large photos
   - Compress images to reduce file size while maintaining quality
   - Aim for 1200px width for best results

2. **File Size Management**
   - If you get a "file too large" error, compress your image
   - Most modern phones take very large photos - resize before uploading
   - Online tools like TinyPNG can help reduce file size

3. **Aspect Ratio**
   - The 16:9 ratio (like 1920x1080, 1280x720, 1200x675) works best
   - Images are automatically displayed in this ratio
   - Other ratios will be cropped to fit

## Technical Details

### How It Works

1. **Client-Side Processing**: Images are processed entirely in your browser
2. **Base64 Encoding**: Images are converted to base64 data URLs
3. **No Server Upload**: Perfect for prototyping (no backend required)
4. **Instant Preview**: See your image immediately after upload

### Storage Notes

- Images are currently stored in memory as base64 strings
- This is perfect for prototyping and demos
- In production, you would:
  - Upload to cloud storage (AWS S3, Cloudinary, etc.)
  - Store only the URL in your database
  - Use a CDN for faster loading

### Browser Compatibility

The image upload feature works on all modern browsers:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility

- Full keyboard navigation support
- Screen reader compatible
- Clear focus indicators
- Descriptive ARIA labels

## Troubleshooting

### "Invalid file type" Error
**Solution**: Ensure your file is a JPG, PNG, or WebP image. Convert other formats using an image editor.

### "File too large" Error
**Solution**: Your image exceeds 5MB. Use an image compression tool or resize the image.

### Upload Appears Stuck
**Solution**: 
- Check your internet connection
- Try refreshing the page
- Ensure the file isn't corrupted
- Try a smaller image

### Image Looks Distorted
**Solution**: Use an image with a 16:9 aspect ratio, or crop your image before uploading.

### Can't Remove Image
**Solution**: Hover over the image preview - the remove button appears in the top-right corner on hover.

## Mobile Usage

The image upload works great on mobile devices:

1. **Tap the upload area** to open the camera/photo picker
2. **Choose from**:
   - Take a new photo
   - Select from photo library
3. **Preview and manage** the uploaded image
4. All features work the same as desktop

## Example Workflow

```
1. Click "+ Create Opportunity"
2. Drag beach cleanup photo onto upload area
3. See "Uploading image..." notification
4. See "Image uploaded successfully" with preview
5. Hover over image to verify it looks good
6. If not happy, click "Change Image" to try another
7. Fill in opportunity details
8. Click "Create Opportunity"
9. Image appears on opportunity card and detail page
```

## Future Enhancements

Planned improvements include:
- Multiple image upload (image gallery)
- Image cropping tool
- Filters and adjustments
- Automatic image optimization
- Direct camera access on mobile
- Image library/stock photo integration
- AI-powered image suggestions

## Support

If you encounter any issues with image upload:
1. Check the console for error messages
2. Verify your image meets the requirements
3. Try a different image to isolate the issue
4. Clear browser cache and try again

---

**Pro Tip**: Keep a folder of high-quality environmental photos ready to use. Images with volunteers in action, clean environments, and vibrant nature scenes perform best!
