# Database Schema Needed

## Organizations

- ID
- Name
- Users (one to many)

## Users

- ID
- Name
- Email (unique)
- Authentication details
- Login details
- Roles (one to many)
- Organizations (many to many)
- Roles assigned on a per-organization basis (will require a correlation table)
- Events (one to many)

## Roles

- ID
- Code (machine-tracked)
- Name (displayed to user)

## Events

- ID
- Event Name
- URL Slug
- Scheduling details (future)
- Requires login (future)
- Allowed users (one to many; future)
