# ML Production Readiness Scorecard

Score each dimension from 0 to 3.

- 0 = not addressed
- 1 = partial/informal
- 2 = implemented but inconsistent
- 3 = implemented, measured, and owned

## 1. Data Contracts and Quality

- Schema contracts and validation
- Freshness/completeness monitoring
- Drift checks in production

Score:
Evidence:

## 2. Model Quality and Safety

- Reproducible training/evaluation
- Baseline and regression checks
- Bias/safety checks where applicable

Score:
Evidence:

## 3. Release Governance

- Automated promotion gates
- Approvals and audit trail
- Canary or phased rollout policy

Score:
Evidence:

## 4. Reliability and Operations

- SLOs and error budgets defined
- Alerting and dashboard coverage
- Incident runbook and on-call ownership

Score:
Evidence:

## 5. Platform and Infrastructure

- Environment reproducibility
- IaC coverage and drift control
- Capacity/cost monitoring

Score:
Evidence:

## 6. Security and Compliance

- Access controls and secret handling
- Artifact provenance/traceability
- Policy/compliance checks integrated in CI/CD

Score:
Evidence:

## 7. Team Readiness

- Clear ownership boundaries
- Documentation and handoff quality
- Operational training completed

Score:
Evidence:

## Overall Rating

- Total score (max 21):
- Readiness band:
  - 0-8: not ready
  - 9-14: conditionally ready
  - 15-18: ready with known risks
  - 19-21: production ready

## Decision

- Launch decision:
- Conditions/mitigations:
- Sign-off:
