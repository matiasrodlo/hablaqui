# Hablaquí Landing Page

The landing page for Hablaquí, a platform connecting users with online therapy specialists. Built with Nuxt.js, this application provides a modern, responsive interface for users to discover and connect with therapy specialists.

## Features

- Responsive design optimized for all devices
- Specialist search and filtering
- User authentication and profile management
- Online session booking
- Real-time chat functionality
- Payment processing integration
- SEO optimization
- Analytics integration

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Environment Setup

1. Clone the repository
2. Create a `.env` file in the root directory
3. Add the following environment variables:
   ```
   VUE_APP_LANDING=<your-landing-url>
   VUE_APP_URL=<your-api-url>
   API_ABSOLUTE=<your-absolute-api-url>
   ```

## Build Setup

```bash
# Install dependencies
$ npm install

# Serve with hot reload at localhost:9000
$ npm run dev

# Build for production and launch server
$ npm run build
$ npm run start

# Generate static project
$ npm run generate

# Run linting and code formatting
$ npm run code-check

# Create environment file from current environment
$ npm run create-env
```

## Project Structure

```
landing/
├── assets/          # Global assets (SCSS, images)
├── components/      # Vue components
├── layouts/         # Page layouts
├── pages/          # Application pages
├── plugins/        # Nuxt plugins
├── static/         # Static files
├── store/          # Vuex store
└── utils/          # Utility functions
```

## Development

- The application runs on port 9000 in development mode
- Hot reloading is enabled for development
- ESLint and Prettier are configured for code quality
- Vuetify is used for UI components

## Production

- Static site generation is used for production
- The application is optimized for performance
- SEO meta tags are automatically generated
- Analytics and tracking are enabled

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run code-check` to ensure code quality
4. Submit a pull request

## Documentation

For detailed explanation on how things work, check out:
- [Nuxt.js docs](https://nuxtjs.org)
- [Vuetify docs](https://vuetifyjs.com)
- [Vue.js docs](https://vuejs.org)

## License

This project is private and confidential.
