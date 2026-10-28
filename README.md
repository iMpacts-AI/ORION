<div align="center">

<img src="./public/orion-logo-full.png" alt="ORION" width="340" />

# ORION

**AI-assisted computer use and desktop automation**

[Website](https://impacts-ai.com/orion) · [iMpacts-AI](https://github.com/iMpacts-AI) · [Issues](https://github.com/iMpacts-AI/ORION/issues)

</div>

---

## Overview

ORION is the flagship project from iMpacts-AI. It is being developed to help users carry out multi-step tasks across supported desktop applications through a controlled workflow for planning, tool execution, permissions, and outcome verification.

The project focuses on practical computer-use automation, clear user control, and reporting that distinguishes successful actions from failures.

## Capabilities

ORION's implementation is evolving. The repository includes components for:

- Agent orchestration and tool execution.
- Desktop application interaction and window management.
- Browser automation and page interaction.
- Permission checks, approval flows, and cancellation.
- Provider configuration and model routing.
- Task state, diagnostics, and automated tests.

Availability varies by environment and configuration. Consult the relevant documentation and run the tests before relying on a capability in a production workflow.

## Getting started

### Requirements

- Node.js 18 or later.
- Git.
- A supported operating system and the dependencies required by the selected features.

### Install

```bash
git clone https://github.com/iMpacts-AI/ORION.git
cd ORION
npm install
```

### Build and test

```bash
npm run build
npm test
```

Some integrations require additional configuration. Follow the relevant setup instructions in the repository and keep credentials in environment variables or local configuration that is not committed to Git.

## Design principles

- **User control:** sensitive actions should have clear permission boundaries.
- **Verification:** report task completion only when the expected result has been checked.
- **Privacy:** keep credentials and private configuration out of public output and logs.
- **Resilience:** surface understandable errors and preserve cancellation.
- **Evidence:** document tested behavior, limitations, and reproducible results.

## Documentation

Explore the repository's documentation for architecture, configuration, testing, security, and known limitations. Feature status should be based on current test evidence, not static marketing claims.

## Project status

ORION is under active development. The project does not claim universal compatibility with every desktop application or website. Browser authentication, multi-account flows, permissions, and site-specific behavior may require user interaction.

## License

See the repository's LICENSE file for applicable terms.

---

Maintained by **iMpacts-AI** · [impacts-ai.com](https://impacts-ai.com)
