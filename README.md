# wcarbon

Access [Website Carbon's API](https://api.websitecarbon.com/) for checking
carbon emissions for websites.

## Usage

## Example for site

```ts
import { querySite } from 'https://deno.land/x/wcarbon/mod.ts';

const domain = 'example.org';
const result = querySite(domain);
```

## Example for data

```ts
import { queryData } from 'https://deno.land/x/wcarbon/mod.ts';

const bytes = '1024';
const result = queryData(bytes);
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
1. Install [githooked](https://github.com/amethyst-studio/githooked/#installation)
1. Run `githooked enable`
1. Now you can get to work! :sunglasses:
