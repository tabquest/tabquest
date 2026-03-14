# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.1.0](https://github.com/tabquest/tabquest/compare/tabquest-v1.0.9...tabquest-v1.1.0) (2026-03-14)


### Features

* added 1.0.6 Release Note ([ac1bc6e](https://github.com/tabquest/tabquest/commit/ac1bc6ec2d904b6daae3b15029234b306f42c61e))
* added christmas effect. ([e4d4306](https://github.com/tabquest/tabquest/commit/e4d43064f24415cc865ec74d9d4fe3bb5a799c5c))
* added CHRISTMAS_MODE toggle. ([b84b0a1](https://github.com/tabquest/tabquest/commit/b84b0a10de2befcf33f8a29ef4f5f84bf019518a))
* added feedback pointer. ([561184f](https://github.com/tabquest/tabquest/commit/561184fb973c2121cfccd4fce328eee7aa6b8c59))
* added santa animation ([1336748](https://github.com/tabquest/tabquest/commit/1336748170ef0faaf9bb2fb5638b17aec687ac08))
* Added Theme Configuration Setup based on user preference ([0f2d25f](https://github.com/tabquest/tabquest/commit/0f2d25f90d3f54082ee4fccf584036d8cf3248f7))
* auto-update manifest.json versions on release ([c5965ea](https://github.com/tabquest/tabquest/commit/c5965eaf2c27158803f29000efefcc8ce0815b61))
* auto-update manifest.json versions on release ([98bc343](https://github.com/tabquest/tabquest/commit/98bc343b8a075200227eb77c2b87e53be7488514))
* Change Dependabot directory to '/code' ([4e9414e](https://github.com/tabquest/tabquest/commit/4e9414e62f414e3c54d99b9fcabe652557cb08dd))
* Configure Dependabot for weekly npm dependency updates. ([0f632d7](https://github.com/tabquest/tabquest/commit/0f632d78e883f74290f2bcef026f5c3474ee413d))
* disable christmas mode. ([50c26b9](https://github.com/tabquest/tabquest/commit/50c26b9569551d63d78340a1270d73ea6adb414f))
* Implement browser-specific manifest management and separate build workflows for Chrome, Edge, and Firefox. ([e1a998b](https://github.com/tabquest/tabquest/commit/e1a998bda6961c9c4abd944fff59a840386ad491))
* Introduce official CHANGELOG.md and version.txt, documenting release history and 1.0.8 maintenance fixes for Git tracking and package-lock.json. ([f5400dc](https://github.com/tabquest/tabquest/commit/f5400dcbdb05b3d408516058b4405ce93784d44a))
* updated version info ([6c5f139](https://github.com/tabquest/tabquest/commit/6c5f13950fe1e7ad28d15ebbd727329c2bc32a04))


### Bug Fixes

* bookmark save bug ([43a4f36](https://github.com/tabquest/tabquest/commit/43a4f36a9eae345b4219ad7e6ad541d2cc16a340))
* resolve DEP0190 security warning by avoiding shell: true ([ad8c613](https://github.com/tabquest/tabquest/commit/ad8c6139c21e6c6fead5c88e098a76395984803d))
* setting panel icon z-index on active ([e8d29d6](https://github.com/tabquest/tabquest/commit/e8d29d6e1973c207367b31bc70155b5fcfb2c156))
* updated packages ([0fd3ec5](https://github.com/tabquest/tabquest/commit/0fd3ec56d176e5591b904a659ba11d7c0c4425df))


### Performance Improvements

* optimize build chunks with manual code splitting ([5962d89](https://github.com/tabquest/tabquest/commit/5962d89382353f93a67b7c2fd7d1d432e28137a8))

## [1.0.9] - 2026-03-03
### Added
- New theme options with improved visual consistency across the app.

## [1.0.8] - 2026-03-03
### Fixed
- Stopped Git from tracking build output files in the `dist` folder.
- Resolved merge conflicts in `package-lock.json`.

## [1.0.7] - 2025-12-21
### Added
- **Christmas Edition 🎄**:
    - Festive Snowfall effect.
    - "Merry Christmas" banner.
    - Animated Santa icon.
    - Global `CHRISTMAS_MODE` toggle in `constants.js` to enable/disable festive UI.
- Smart Feedback Prompt system with frequency control (approximately twice a week).
- Auto-hiding settings icon for a cleaner user experience.

### Changed
- Layout refinements and UI polish.

## [1.0.6]
### Added
- Grid View for Bookmarks section.
- Enhanced Task Manager with notification timer functionality.
- Markdown support within the Notes feature.

### Fixed
- Local storage and state management issues.

## [1.0.5]
### Added
- Google Lens Search integration.

### Fixed
- Minor bugs in Bookmark URL opening logic (`window.open` replacement).

## [1.0.4]
### Added
- Clock Toggle/Switch button with live updates.
- GitHub profile integration.

### Changed
- Updated `VersionChecker` to optimize storage usage.

### Fixed
- Gmail favicon display error in bookmarks.

## [1.0.3]
### Fixed
- Custom Gmail favicon support for Favorites and Bookmarks.

## [1.0.2]
### Added
- Release notes functionality.

### Fixed
- Update check version logic.

## [1.0.1]
### Added
- Support for 12-hour clock format.
- "Hide Seconds" feature for the clock.

## [1.0.0]
- Initial Release.
