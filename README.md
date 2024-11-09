
---

# MTA Helper

MTA Helper is a Visual Studio Code extension designed to streamline the workflow for **Multi Theft Auto: San Andreas** (MTA: SA) scripting. With easy commands and automation, it helps developers quickly set up and manage their MTA resources by creating essential files, generating `meta.xml`, and scanning directories for a structured setup.

## Features

- **Quick File Generation**: Easily create `client.lua`, `server.lua`, `shared.lua`, `utils.lua` files with sample code to kickstart your project.
- **Optional Zoom Functionality in client.lua**: Provides an option to include zoom code for adaptable screen scaling in `client.lua`.
- **Automatic `meta.xml` Creation**: Generate a `meta.xml` file automatically based on selected files, with correct tagging for each type.
- **Directory Scanning**: Scans a selected folder (including subdirectories) and generates `meta.xml` based on existing `.lua` scripts and other files.
- **Support for Various File Types**: Detects Lua scripts and adds `<script>` tags, while non-Lua files are included with `<file src="..." />` in `meta.xml`.

## Getting Started

### Prerequisites

- Visual Studio Code (version 1.95.0 or higher)
- [Node.js](https://nodejs.org/) installed for development if you want to modify or contribute to the extension

### Installation

1. Download the extension from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/).
2. Install the extension by searching for **MTA Helper** in the Extensions view (`Ctrl+Shift+X`).
3. Once installed, the MTA Helper icon will appear in the status bar, ready for use.

### Usage

1. **Access Options**: Click the **MTA Helper** icon in the Visual Studio Code status bar. You'll be prompted with two main options:
   - **Generate new files**: Allows you to create commonly used Lua files for MTA: SA with a sample structure.
   - **Generate meta for existing files**: Scans an existing directory for `.lua` and other files, then generates a structured `meta.xml` file.

2. **File Creation with Optional Zoom**:
   - When creating `client.lua`, choose if you want to include zoom functionality.
   - This feature adjusts elements based on screen resolution, providing a responsive experience.

3. **Automatic `meta.xml` Generation**:
   - For each file created or detected, `meta.xml` will be updated with relevant tags.
   - Lua scripts are wrapped in `<script>` tags with appropriate `type` attributes.
   - Non-Lua files are wrapped in `<file>` tags for seamless resource management.

### Example `meta.xml` Structure

```xml
<meta>
    <script src="client.lua" type="client" cache="false" />
    <script src="server.lua" type="server" />
    <script src="shared.lua" type="shared" cache="false" />
    <file src="image.png" />
</meta>
```

### Commands

| Command                          | Description                                  |
|----------------------------------|----------------------------------------------|
| `MTA Helper: Show Options`       | Opens the MTA Helper menu in the status bar. |
| `Generate new files`             | Create new Lua files with sample code.       |
| `Generate meta for existing files` | Scan folders and create `meta.xml` file.   |

## Contributing

Contributions are welcome! If you'd like to add features or fix bugs, feel free to fork the repository and submit a pull request.

## License

This extension is licensed under the [MIT License](LICENSE).

## Feedback and Support

If you encounter any issues or have feature requests, please open an issue on the [GitHub repository](https://github.com/xelvor/mta-vsc-helper). We’re happy to help!

---
