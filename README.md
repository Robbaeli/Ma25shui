# Shui

Shui är ett REST API för en digital anslagstavla. Användare kan registrera sig, logga in och publicera, läsa, uppdatera och radera inlägg. Gäster kan publicera inlägg utan att logga in, och inloggade användare kan kommentera.

API:et är byggt som en serverless backend med AWS Lambda, API Gateway och DynamoDB.

**Driftsatt API:** https://vatwhoqag4.execute-api.eu-north-1.amazonaws.com

## Funktioner

**G**
- Registrering och inloggning med bcrypt och JWT
- Alla kan läsa inlägg och filtrera dem på användarnamn
- Endast inloggade användare kan skapa inlägg
- Endast inläggets ägare kan uppdatera och radera det
- Validering av all indata med Zod

**VG**
- Gäster kan publicera inlägg utan inloggning och får ett slumpat användarnamn, t.ex. `dolphin814`
- Gästinlägg kan aldrig uppdateras eller raderas
- Inloggade användare kan kommentera inlägg, alla kan läsa kommentarer
- När ett inlägg raderas raderas även dess kommentarer

## Tekniker

- Node.js 24 och JavaScript (ES-moduler)
- AWS Lambda, API Gateway (HTTP API) och DynamoDB
- Serverless Framework v4
- Middy (middlewares)
- bcryptjs och jsonwebtoken
- Zod

## Projektstruktur

```
src/
├── handlers/        Tar emot anrop och skickar svar (korta, bara HTTP)
│   ├── auth/        register, login
│   ├── posts/       getAll, getById, create, update, remove
│   └── comments/    getAll, create
├── middlewares/     Återanvändbara Middy-middlewares
│   ├── auth.js          auth (kräver JWT) och optionalAuth (JWT valfri)
│   ├── validate.js      Validerar body med ett Zod-schema
│   ├── validateQuery.js Validerar query-parametrar med ett Zod-schema
│   └── errorHandler.js  Gör om alla fel till { "error": "..." }
├── services/        Affärslogik (hashning, token, ägarskap, gästnamn)
├── repositories/    Databasoperationer mot DynamoDB
├── schemas/         Zod-scheman
└── utils/           sendResponse och generateGuestName
```

Ett anrop går genom lagren så här:

```
API Gateway → middlewares (auth, validering) → handler → service → repository → DynamoDB
```

## Kom igång

### Förutsättningar

- Node.js 24
- Ett AWS-konto med credentials konfigurerade lokalt (`aws configure` eller `~/.aws/credentials`)
- Serverless Framework v4: `npm install -g serverless`, sedan `serverless login`

### Installation och driftsättning

1. Klona repot och installera paketen:

   ```bash
   git clone <repo-url>
   cd <repo-mapp>
   npm install
   ```

2. Skapa en `.env`-fil i projektets rot med en hemlig nyckel för JWT:

   ```bash
   echo "JWT_SECRET=$(openssl rand -hex 32)" > .env
   ```

   `.env` står i `.gitignore` och ska aldrig pushas.

3. Driftsätt till AWS (region `eu-north-1`):

   ```bash
   serverless deploy
   ```

   Terminalen skriver ut API:ets URL när deployen är klar. Tabellerna i DynamoDB skapas automatiskt.

### Loggar

```bash
serverless logs -f <funktionsnamn>
```

Exempel: `serverless logs -f createPost`

## Autentisering

Skyddade endpoints kräver en JWT i headern:

```
Authorization: Bearer <token>
```

Token fås vid inloggning, innehåller användarnamnet och gäller i en timme. Användarens identitet hämtas alltid från token, aldrig från request body.

## Endpoints

| Metod | Endpoint | Åtkomst | Lyckat svar |
|---|---|---|---|
| POST | `/auth/register` | Publik | 201 |
| POST | `/auth/login` | Publik | 200 |
| GET | `/posts` | Publik, filter med `?username=` | 200 |
| GET | `/posts/{postId}` | Publik | 200 |
| POST | `/posts` | Inloggad, eller gäst utan token | 201 |
| PUT | `/posts/{postId}` | Inloggad ägare | 200 |
| DELETE | `/posts/{postId}` | Inloggad ägare | 204 |
| GET | `/posts/{postId}/comments` | Publik | 200 |
| POST | `/posts/{postId}/comments` | Inloggad | 201 |

Inlägg returneras med det senaste först. Kommentarer returneras med den äldsta först.

### Exempel

Registrera:

```bash
curl -X POST https://vatwhoqag4.execute-api.eu-north-1.amazonaws.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "username": "jesper", "password": "Password123!" }'
```

Logga in:

```bash
curl -X POST https://vatwhoqag4.execute-api.eu-north-1.amazonaws.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "username": "jesper", "password": "Password123!" }'
```

Skapa ett inlägg (byt `<token>` mot token från inloggningen, eller utelämna headern för ett gästinlägg):

```bash
curl -X POST https://vatwhoqag4.execute-api.eu-north-1.amazonaws.com/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{ "title": "Mitt första inlägg", "content": "Hej på er allihop!" }'
```

## Felhantering

Alla fel returneras i formatet:

```json
{ "error": "Beskrivning av felet" }
```

| Statuskod | När |
|---|---|
| 400 | Ogiltig eller saknad data, ogiltig JSON, okända query-parametrar |
| 401 | Saknad eller ogiltig token, fel användarnamn eller lösenord |
| 403 | Inloggad men inte ägare, eller försök att ändra ett gästinlägg |
| 404 | Inlägget finns inte |
| 409 | Användarnamnet är redan registrerat |
| 500 | Internt serverfel (detaljerna loggas, visas inte för klienten) |

## Databas

Tre tabeller i DynamoDB:

| Tabell | Partition key | Sort key |
|---|---|---|
| Users | `username` | |
| Posts | `id` | |
| Comments | `postId` | `createdAt` |

- **Users:** användarnamnet är nyckeln. Unika namn garanteras med `attribute_not_exists` vid registrering
- **Posts:** varje inlägg har ett UUID som nyckel
- **Comments:** alla kommentarer till ett inlägg hämtas med en Query på `postId`, redan sorterade efter `createdAt`

## Designval

- **Lagerindelning:** handlers hanterar bara HTTP, services innehåller affärslogiken och repositories pratar med databasen. Autentisering, auktorisering och validering ligger i återanvändbara middlewares.
- **Egen validerings-middleware:** bodyn tolkas och valideras med Zod i samma middleware, så att felaktig eller trasig JSON alltid ger 400 enligt API-specifikationen.
- **Felhantering:** fel kastas med `createError` från `@middy/util` och fångas av en egen `errorHandler`, som ger formatet `{ "error": "..." }`.
- **bcryptjs:** samma algoritm som bcrypt, men skriven i ren JavaScript. Den fungerar därför på Lambda utan att behöva byggas för Linux.
- **Gästinlägg:** `optionalAuth` släpper igenom anrop utan token som gäster, men stoppar ogiltiga token med 401. Ägarkontrollen kräver `isGuest: false`, så gästinlägg kan aldrig ändras, även om en registrerad användare har samma namn.


## Testning

Repot innehåller en Postman-samling med 39 tester: `postman/Shui.postman_collection.json`.

1. Postman → **Import** → välj filen
2. Högerklicka på samlingen **Shui** → **Run collection** → **Run Shui**

Testerna körs i ordning och täcker alla endpoints, både lyckade anrop och felfall (400, 401, 403, 404 och 409). Varje körning skapar nya testanvändare, så samlingen kan köras flera gånger. Byt `baseUrl` under **Variables** för att testa mot en annan deploy.
