# Native UI

Beautiful, native-feeling React Native and Expo components that you actually own.

Native UI brings the shadcn/ui philosophy to mobile: install components with a CLI, get the source code directly in your project, and customize everything without fighting a component library.

No lock-in. No black boxes. Just production-ready components built for React Native.

## Why Native UI?

Most component libraries optimize for consistency at the expense of flexibility. The moment you need to adjust an animation, modify platform-specific behavior, or customize a component beyond the exposed props, you're forced to work around the library.

Native UI takes a different approach.

- **Own the code** — Components are copied directly into your project as TypeScript source files.
- **Built for React Native** — Designed specifically for Expo and React Native, not adapted from the web.
- **Zero lock-in** — Modify, extend, or replace any component whenever you want.
- **System-aware dark mode** — Components automatically respond to light and dark themes.
- **Native-feeling animations** — Powered by Reanimated for smooth UI-thread animations.
- **Accessible by default** — Sensible accessibility behaviors are built in from the start.
- **Composable architecture** — Use the pieces you need without unnecessary abstractions.

## Installation

Initialize Native UI in a new or existing Expo project:

```bash
npx nativeui-cli@latest init
```

This command:

- Creates a `native-ui.json` configuration file
- Installs required dependencies
- Sets up shared theme utilities
- Configures your project for Native UI components

## Add Components

Install components individually as you need them:

```bash
npx nativeui-cli@latest add button
```

Or install multiple components at once:

```bash
npx nativeui-cli@latest add button card input select
```

Components are added directly to your project and can be imported immediately.

```tsx
import Button from "@/components/ui/button";
import Typography from "@/components/ui/typography";

export default function Screen() {
  return (
    <>
      <Typography variant="h3">Get started</Typography>
      <Button title="Click me" />
    </>
  );
}
```

## Setup PortalHost

Some overlay-based components such as dialogs, sheets, and menus require a portal host.

Add `PortalHost` as the last child in your root layout:

```tsx
import { PortalHost } from "@rn-primitives/portal";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar />
      <Stack />
      <PortalHost />
    </ThemeProvider>
  );
}
```

## Available Components

Native UI includes a growing collection of production-ready components:

```
accordion        alert           alert-dialog    aspect-ratio
avatar           badge           button          button-group
calendar         card            carousel        checkbox
date-picker      dialog          empty           field
input            input-otp       label           progress
radio-group      select          separator       skeleton
sonner           spinner         switch          table
textarea         typography
```

## CLI Commands

### Initialize a project

```bash
nativeui-cli init
```

### Add components

```bash
nativeui-cli add button input card
```

### Remove components

```bash
nativeui-cli remove button
```

### List installed components

```bash
nativeui-cli list
```

### Compare with registry versions

```bash
nativeui-cli diff
```

## Philosophy

Native UI follows a simple principle:

**The code should belong to you.**

When you add a component, it becomes part of your codebase. Review it, customize it, refactor it, or delete it entirely. Native UI provides a starting point—not a dependency you have to work around forever.

## Contributing

Contributions are welcome. Feel free to open an issue or submit a pull request.

## License

MIT License. See the [LICENSE](LICENSE) file for details.
