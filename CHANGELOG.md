# [1.0.0-alpha.2](https://github.com/Digamasyx/HSR-NESTJS/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2026-08-15)


### Features

* **char:** resolve TS2307 import errors in char.entity.ts and sharedEntity.module.ts ([9f11b3b](https://github.com/Digamasyx/HSR-NESTJS/commit/9f11b3bc21a29354b0bd524f8912d983782a52f1))

# 1.0.0-alpha.1 (2026-08-15)


### Bug Fixes

* added missing import for `Char` entity ([cf9fa5f](https://github.com/Digamasyx/HSR-NESTJS/commit/cf9fa5f601631080ba1242188a340e9b602789ce))
* added missing import for `CustomRequest` ([afeda0d](https://github.com/Digamasyx/HSR-NESTJS/commit/afeda0dd314cf5ffa2d6614678c5cf74fb0a11d0))
* added missing imports for `CustomRequest` ([383744e](https://github.com/Digamasyx/HSR-NESTJS/commit/383744e62493bd86d7de005d07f5e0480c621599))
* **file.service:** prevent undefined property access in duplicate file check ([6a46234](https://github.com/Digamasyx/HSR-NESTJS/commit/6a46234b25621fc419b89b781de327365d1581fc))
* **global-exception-filter:** include request body in error response ([fbbfc38](https://github.com/Digamasyx/HSR-NESTJS/commit/fbbfc3852e815808be7e8e81c01cf5d03eeec58d))
* **talent.service:** add edge case handling ([22a614a](https://github.com/Digamasyx/HSR-NESTJS/commit/22a614a2e3eb11c193f3c8631392ae69ed816d99))


### Features

* add file module/service and integrate file associations in Char ([ec026b9](https://github.com/Digamasyx/HSR-NESTJS/commit/ec026b98750039c5f62bbabf1704934000307f5c))
* add FileController and custom multer configuration ([b967bb5](https://github.com/Digamasyx/HSR-NESTJS/commit/b967bb5c819a37c0f9195b6f6288b02039d76cc7))
* add Files entity to represent file storage and association ([e7fc613](https://github.com/Digamasyx/HSR-NESTJS/commit/e7fc6130e26d776d26fb187b2f1aca189d11a1fa))
* add Helmet for HTTP security and CORS ([db2b4d5](https://github.com/Digamasyx/HSR-NESTJS/commit/db2b4d5b6265f579b8dc1ce546b2ee816ad41d5f))
* add new "create" route ([ef4e49d](https://github.com/Digamasyx/HSR-NESTJS/commit/ef4e49df73f06dd1969a48988635e3e7816530b3))
* add new `removeAll` route ([1f19fd1](https://github.com/Digamasyx/HSR-NESTJS/commit/1f19fd125d05c2a6795e5a2923fa5a74e057ec89))
* add pagination parameters to findAll method ([23fe37a](https://github.com/Digamasyx/HSR-NESTJS/commit/23fe37ae33c890481cc954affa9fa603eaa7147b))
* Add support for extended search functionality in `CharService` ([9fd3471](https://github.com/Digamasyx/HSR-NESTJS/commit/9fd34717250c1b6b6a14089281c54c608f59d112))
* add TalentProvider for validating TalentDTO ([2c17e21](https://github.com/Digamasyx/HSR-NESTJS/commit/2c17e219d1a90387a154bad2671b6be740692b14))
* add valid number check in find method and create removeAll route ([ef7f9ed](https://github.com/Digamasyx/HSR-NESTJS/commit/ef7f9ed1b92274d66d9e7777b794281e90938187))
* add valid number check in find method and create removeAll route ([6d2a821](https://github.com/Digamasyx/HSR-NESTJS/commit/6d2a82117c1d9ca53c8b4c3ec1b934c53a9f1cd7))
* add ValidateStringEnumPipe for enhanced string and enum validation ([0e954ad](https://github.com/Digamasyx/HSR-NESTJS/commit/0e954ad18204e00c461e55e1a0e44793cf9cedbd))
* added 2 new routes in the `Talent.service` ([b4c809c](https://github.com/Digamasyx/HSR-NESTJS/commit/b4c809c0bf3a7561056dd4d41c10981984b0830d))
* added 2FA signin method ([f4b6319](https://github.com/Digamasyx/HSR-NESTJS/commit/f4b63197f88b8fdd5e8cd4f0659ff6fa1b32794e))
* added a new route for relics treatment and started user refactoring ([52eba28](https://github.com/Digamasyx/HSR-NESTJS/commit/52eba28f7b39f7c0debbb73be08825e2c51eb65e))
* added basic interface and DTO ([f706a1a](https://github.com/Digamasyx/HSR-NESTJS/commit/f706a1ad7cd2e143b168c3b16d7f6ee2aaeb84ec))
* added basic route as a test ([054b3c6](https://github.com/Digamasyx/HSR-NESTJS/commit/054b3c6041055a4b54897032c75e87c57e24025e))
* added basic routes ([32633a8](https://github.com/Digamasyx/HSR-NESTJS/commit/32633a87008244eea0a59bf6240583fb2a0bcd6b))
* **char.service:** inject GlobalProvider and standardize update logic ([883c32f](https://github.com/Digamasyx/HSR-NESTJS/commit/883c32f18cc19635dcca85adcdd358f7248e5a18))
* Enhance `CharProvider` with type-checking support ([6effbd3](https://github.com/Digamasyx/HSR-NESTJS/commit/6effbd3c33c390810e582a34b01513c0dbd835f8))
* **global.provider:** add updateAssign utility for PATCH operations ([afd960d](https://github.com/Digamasyx/HSR-NESTJS/commit/afd960d60f7200c732412b20ee76fbc8ad63291a))
* implement custom logging with `CustomLogger` and `LoggingInterceptor` ([10467af](https://github.com/Digamasyx/HSR-NESTJS/commit/10467af7e7d8ead20daf09a19bd80920d585471b))
* incorporate Files entity into shared module architecture ([7aa2997](https://github.com/Digamasyx/HSR-NESTJS/commit/7aa2997d9ac40b60598bcadb374736c3678e6d7d))
* integrate TalentProvider for body validation ([83691be](https://github.com/Digamasyx/HSR-NESTJS/commit/83691bed6452205e4542ed53204950a67bcbcce4))
* **light-cone.service:** add duplicate light cone check ([3aeb1ec](https://github.com/Digamasyx/HSR-NESTJS/commit/3aeb1ec97965e6e2bfbbba18ec0fe9773d7f4c5c))
* **light-cone.service:** add remove method with character fallback ([4615780](https://github.com/Digamasyx/HSR-NESTJS/commit/4615780ae1bf13984fe701a0b837b04dbc60416a))
* move duplicate entities to a separated module ([bf871d8](https://github.com/Digamasyx/HSR-NESTJS/commit/bf871d8b2dd30b923b101907488f3f291d16ca26))
* preparing addition of lc route ([b220b36](https://github.com/Digamasyx/HSR-NESTJS/commit/b220b36b6a486e3ae066e4e26c03931b94b3d606))
* started to add some logic ([819f83d](https://github.com/Digamasyx/HSR-NESTJS/commit/819f83d56c92d11a70af528e299aa6c2b5e9c832))
* **talent.service:** implement update endpoint with partial changes and summary ([aaf7794](https://github.com/Digamasyx/HSR-NESTJS/commit/aaf77948d6aff176a916342fac639e4d745daac5))
* **user.dto:** add optional weights property for custom password generation ([74a08e1](https://github.com/Digamasyx/HSR-NESTJS/commit/74a08e17a0462751557cadefd7982166dd7792b2))
* **user.service:** add custom weight support for random password generation ([395c3dd](https://github.com/Digamasyx/HSR-NESTJS/commit/395c3dd190912d020d8448cebadfa1f343e80c97))
