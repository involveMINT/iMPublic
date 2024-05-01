# 1. Record architecture decisions

Date: 2024-04-25

## Status

Proposed

## Context

To better understand design choices made by the development team, decisions should be documented inside the codebase for easy interpretability and accessibility by developers.

Additionally, decisions can be submitted and reviewed before being implemented into the codebase following a similar review process to Pull Requests and code changes, to ensure that decisions are made by group consensus.

The main branch should only reflect decisions made as by consensus.

## Decision

We will use Architecture Decision Records, as described by Michael Nygard in 
[documenting architecture decisions](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions). Workflow inspired by [Arachne Framework Architecture](https://github.com/arachne-framework/architecture/blob/master/adr-001-use-adrs.md).

The workflow will be:

1. A developer creates an ADR document outlining an approach for a high level architectural decision. The ADR has an initial status of "proposed."
2. The developers should discuss the ADR and make modifications as needed.
3. Once developers reach agreement, ADR can be transitioned to either an "accepted" or "rejected" state.
4. Only after an ADR is accepted should implementing code be committed to the main branch of the relevant project/module.
5. If a decision is revisited and a different conclusion is reached, a new ADR should be created and linked to the old ADR to create chronological records.


## Consequences

1. Developers must write an ADR and submit it for review before
   selecting an approach to any architectural decision.
2. The involveMINT team can use the ADR to lead discussions, before finalizing decisions.
3. This will ensure that decisions will be made deliberately, as a group.
4. The main branch of the repository will reflect the decisions made using the ADRs.
5. The ADRs will provide persistent documentation of the decisions made in the system.

