# Security Policy 🛡️

The maintainer takes security vulnerabilities seriously. We appreciate your efforts to responsibly disclose any security concerns or vulnerabilities you identify.

## Supported Versions

| Version | Supported          |
| :---    | :---               |
| `main`  | :white_check_mark: |
| `< 1.0` | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, **please do NOT report it via public GitHub issues or public discussions**.

Instead, please report the vulnerability privately through:
1. **GitHub Security Advisory**: Open a private advisory on GitHub via the [Security Advisories tab](https://github.com/felixpalingan/Portfolio/security/advisories/new).
2. **Direct Contact**: Reach out to the maintainer privately via email at [felixbariq@gmail.com](mailto:felixbariq@gmail.com) or via LinkedIn ([Almakius Felix Bariq Hekopung](https://www.linkedin.com/in/almakius-felix-bariq-hekopung/)).

### What to Include in Your Report
To help us triage and resolve the issue quickly, please provide:
- A clear description of the vulnerability and its potential impact.
- Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
- Affected files, environment variables, or endpoints.
- Recommended fixes or mitigations, if known.

## Response Timeline
- **Initial Acknowledgment**: Within 48 hours of receipt.
- **Triage & Status Update**: Within 5 business days detailing validation results and target remediation timeline.
- **Resolution**: A coordinated patch will be prepared and deployed before any public disclosure.

## Security Best Practices
- Never commit private secrets, personal keys, or credentials into source control.
- Ensure all client-side dependencies are kept up-to-date and audited against known CVEs via `npm audit`.
