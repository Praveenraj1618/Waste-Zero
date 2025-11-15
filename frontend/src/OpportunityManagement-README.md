# Opportunity Management Module

This module extends the WasteZero application with comprehensive volunteer opportunity management functionality.

## Pages Implemented

### 1. Opportunity Dashboard Page (`/components/pages/OpportunityDashboardPage.tsx`)
- **Route**: `opportunities`
- **Access**: All logged-in users (Volunteers & NGOs)
- **Features**:
  - Grid layout displaying opportunity cards with images
  - Search functionality to filter opportunities by title, description, or location
  - Status filter dropdown (All, Open, In Progress, Closed)
  - **Role-based**: "Create Opportunity" button visible only to NGO users
  - Empty state when no opportunities match filters
  - Each card displays: image, title, status badge, date, location, duration, volunteer count
  - "View Details" button on each card

### 2. Create New Opportunity Page (`/components/pages/CreateOpportunityPage.tsx`)
- **Route**: `create-opportunity`
- **Access**: NGO users only
- **Features**:
  - **Image upload** with drag-and-drop support
  - Image preview with remove/replace functionality
  - File validation (type and size checking)
  - Toast notifications for upload status
  - Form with all required fields (title, description, date, duration, location)
  - Skills tag input system (add/remove skills)
  - Character counter for description
  - Form validation
  - "Create Opportunity" and "Cancel" buttons
  - Back navigation to opportunities dashboard

### 3. Opportunity Detail Page (`/components/pages/OpportunityDetailPage.tsx`)
- **Route**: `opportunity-detail`
- **Access**: All logged-in users
- **Features**:
  - Two-column responsive layout (main content + sidebar)
  - Full-width hero image
  - Complete opportunity information display
  - Required skills displayed as tags
  - Sidebar with key details (date, duration, location, volunteers, posted by)
  - **Role-based actions**:
    - **Volunteers**: "Join Opportunity" button (disabled when already joined or closed)
    - **NGOs (creators)**: "Edit" and "Delete" buttons
  - Delete confirmation modal
  - Responsive design (stacks on mobile)

### 4. Edit Posted Opportunity Page (`/components/pages/EditOpportunityPage.tsx`)
- **Route**: `edit-opportunity`
- **Access**: NGO users only (creators)
- **Features**:
  - Identical layout to Create page
  - **Existing image preview** with ability to replace
  - All form fields pre-filled with existing data
  - Same image upload and skills management functionality
  - "Save Changes" and "Cancel" buttons
  - Back navigation to opportunity detail page

### 5. Delete Confirmation Modal
- **Implementation**: AlertDialog component from shadcn/ui
- **Features**:
  - Warning message with opportunity title
  - "Delete" button (destructive styling)
  - "Cancel" button
  - Overlay that blocks interaction with background

## Image Upload Component (`/components/ImageUpload.tsx`)

A reusable, feature-rich image upload component with the following capabilities:

### Features
- **Drag-and-Drop Interface**: Users can drag images directly onto the upload area
- **Click to Browse**: Traditional file picker for selecting images
- **Image Preview**: Real-time preview of uploaded images in 16:9 aspect ratio
- **File Validation**:
  - File type checking (JPG, PNG, WebP only)
  - File size limit (max 5MB)
  - User-friendly error messages via toast notifications
- **Visual States**:
  - Default state with upload instructions
  - Dragging state with visual feedback
  - Loading state with animated indicator
  - Preview state with hover actions
- **Image Management**:
  - Remove uploaded image
  - Replace existing image
  - Hover overlay showing change/remove options
- **Toast Notifications**:
  - Loading indicator during upload
  - Success confirmation
  - Error messages for invalid files
  - Info message when image is removed
- **Base64 Encoding**: Converts images to base64 data URLs for easy storage
- **Responsive Design**: Works seamlessly on mobile and desktop

### Technical Implementation
- Uses FileReader API for client-side image processing
- Stores images as base64-encoded data URLs
- No server upload required (perfect for prototypes)
- Fully accessible with keyboard navigation
- Green/eco-themed styling matching WasteZero design system

## Navigation Integration

### Header Navigation
- Added "Opportunities" link in main navigation (desktop & mobile)
- Active state highlighting when on opportunities pages

### Dashboard Integration
- **Volunteer Dashboard**: "View All" button added to "Available Volunteer Tasks" card
- **NGO Dashboard**: "Manage Opportunities" button in Quick Actions card

## Design System Consistency

All pages follow the established WasteZero design system:

### Colors Used
- **Primary** (#1e7a4a): Main actions, status badges (Open)
- **Secondary** (#4a90a4): Location icons, supporting elements
- **Accent** (#f59e0b): CTA buttons (Join, Create, duration icons)
- **Destructive** (#dc2626): Delete button
- **Muted**: Card backgrounds, empty states

### Components Used
- Card, CardContent, CardHeader, CardTitle, CardDescription
- Button with variants (default, outline, destructive, ghost)
- Badge for status indicators
- Input and Textarea with background styling
- Label for form fields
- AlertDialog for confirmations
- Select dropdown for filters

### Typography
- Follows default typography system (no custom font classes)
- Uses semantic HTML headings (h1, h2, h3, h4)

### Responsive Design
- Mobile-first approach
- Grid layouts that stack on mobile
- Conditional button placement (mobile vs desktop)
- Container-based responsive spacing

## Mock Data

The module includes 6 sample opportunities covering various environmental activities:
1. Beach Cleanup Drive
2. Community Garden Planting
3. Recycling Center Assistance
4. Urban Tree Planting Initiative
5. River Bank Restoration
6. Park Cleanup & Maintenance

All opportunities include realistic images from Unsplash.

## Role-Based Access Control

### Volunteer Users
- Can view all opportunities
- Can search and filter opportunities
- Can join opportunities
- Cannot create, edit, or delete opportunities

### NGO Users
- Can view all opportunities
- Can create new opportunities
- Can edit their posted opportunities
- Can delete their posted opportunities
- See "Create Opportunity" button on dashboard
- Cannot join opportunities (assumed they manage them)

## State Management

- Uses existing App.tsx state-based routing system
- Added `selectedOpportunityId` state to track which opportunity is being viewed/edited
- `handleNavigate` function extended to accept optional `opportunityId` parameter
- Protected routes redirect to login if not authenticated
- Role-based route protection (NGO-only pages)

## Future Enhancements (Not Implemented)

These would require backend integration:
- Real API calls for CRUD operations
- User authentication and authorization
- **Server-side image storage** (currently using base64 in-memory)
- **Image optimization** and automatic resizing
- Real-time volunteer count updates
- Email notifications
- Calendar integration
- Comments/reviews system
- Volunteer application workflow
- Multi-image gallery (currently single image)
- Map integration for locations
- **Image CDN integration** for better performance

## Testing the Module

1. **As a Volunteer**:
   - Login with any email (without 'ngo' in it)
   - Navigate to Opportunities via header or dashboard
   - Search and filter opportunities
   - Click "View Details" on any card
   - Try to join an opportunity
   - Notice you cannot see Edit/Delete buttons

2. **As an NGO**:
   - Login with email containing 'ngo' (e.g., greenearth.ngo@example.com)
   - Navigate to Opportunities
   - See the "Create Opportunity" button
   - Click to create a new opportunity
   - Fill out and submit the form
   - View any opportunity detail
   - See Edit and Delete buttons
   - Try editing an opportunity
   - Try deleting (confirm in modal)

## File Structure

```
/components/
├── ImageUpload.tsx (Reusable image upload component)
└── pages/
    ├── OpportunityDashboardPage.tsx (Main listing)
    ├── CreateOpportunityPage.tsx (Creation form with image upload)
    ├── OpportunityDetailPage.tsx (Detail view)
    └── EditOpportunityPage.tsx (Edit form with image upload)

/App.tsx (Updated with new routes and Toaster)
/components/Header.tsx (Updated with Opportunities link)
/components/pages/DashboardPage.tsx (Updated with navigation links)
/components/ui/sonner.tsx (Toast notification system)
```

## Image Upload Usage Notes

### In Create/Edit Pages
```tsx
<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  onRemove={() => setImageUrl("")}
/>
```

### Storage Format
Images are stored as base64-encoded data URLs. In a production environment, you would:
1. Upload the file to a storage service (AWS S3, Cloudinary, etc.)
2. Store the URL in your database
3. Use the URL to display the image

### Browser Considerations
- Base64 encoding increases file size by ~33%
- Large images may impact performance
- Consider implementing image compression before encoding
- localStorage has size limits (~5-10MB) for persistence
