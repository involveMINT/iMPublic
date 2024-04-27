# 3. Implement Local Saving

Date: 2024-04-27

## Status

Accepted

## Context

Our project requires a saving feature for users as they fill out a proof of impact (poi) form. This allows users to save their progress in case of a network error or if they leave the web application, since a poi may entail several hours of recording. In order to implement this feature, we had to decide implement "local saving" through the user's cache or "remote saving" which sends updates to the database.

## Decision

After careful consideration, we decided to implement local saving to save poi forms. 

## Justification

Local Saving only involves a browser-side implementation that is less complex than remote saving. Given the deadlines and other deliverables, local saving will be a more lightweight solution. Local Saving also doesn't add additional api calls to the database resulting in higher operational costs. Furthermore, in the future, remote saving can still be easily implemented. 

## Consequences

Local Saving has negligible consequences on the involveMINT application and the user's device. Users will now be able to recover their poi form inputs when they reload the application. 
