# 4. Multi-Image Upload for POIs

Date: 2024-04-28

## Status

Proposed

## Context

The current image upload for POIs is limited (4 images, selected one at a time). Users have reported that the POI form is tedious, and photos make up an essential part of the POI acceptance process.

## Decision

Add file-handling, functionality changes, and UI elements to implement multi-photo upload. Process files uploaded in an array and run the same checks as before.

## Consequences

Only one upload box is displayed at a time. More photos may be uploaded, resulting in increased storage, bandwidth & resource usage. However, this will allow users to complete POI forms several times faster, as photos do not need to be uploaded one at a time. Unintended consequences may occur in further testing.