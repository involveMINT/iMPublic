# 5. UI for POI User Tagging

Date: 2024-04-28

## Status

Proposed (Draft Implementation)

## Context

Users have repeatedly cited difficulties when submitting POI forms for groups of ChangeMakers. Very often, this requires multiple people to clock in to the same activity and fill out the same information in POIs, which is extremely redundant. Additionally, if ChangeMakers forget to clock-in, but arrived with a group, their contributions are not properly awarded.

## Decision

After setting the relationship between POIs and Enrollments as Many-to-Many, add functionality on the front and the backend to allow for users to be "tagged" by a another user. This requires queries to be added to enrollments and additional actions added to POIs.

The current draft uses a previous implementation of user search from the involveMINT codebase in order to take in account the limited time constraints for the IS 67-373 project and the planned revamp of the involveMINT webapp.


## Consequences

This standardization may result in a less flexible implementation (in exchange for use of existing elements and maintaining a cohesive look & feel).

However, the backend implementation should be easily extended in future changes and can be applied to different frontend implementations as needed.