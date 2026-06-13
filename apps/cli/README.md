# nativeui-cli

<p align="center">
  <a href="https://www.npmjs.com/package/nativeui-cli">
    <img src="https://img.shields.io/npm/v/nativeui-cli" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/nativeui-cli">
    <img src="https://img.shields.io/npm/dm/nativeui-cli" alt="downloads" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/npm/l/nativeui-cli" alt="license" />
  </a>
  <img src="https://img.shields.io/badge/Expo-Compatible-000000" alt="expo" />
  <a>
    <img src="https://img.shields.io/badge/TypeScript-4.9.5-blue" alt="typescript" />
  </a>
  <a href="https://nativeui.qzz.io">
  <img src= "https://img.shields.io/badge/docs-online-blue" alt="docs" />
  </a>
</p>

The CLI for Native UI — a collection of beautiful, native-feeling React Native and Expo components that you fully own.
The CLI for Native UI — a collection of beautiful, native-feeling React Native and Expo components that you fully own.

Unlike traditional component libraries, Native UI copies component source code directly into your project. No black boxes, no lock-in, and no fighting library abstractions.

## Features

- 🎨 Native-feeling UI components for Expo and React Native
- 📦 Copy components directly into your codebase
- 🌗 Built-in dark mode support
- ⚡ Reanimated-powered interactions and animations
- ♿ Accessible by default
- 🔧 Fully customizable source code
- 🚫 No vendor lock-in

---

## Quick Start

Initialize Native UI in your project:

```bash
npx nativeui-cli@latest init
```

Then add components:

```bash
npx nativeui-cli@latest add button typography
```

---

## Commands

### init

Set up Native UI in your project.

```bash
nativeui-cli init
```

Creates:

- `native-ui.json`
- Theme utilities
- Required dependencies
- Project configuration

#### Options

| Flag          | Description                      |
| ------------- | -------------------------------- |
| `-y, --yes`   | Skip prompts and use defaults    |
| `-f, --force` | Overwrite existing configuration |

---

### add

Add one or more components.

```bash
nativeui-cli add button
```

```bash
nativeui-cli add button input card
```

```bash
nativeui-cli add --all
```

#### Options

| Flag              | Description                      |
| ----------------- | -------------------------------- |
| `-o, --overwrite` | Overwrite existing files         |
| `-a, --all`       | Install all available components |

---

### remove

Remove installed components.

```bash
nativeui-cli remove button
```

Alias:

```bash
nativeui-cli rm button
```

---

### list

List available and installed components.

```bash
nativeui-cli list
```

Alias:

```bash
nativeui-cli ls
```

---

### diff

Compare your local components against the latest registry versions.

```bash
nativeui-cli diff
```

```bash
nativeui-cli diff button
```

Useful when new component updates are released and you've customized local copies.

---

## Example

```bash
# Initialize project
npx nativeui-cli@latest init

# Add components
npx nativeui-cli@latest add button card input

# Check installed components
npx nativeui-cli@latest list

# See available updates
npx nativeui-cli@latest diff
```

---

## Philosophy

Native UI follows the same philosophy that made shadcn/ui popular:

**You own the code.**

Components are copied into your project as TypeScript source files. Edit them, refactor them, or delete them entirely. The CLI helps you get started, but your code remains yours.

---

## Documentation

Visit the documentation site for installation guides, component documentation, and examples.

[https://nativeui.qzz.io](https://nativeui.qzz.io)

---

## License

MIT
