# Database Schema Needed

## Organizations

- ID
- Name
- Users (many to many)

## Users

- ID
- Name
- Email (unique)
- Authentication details
- Login details
- Roles (many to many)
- Organizations (many to many)
- Roles assigned on a per-organization basis (will require a correlation table)
- Events (many to many)

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
- Allowed users (many to many; future)
