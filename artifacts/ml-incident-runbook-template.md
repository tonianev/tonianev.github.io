# ML Incident Runbook Template

Use for production incidents involving data pipelines, feature systems, training, or model serving.

## 1. Incident Metadata

- Incident title:
- Severity:
- Start time (UTC):
- Incident commander:
- Affected services:

## 2. Impact Summary

- User/business impact:
- Scope of affected traffic/data:
- Estimated financial/operational impact:

## 3. Detection

- Detection source (alert, customer report, dashboard):
- First signal timestamp:
- Alert links:

## 4. Triage Checklist

- Confirm failure mode (data, feature, model, infra, dependency)
- Check recent deploys/config changes
- Check upstream/downstream dependencies
- Confirm blast radius

## 5. Containment Actions

- Immediate safe-state action (rollback, kill-switch, traffic shift)
- Temporary guardrails enabled:
- Stakeholders notified:

## 6. Root-Cause Investigation

- Most likely root cause:
- Supporting evidence:
- Unknowns to resolve:

## 7. Recovery Steps

- Step-by-step recovery actions:
- Verification checks after each step:
- Recovery completion criteria:

## 8. Communications

- Internal update cadence:
- External/customer update needed:
- Final incident summary recipients:

## 9. Post-Incident Follow-up

- Corrective actions (owner + due date):
- Preventive actions (owner + due date):
- Monitoring/runbook gaps identified:
- Postmortem scheduled date:
