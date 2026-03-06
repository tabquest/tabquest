# Tabquest

Tabquest is an open-source productivity monorepo designed to help you manage bookmarks, tasks, and notes with a clean and customizable interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Project Structure

This project is a `pnpm` monorepo containing multiple packages:
- `extension/` - The core Chrome/Firefox/Edge browser extension.
- `web/` - Web dashboard (Coming soon).
- `api/` - Backend services (Coming soon).

## Development

First, install dependencies from the root:
```bash
  pnpm install
```

To start the extension development server, run:
```bash
  pnpm dev:extension
```

## Build

To create a production build for the extension:

```bash
  pnpm build:extension
```

## Features

- <b>Bookmarks Management</b>: Save, organize, and search bookmarks effortlessly.

- <b>Tasks (Todos)</b>: Keep track of your to-dos with a simple and intuitive interface.

- <b>Notes and Code Snippets</b>: Create and search notes, with support for code snippets.

- <b>Customizable Home Page</b>: Personalize your home page for quick access to your favorite sites and social media.

- <b>Clean, Professional UI</b>: Enjoy a consistent and visually appealing interface.

## Tech Stack

**Client:** React, Redux, TailwindCSS, Vite, Framer-motion


## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) to learn how you can help!

## License

This project is licensed under the [MIT License](LICENSE).
