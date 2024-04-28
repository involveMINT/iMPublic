# 5. UI for POI User Tagging

Date: 2024-04-28

## Status

Proposed (Draft Implementation)

## Context

User tagging is a highly requested feature. Adding it will require major changes, including adding some UI elements (including to the POI form).

## Decision

Make necessary changes to POI to implement feature, while maximizing code reuse (e.g. existing user search).

## Justification

Tagging is likely to improve the user experience significantly, and this implementation improves maintainability & standardization.

## Consequences

This standardization may result in a less flexible implementation (in exchange for use of existing elements and maintaining a cohesive look & feel).