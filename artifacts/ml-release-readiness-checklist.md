# ML Release Readiness Checklist

## Candidate Quality

- Candidate model metrics are complete and reproducible
- Baseline comparison includes quality, latency, and cost
- Drift and fairness checks are complete where applicable

## Gate Policy

- Absolute thresholds are met (`min`, `max`)
- Baseline-relative thresholds are met (`delta`, `ratio`)
- Required sign-offs are complete and auditable

## Deployment Safety

- Rollback strategy validated in non-production
- Canary or phased rollout plan documented
- Monitoring alerts and dashboards are active before release

## Operational Readiness

- On-call ownership is assigned
- Incident runbook is linked from release record
- Post-release validation checkpoints are scheduled
