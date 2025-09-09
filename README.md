# 🤖 n8n Automation Documentation Hub

> **Comprehensive documentation repository for n8n workflows with auto-generated docs, troubleshooting guides, and maintenance procedures**

[![n8n](https://img.shields.io/badge/n8n-automation-FF6D5A?style=flat-square&logo=n8n)](https://n8n.io/)
[![Documentation](https://img.shields.io/badge/docs-automated-blue?style=flat-square)](./workflows/)
[![Maintained](https://img.shields.io/badge/maintained-yes-green?style=flat-square)](./CHANGELOG.md)

## 📋 Quick Overview

This repository serves as the central documentation hub for all n8n automation workflows. Documentation is automatically generated using the **n8n-expert Claude specialist** with integrated n8n-mcp tools.

### 🎯 What's Inside

- **📁 [Production Workflows](./workflows/production/)** - Live, actively used automations
- **📁 [Development Workflows](./workflows/development/)** - Testing and experimental workflows  
- **📁 [Archived Workflows](./workflows/archived/)** - Deprecated or replaced automations
- **📚 [Troubleshooting Guides](./troubleshooting/)** - Common issues and solutions
- **📋 [Templates](./templates/)** - Reusable documentation templates

---

## 🚀 Quick Start

### For Workflow Creators
1. **Create your workflow** using the n8n-expert Claude specialist
2. **Auto-generate documentation** via the integrated documentation system
3. **Commit the generated files** to the appropriate directory
4. **Update this README** with your workflow in the index below

### For Workflow Users
1. **Browse the workflow index** below to find what you need
2. **Check the individual workflow documentation** for setup instructions
3. **Follow troubleshooting guides** if you encounter issues

---

## 📊 Workflow Index

### 🟢 Production Workflows

| Workflow/System | Purpose | Status | Last Updated | Documentation |
|-----------------|---------|--------|--------------|---------------|
| **[Capture System](./workflows/production/Capture_System/)** | Web content capture, enrichment & storage | 🟢 Active | Jan 2025 | [View Docs](./workflows/production/Capture_System/) |
| ↳ [Capture_URL_v1.0](./workflows/production/Capture_System/Workflows/Capture/Capture_URL/) | URL capture & AI enrichment workflow | 🟢 Active | Jan 2025 | [Workflow](./workflows/production/Capture_System/Workflows/Capture/Capture_URL/) |
| ↳ [Chrome Extension](./workflows/production/Capture_System/Extensions/Chrome/) | Browser extension for capture | 🟢 Active | Jan 2025 | [Extension](./workflows/production/Capture_System/Extensions/Chrome/) |
| [Dropscan Document Management](./workflows/production/PROD_DropscanDocumentManagement_v1.0.md) | Document processing automation | 🟢 Active | Aug 2025 | [View Doc](./workflows/production/PROD_DropscanDocumentManagement_v1.0.md) |

### 🟡 Development Workflows  
*Currently no active development workflows.*

| Workflow Name | Purpose | Status | Last Updated | Maintainer |
|---------------|---------|--------|--------------|------------|
| *None active* | *-* | *-* | *-* | *-* |

---

## 🛠️ Documentation Standards

### Auto-Generated Documentation Includes:
- **📖 Executive Summary** - Business purpose and impact
- **🔧 Technical Overview** - Node structure and dependencies  
- **🚨 Operations & Monitoring** - Health checks and performance baselines
- **🔄 Maintenance Guide** - Update procedures and schedules
- **📚 Troubleshooting Playbook** - Common issues and solutions
- **📊 Change History** - Version tracking and updates
- **💾 Configuration Backup** - Complete workflow JSON export

### Documentation Personas:
- **🔧 Technical Consultant** - Comprehensive technical specs and operational runbooks
- **🎓 Educational Coach** - Clear explanations and step-by-step maintenance guides  
- **🏗️ Solutions Architect** - Business impact analysis and strategic planning

---

## 📁 Repository Structure

```
n8n-automation-docs/
├── 📄 README.md                    # This file - master index
├── 📄 CHANGELOG.md                 # Repository change history
├── 📁 workflows/
│   ├── 📁 production/              # Live workflows
│   │   └── 📁 Capture_System/      # Complete capture ecosystem
│   │       ├── 📁 Extensions/      # Browser extensions
│   │       ├── 📁 Workflows/       # n8n workflows
│   │       └── 📁 Shared_Components/ # Database, API, Monitoring
│   ├── 📁 development/             # Testing workflows
│   └── 📁 archived/                # Deprecated workflows
├── 📁 templates/
│   └── 📄 google-sheets-setup.md
├── 📁 troubleshooting/
│   ├── 📄 common-errors.md         # Frequent issues and solutions
│   ├── 📄 debugging-playbook.md    # Systematic debugging guide
│   └── 📄 monitoring-guide.md      # Monitoring best practices
└── 📁 assets/
    ├── 📁 screenshots/             # Workflow screenshots
    └── 📁 diagrams/                # Technical diagrams
```

---

## 🤝 Contributing

### Adding a New Workflow
1. Use the **n8n-expert Claude specialist** to create your workflow
2. Generate documentation using the integrated auto-documentation feature
3. Place files in the appropriate directory (`production/`, `development/`, or `archived/`)
4. Update this README with your workflow in the index
5. Commit and push your changes

### Updating Documentation
- **Auto-generated sections** should be updated via the n8n-expert specialist
- **Manual sections** can be edited directly in the markdown files
- Always update the `Last Updated` field and increment version numbers

---

## 🔗 Related Resources

- **[n8n Official Documentation](https://docs.n8n.io/)**
- **[n8n-mcp Integration](https://github.com/czlonkowski/n8n-mcp)**
- **[n8n Community](https://community.n8n.io/)**
- **[Our n8n Cloud Instance](https://willertai.app.n8n.cloud/)**

---

## 📞 Support

For issues with:
- **Specific workflows** → Check individual workflow documentation and troubleshooting guides
- **n8n platform** → Consult [n8n official documentation](https://docs.n8n.io/)
- **This repository** → Create an issue or contact the maintainer

---

*📝 This repository structure and documentation system was designed using the n8n-expert Claude specialist with integrated auto-documentation capabilities.*

**Last Updated:** January 9, 2025  
**Repository Created:** August 11, 2025  
**Maintainer:** Florian Willert (@willert-ai)
