# Sunset Clock

This project implements the old Arabic time calculation system which considers sunset as midnight and the day starts from there.

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Description
The Sunset Clock project is a web-based application that calculates time based on the old Arabic system where the day starts at sunset. This method was historically used in regions where the typical day-night cycle was less relevant due to geographical and cultural factors.

## Features
- Calculate time based on sunset.
- Display time in a user-friendly interface.
- Customizable sunset time settings.
- Responsive design for different screen sizes.

## Installation and development

Use Node.js 20.19 or newer (a supported LTS release is recommended).

```sh
npm ci
npm --prefix frontend ci
npm --prefix frontend run build
npm start
```

Set `WEATHER_API_KEY` in `.env` for real OpenWeather requests. Never commit that file.
For development, run `npm run dev` for the backend and `npm --prefix frontend run dev`
in a second terminal. Backend reloads use Node's built-in watch mode, replacing
nodemon without a third-party file-watching dependency chain. Watch mode restarts
when imported JavaScript modules change; restart manually after changing `.env`
or other non-imported files.

## Checks

```sh
npm test
npm --prefix frontend run build
npm run test:dependencies
npm --prefix frontend run lint
npm audit
npm --prefix frontend audit
```

Controller tests use Node's built-in test runner and mocked upstream responses;
no weather API key or external requests are required. Dependency smoke checks
require the frontend build. The frontend currently has an upstream development-only
picomatch advisory with no published fixed version (GHSA-fc5q-39xc-vjpf); even
Vite 8 currently depends on the affected package. Keep the development server local
and use trusted project/configuration files. Production-only audits are clean.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

* Fork the Project
* Create your Feature Branch (git checkout -b feature/AmazingFeature)
* Commit your Changes (git commit -m 'Add some AmazingFeature')
* Push to the Branch (git push origin feature/AmazingFeature)
* Open a Pull Request
  
## License

Distributed under the MIT License. See LICENSE for more information.
