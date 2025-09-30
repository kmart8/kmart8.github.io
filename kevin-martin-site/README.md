# Kevin Martin - Personal Website

A modern, responsive personal website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Clean, minimalist design inspired by contemporary personal websites
- **Responsive**: Fully responsive design that works on all devices
- **Interactive**: Smooth animations and transitions
- **Accessible**: Built with accessibility best practices
- **Fast**: Optimized for performance with Next.js

## Sections

- **Hero**: Introduction with name and professional focus
- **About**: Personal background and current work
- **Experience**: Interactive carousel showcasing work history
- **Projects**: Toggleable sections for Data Science and Software Engineering projects
- **Contact**: Social links and contact information

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icons
- **React Hooks**: State management and interactivity

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The site is ready for deployment on platforms like Vercel, Netlify, or any static hosting service.

```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page component
```

## Customization

To customize the content:

1. Update personal information in `src/app/page.tsx`
2. Modify the experience data in the `experiences` array
3. Update project information in the `dataScienceProjects` and `softwareProjects` arrays
4. Change contact links in the contact section

## License

This project is open source and available under the [MIT License](LICENSE).