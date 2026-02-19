# Spotify Artists

Web app para explorar artistas, álbuns e faixas do Spotify com autenticação via OAuth 2.0 (PKCE).

## Pré-requisitos

- Node.js >= 20
- pnpm >= 10

## Setup

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
```

Edite o `.env` com suas credenciais do [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):

```
VITE_SPOTIFY_CLIENT_ID=seu_client_id
VITE_REDIRECT_URI=http://127.0.0.1:5173/callback
```

> No Dashboard do Spotify, adicione `http://127.0.0.1:5173/callback` como Redirect URI.

## Comandos

### Desenvolvimento

```bash
pnpm dev              # Inicia dev server em http://localhost:5173
pnpm build            # Build de produção (type-check + bundle)
pnpm preview          # Preview do build local
```

### Qualidade de código

```bash
pnpm lint             # Roda ESLint
pnpm lint:fix         # Corrige problemas do ESLint automaticamente
pnpm format           # Formata código com Prettier
pnpm format:check     # Verifica formatação sem alterar
pnpm type-check       # Verifica tipos TypeScript
pnpm check            # Roda type-check + lint + format:check de uma vez
```

### Testes

```bash
pnpm test             # Testes unitários em watch mode
pnpm test:run         # Roda testes uma vez
pnpm test:coverage    # Gera relatório de cobertura
pnpm test:e2e         # Testes end-to-end (Playwright)
pnpm test:e2e:headed  # E2E com browser visível
pnpm test:e2e:ui      # E2E com interface do Playwright
```

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 |
| Build | Vite (Rolldown) |
| Roteamento | TanStack Router |
| Estado servidor | TanStack React Query |
| Estilo | Tailwind CSS v4 |
| Formulários | React Hook Form + Zod |
| i18n | i18next (pt-BR, en-US) |
| HTTP | Axios |
| Testes unitários | Vitest + React Testing Library |
| Testes E2E | Playwright |
| Linting | ESLint + Prettier |

## Estrutura do projeto

O projeto segue uma arquitetura baseada em **Feature-Sliced Design**, onde cada camada tem uma responsabilidade clara e as dependências fluem em uma única direção: `routes → features → entities → shared`.

```
src/
├── app/                  # Bootstrap da aplicação
│   ├── App.tsx           # Composição dos providers (Query, Auth, Library, Toast)
│   ├── router.tsx        # Configuração do TanStack Router
│   └── providers/        # QueryClientProvider com devtools
│
├── entities/             # Modelos de domínio (schemas Zod + tipos)
│   ├── artist/           # Artist, ArtistSearchResponse, ArtistFilters
│   ├── album/            # Album, AlbumType, ArtistAlbumsResponse
│   ├── track/            # Track, TrackStats, TracksByDuration
│   ├── auth/             # AuthTokens, UserProfile
│   └── favorites/        # FavoriteArtist, FavoriteAlbum, Library
│
├── features/             # Features por domínio (API + componentes + lógica)
│   ├── artists/
│   │   ├── api/          # Client Spotify, query keys, hooks (useSearchArtists, useArtistDetails...)
│   │   └── components/   # ArtistCard (compound), ArtistDetails, ArtistCharts, SearchTypeToggle
│   ├── albums/
│   │   └── components/   # AlbumCard com favorito e link externo
│   ├── tracks/
│   │   └── components/   # TrackList com popularidade, duração e preview
│   ├── auth/
│   │   ├── api/          # OAuth PKCE: login, token exchange, refresh, logout
│   │   ├── context/      # AuthProvider com reducer (loading/authenticated/unauthenticated)
│   │   ├── hooks/        # useAuth
│   │   └── components/   # LoginButton, UserProfile, UserMenu
│   └── library/
│       ├── context/      # LibraryProvider (add/remove artistas e álbuns, persistência)
│       ├── model/        # localStorage com validação Zod
│       └── components/   # FavoriteButton com toast e animação
│
├── routes/               # File-based routing (TanStack Router)
│   ├── __root.tsx        # Layout raiz: header, navegação, language selector
│   ├── index.tsx         # Home: busca e favoritos recentes
│   ├── callback.tsx      # OAuth callback: troca code por token
│   └── _authenticated/   # Rotas protegidas (redirect se não autenticado)
│       ├── artists/      # Busca de artistas/álbuns com paginação
│       │   ├── $artistId # Detalhe: info, top tracks, charts, álbuns
│       │   └── -hooks/   # useArtistSearchParams (URL ↔ estado)
│       └── library       # Biblioteca de favoritos
│
├── shared/               # Código reutilizável entre features
│   ├── api/              # Axios client (interceptors, rate limit, refresh), ApiError
│   ├── components/       # UI: Loading, Pagination, SearchBar, Skeleton, EmptyState,
│   │                     #     ErrorBoundary, NotFound, Toast, LanguageSelector
│   ├── config/           # Constantes (URLs, scopes, paginação), env vars
│   ├── hooks/            # useDebounce
│   ├── i18n/             # i18next config, pt-BR e en-US
│   └── utils/            # cn (tailwind merge), crypto (PKCE), format (datas, números)
│
└── test/                 # Infraestrutura de testes
    ├── setup.tsx         # Vitest setup: mocks globais (i18n, router), MSW server
    ├── test-utils.tsx    # Custom render com QueryClient + LibraryProvider
    └── mocks/            # MSW handlers para API do Spotify
```

### Decisões de arquitetura

- **Entities** contêm apenas tipos e schemas Zod, sem lógica de UI ou side effects
- **Features** encapsulam tudo de um domínio (API, componentes, contexto, hooks) e exportam uma API pública via `index.ts`
- **Shared** nunca importa de features ou routes — apenas o contrário
- **Routes** são a camada mais externa, compondo features e shared para montar as páginas
- **Auth** usa fluxo **PKCE** (sem client secret no browser) com refresh automático via interceptor Axios
- **Library** persiste favoritos no **localStorage** com validação Zod no load/save
- **MSW** é usado tanto nos testes (Node) quanto opcionalmente no dev (`VITE_MSW=true`)
