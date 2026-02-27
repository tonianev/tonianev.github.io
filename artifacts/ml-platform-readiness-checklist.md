# ML Platform Readiness Checklist

## Architecture

- Clear control plane and data plane separation
- Reproducible environment contracts (runtime, dependencies, secrets)
- Versioned platform interfaces and ownership boundaries

## Delivery Workflow

- Policy-defined release gates for model promotion
- CI/CD checks for schema, freshness, and data quality contracts
- Deployment rollback path tested and documented

## Reliability

- SLOs defined for training, inference, and pipeline reliability
- Runbooks for incident classes with escalation paths
- End-to-end observability for data, features, models, and serving

## Governance

- Traceability of data/model artifacts by version and timestamp
- Access control model reviewed for least privilege
- Security/compliance controls integrated into delivery workflow

## Team and Operating Model

- Explicit ownership for platform modules
- Lightweight RFC process for major architectural changes
- Quarterly platform roadmap linked to product and business goals
