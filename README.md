[![Latest version](https://deno.land/badge/wcarbon/version)](https://deno.land/x/wcarbon)
[![sourcehut](https://img.shields.io/badge/repository-sourcehut-lightgrey.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSINCiAgICB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+DQogIDxkZWZzPg0KICAgIDxmaWx0ZXIgaWQ9InNoYWRvdyIgeD0iLTEwJSIgeT0iLTEwJSIgd2lkdGg9IjEyNSUiIGhlaWdodD0iMTI1JSI+DQogICAgICA8ZmVEcm9wU2hhZG93IGR4PSIwIiBkeT0iMCIgc3RkRGV2aWF0aW9uPSIxLjUiDQogICAgICAgIGZsb29kLWNvbG9yPSJibGFjayIgLz4NCiAgICA8L2ZpbHRlcj4NCiAgICA8ZmlsdGVyIGlkPSJ0ZXh0LXNoYWRvdyIgeD0iLTEwJSIgeT0iLTEwJSIgd2lkdGg9IjEyNSUiIGhlaWdodD0iMTI1JSI+DQogICAgICA8ZmVEcm9wU2hhZG93IGR4PSIwIiBkeT0iMCIgc3RkRGV2aWF0aW9uPSIxLjUiDQogICAgICAgIGZsb29kLWNvbG9yPSIjQUFBIiAvPg0KICAgIDwvZmlsdGVyPg0KICA8L2RlZnM+DQogIDxjaXJjbGUgY3g9IjUwJSIgY3k9IjUwJSIgcj0iMzglIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjQlIg0KICAgIGZpbGw9Im5vbmUiIGZpbHRlcj0idXJsKCNzaGFkb3cpIiAvPg0KICA8Y2lyY2xlIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjM4JSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0JSINCiAgICBmaWxsPSJub25lIiBmaWx0ZXI9InVybCgjc2hhZG93KSIgLz4NCjwvc3ZnPg0KCg==)](https://sr.ht/~timharek/wcarbon)
[![GitHub mirror](https://img.shields.io/badge/mirror-GitHub-black.svg?logo=github)](https://github.com/timharek/wcarbon)

# wcarbon

Access [Website Carbon's API](https://api.websitecarbon.com/) for checking
carbon emissions for websites.

## Usage

### Example for site

```ts
import { site } from "https://deno.land/x/wcarbon/mod.ts";

const siteUrl = "example.org";
const result = site(siteUrl);
```

### Example for data

```ts
import { data } from "https://deno.land/x/wcarbon/mod.ts";

const result = data({ bytes: 1024, hasGreenHosting: false });
```

## CLI

### Installation

```sh
deno install --allow-net=api.websitecarbon.com \
   -n wcarbon https://deno.land/x/wcarbon/src/cli.ts
```

### Usage

```bash
$ wcarbon timharek.no
$ wcarbon site timharek.no
$ wcarbon data 2048
$ wcarbon -h # for all available flags and commands
```

## Development

1. Install [Deno](https://deno.land)
1. Run `deno task setup:hooks`
1. Now you can get to work! :sunglasses:
