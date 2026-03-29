# Temporary CI/CD Agreements

This file temporarily фиксирует текущие договоренности по development, production, CI, and CD until the final deployment documentation is implemented.

## Development

- Local development remains as-is.
- Docker is required for correct development environment startup.
- The preferred entrypoint for local development is:

```bash
npm run dev
```

- Docker in development is required at least for infrastructure services such as:
  - MongoDB
  - Mongo Express

- Existing development flow should not be broken while production deployment is being introduced.

## Tests

- A dedicated `test` stage is expected in the future.
- It is intentionally not implemented yet.
- CI/CD structure should be prepared so that test jobs can be added later without redesigning the whole pipeline.

## Production

- Production should run fully through Docker services.
- This includes:
  - `server`
  - `client`
  - `mongo`
  - `nginx`

- `client` should also be deployed as a Docker service.
- `client` must not be copied manually from a local machine to the production server.
- `client` should be built through a reproducible Docker image flow.

- `mongo-express` should be implemented in production configuration, but disabled by default.
- It should be enabled only explicitly through a flag/profile when needed.

## CI/CD Direction

- CI should be designed so that it can later include:
  - verify
  - test
  - publish images
  - deploy

- Production deployment should be based on Docker images, not on manually built local artifacts.
- The preferred target flow is:
  1. CI verifies the repository.
  2. CI builds Docker images for `client` and `server`.
  3. CI publishes those images to a registry.
  4. Production pulls ready images and starts them via Docker Compose.

- The production server should avoid heavy frontend builds locally where possible.
- This is especially important because the current Lightsail instance is limited to 1 GB RAM.

## Infrastructure Notes

- The current production target is an AWS Lightsail instance.
- The current instance size is constrained, so production design must be conservative with RAM.
- `mongo`, `server`, and `nginx` must be planned with low-memory operation in mind.

## Non-Goals For Now

- No final deployment documentation yet.
- No test stage implementation yet.
- No production rollout yet.
- No local-to-server manual build copying flow.
