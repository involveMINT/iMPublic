# 1. Set POI-Enrollment to Many-to-Many

Date: 2024-04-25

## Status

Proposed

## Context

In order to allow for tagging, or associating multiple users with a single POI form, the relationship between POIs and Enrollments needs to be some form of Many-to-Many relationship.

## Decision

Using TypeORM, implement this relationship by changing the relationship between POIs and Enrollments to "Many-to-Many" rather than adding a "One-to-One" linking table. 

Reasoning: Currently, there is no metadata needed to be associated with each tag, so a "One-to-One" linking table would add redundant efforts. Instead, allowing TypeORM to handle the relationship internally will make the relationship easier to manage in the code (i.e. types will become arrays automatically, rather than having to add an entirely new object).

## Consequences

All instances in the code that utilized the former "Many-to-One" relationship between Enrollments and POIs will now require the code to be updated to allow for an **array** of enrollments to be used rather than a single enrollment. 

Important to note is that this will allow multiple enrollments to be associated with POIs as owners. As discussed with Quinn Heffern, the long term plan is to allow for POIs to be edited by multiple users, however this should be handled with caution due to concurrency issues. Enrollments should be given some sort of read-write lock when editing the POI form. 

Additionally, logic must be added to ensure that a user cannot have more than one active POI for a certain timeframe. For example, if another user tags a ChangeMaker, the tagged ChangeMaker must discard any active POIs are withdraw themselves from the tagged POI.
