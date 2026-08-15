# Mensagens de Commit

Este arquivo reúne exemplos de mensagens de commit organizadas por tipo de alteração e mapeadas para os arquivos ou grupos de arquivos correspondentes.

## 1) Swagger / Documentação da API

### feat
- feat: add Swagger metadata to public DTOs and controllers
  - Arquivos: src/user/user.controller.ts, src/user/dto/user.dto.ts, src/auth/auth.controller.ts, src/auth/dto/auth.dto.ts, src/char/char.controller.ts, src/char/dto/char.dto.ts, src/talent/talent.controller.ts, src/talent/dto/talent.dto.ts, src/light-cone/light-cone.controller.ts, src/light-cone/dto/light-cone.dto.ts, src/file/file.controller.ts, src/app.controller.ts
- feat: document auth endpoints with Swagger annotations
  - Arquivos: src/auth/auth.controller.ts, src/auth/dto/auth.dto.ts
- feat: add ApiOperation, ApiBody and ApiParam decorators for endpoint docs
  - Arquivos: src/user/user.controller.ts, src/auth/auth.controller.ts, src/char/char.controller.ts, src/talent/talent.controller.ts, src/light-cone/light-cone.controller.ts, src/file/file.controller.ts
- feat: improve OpenAPI schema for user and char DTOs
  - Arquivos: src/user/dto/user.dto.ts, src/char/dto/char.dto.ts
- feat: organize Swagger tags by controller and action
  - Arquivos: src/user/user.controller.ts, src/auth/auth.controller.ts, src/char/char.controller.ts, src/talent/talent.controller.ts, src/light-cone/light-cone.controller.ts, src/file/file.controller.ts

### chore
- chore: configure Swagger metadata for public endpoints
  - Arquivos: src/**/controller.ts, src/**/dto/*.dto.ts
- chore: standardize Swagger decorators across controllers
  - Arquivos: src/**/controller.ts
- chore: add TODO markers for incomplete API documentation
  - Arquivos: src/relics/relics.controller.ts

### docs
- docs: add Swagger documentation for API request and response models
  - Arquivos: src/**/dto/*.dto.ts, src/**/controller.ts
- docs: update OpenAPI examples and descriptions for DTO fields
  - Arquivos: src/user/dto/user.dto.ts, src/auth/dto/auth.dto.ts, src/char/dto/char.dto.ts, src/light-cone/dto/light-cone.dto.ts, src/talent/dto/talent.dto.ts
- docs: document endpoint parameters and query filters in Swagger
  - Arquivos: src/user/user.controller.ts, src/char/char.controller.ts, src/talent/talent.controller.ts

## 2) Funcional / Backend

### feat
- feat: add authentication flow for JWT and 2FA
  - Arquivos: src/auth/auth.controller.ts, src/auth/auth.service.ts, src/auth/auth.module.ts, src/auth/dto/auth.dto.ts
- feat: implement character management endpoints
  - Arquivos: src/char/char.controller.ts, src/char/char.service.ts, src/char/dto/char.dto.ts
- feat: add talent creation and update operations
  - Arquivos: src/talent/talent.controller.ts, src/talent/talent.service.ts, src/talent/dto/talent.dto.ts
- feat: support file upload handling for character assets
  - Arquivos: src/file/file.controller.ts, src/file/file.service.ts, src/globals/config/multer.config.ts
- feat: create light cone assignment endpoints
  - Arquivos: src/light-cone/light-cone.controller.ts, src/light-cone/light-cone.service.ts, src/light-cone/dto/light-cone.dto.ts
- feat: add user CRUD endpoints with validation
  - Arquivos: src/user/user.controller.ts, src/user/user.service.ts, src/user/dto/user.dto.ts

### fix
- fix: correct validation flow for DTO payloads
  - Arquivos: src/user/dto/user.dto.ts, src/char/dto/char.dto.ts, src/talent/dto/talent.dto.ts
- fix: adjust route parameter handling in auth controller
  - Arquivos: src/auth/auth.controller.ts
- fix: resolve query param parsing in list endpoints
  - Arquivos: src/user/user.controller.ts, src/char/char.controller.ts
- fix: fix guard and access control logic on protected routes
  - Arquivos: src/auth/auth.guard.ts, src/roles/roles.guard.ts, src/user/user.controller.ts, src/char/char.controller.ts, src/talent/talent.controller.ts, src/file/file.controller.ts

### refactor
- refactor: simplify controller logic and DTO definitions
  - Arquivos: src/**/controller.ts, src/**/dto/*.dto.ts
- refactor: split endpoint responsibilities by controller domain
  - Arquivos: src/auth/auth.controller.ts, src/char/char.controller.ts, src/user/user.controller.ts, src/talent/talent.controller.ts, src/light-cone/light-cone.controller.ts
- refactor: improve service and controller structure for maintainability
  - Arquivos: src/**/service.ts, src/**/controller.ts

### chore
- chore: clean up controller imports and decorators
  - Arquivos: src/**/controller.ts
- chore: standardize route and tag naming conventions
  - Arquivos: src/**/controller.ts
- chore: keep globals out of public API documentation
  - Arquivos: src/globals/**/*.ts, src/**/controller.ts

## 3) Misturas / Alterações gerais

### feat
- feat: add API documentation and endpoint improvements for public modules
  - Arquivos: src/app.controller.ts, src/auth/**, src/user/**, src/char/**, src/talent/**, src/light-cone/**, src/file/**
- feat: implement backend changes with Swagger coverage for exposed routes
  - Arquivos: src/**/controller.ts, src/**/dto/*.dto.ts

### chore
- chore: update project documentation and API metadata for public modules
  - Arquivos: commit-messages.md, src/**/controller.ts, src/**/dto/*.dto.ts
- chore: standardize operational annotations across controllers and DTOs
  - Arquivos: src/**/controller.ts, src/**/dto/*.dto.ts

## 4) Templates rápidos

### Swagger
- feat: add Swagger docs for <module>
  - Arquivos: src/<module>/<module>.controller.ts, src/<module>/dto/*.dto.ts
- docs: update OpenAPI metadata for <entity>
  - Arquivos: src/<module>/dto/*.dto.ts
- chore: standardize Swagger tags and decorators in <controller>
  - Arquivos: src/<module>/<controller>.controller.ts

### Backend
- feat: implement <feature> for <module>
  - Arquivos: src/<module>/**/*.ts
- fix: resolve <bug> in <module>
  - Arquivos: src/<module>/**/*.ts
- refactor: improve <component> structure and validation flow
  - Arquivos: src/<module>/**/*.ts

## 5) Exemplo pronto para o projeto

- feat: add Swagger metadata and endpoint tags across public DTOs and controllers
  - Arquivos: src/user/**, src/auth/**, src/char/**, src/talent/**, src/light-cone/**, src/file/**, src/app.controller.ts
- feat: document auth, user, char, talent and file endpoints in Swagger
  - Arquivos: src/auth/**, src/user/**, src/char/**, src/talent/**, src/file/**
- fix: adjust validation and request metadata for generated API docs
  - Arquivos: src/user/dto/user.dto.ts, src/char/dto/char.dto.ts, src/talent/dto/talent.dto.ts, src/light-cone/dto/light-cone.dto.ts
- refactor: standardize DTO annotations and controller tags for OpenAPI
  - Arquivos: src/**/dto/*.dto.ts, src/**/controller.ts

## 6) Mapeamento do último commit real

### Commit: feat(char): resolve TS2307 import errors in char.entity.ts and sharedEntity.module.ts
- Arquivos principais:
  - src/char/entity/char.entity.ts
  - src/globals/module/sharedEntity.module.ts
- Tema: correção de imports de alias e compatibilidade de módulos

### Commit: chore: setup VS project and runtime scripts
- Arquivos principais:
  - HSR-NESTJS.esproj
  - HSR-NESTJS.slnx
  - commands.json
  - Properties/launchSettings.json
- Tema: configuração do ambiente e execução no Visual Studio

### Commit: chore: update DB and upload configuration
- Arquivos principais:
  - src/database/database.module.ts
  - src/globals/config/multer.config.ts
- Tema: configuração de banco e validação de upload

### Commit: chore: align TypeScript build config
- Arquivos principais:
  - tsconfig.json
- Tema: compatibilidade de compilação e build do projeto
