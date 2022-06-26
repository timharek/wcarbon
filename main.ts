import { parse } from 'https://deno.land/std@0.130.0/flags/mod.ts';

const options = {
  api: '',
  format: 'long',
  type: 'site'
};

const REQUEST_URL = 'https://api.websitecarbon.com/';

interface Query {
  url?: string
}

const flags = parse(Deno.args, {
  boolean: ['help', 'short', 'long'],
  string: ['url'],
  alias: { 'url': ['u'], 'short': ['s'], 'long': ['l'], 'help': ['h'] },
});

async function query(query: Query, format: string) {
  let queryUrl = `${REQUEST_URL}${options.type}?`;
  if (options.type === 'site' && query.url) {
    queryUrl += `url=${query.url}`;
  }

  const result = await fetch(queryUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });

  if (format == 'long') {
    return result;
  }
}

if (!flags || flags.help) {
  console.log(`
wcarbon 1.0.0 

Author: Tim Hårek Andreassen <tim@harek.no>
Source: https://github.com/timharek/wcarbon

USAGE: 
  wcarbon [OPTIONS] [FLAGS]

OPTIONS:
  -h, --help        Prints this help message.
  -s, --short       Give the output in the short-format.
  -l, --long        Give the output in the long-format (default).
  -u, --url <url>   Test <url> with Website Carbons API and get results in either
                    long- or short-format.


EXAMPLES:
  $ wcarbon
  $ 
              `);
  Deno.exit(1);
}

if (flags.title && flags.id || flags.id && flags.title) {
  console.error('Cannot use ID in conjuction with title');
  Deno.exit(1);
}

if (flags.short) {
  options.format = 'short';
}

if (flags.url) {
  console.log(await query({ url: flags.url }, options.format))
}
