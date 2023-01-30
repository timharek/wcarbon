// @deno-types='../mod.d.ts'

import { Command } from '../deps.ts';
import { queryData, querySite } from './wcarbon.ts';

const siteCmd = new Command()
  .description('Calculate the carbon emissions generated per page view.')
  .example('Check specific site', 'wcarbon site timharek.no')
  .arguments('<url:string>')
  .action(async (options: { verbose: number }, url: string) =>
    console.log(await querySite(url, options.verbose ?? 0))
  );

const dateCmd = new Command()
  .description(
    'Calculate the emissions of a page by manually passing the bytes and whether or not it is powered by green hosting.',
  )
  .example('Check emission of page with bytes', 'wcarbon data 1024')
  .arguments('<bytes:number>')
  .option('-g, --green [value:boolean]', 'Whether a page is green or not.', {
    default: false,
  })
  .action(
    async (
      options: { verbose: number; bytes: number; green: boolean },
      bytes: number,
    ) => {
      const request: DataRequest = {
        bytes,
        green: options.green ? 1 : 0,
      };
      console.log(await queryData(request, options.verbose));
    },
  );

await new Command()
  .name('wcarbon')
  .version('1.4.0')
  .description('Query webpages (URLs) via Website Carbons API.')
  .meta('Author', 'Tim Hårek Andreassen <tim@harek.no>')
  .meta('Source', 'https://github.com/timharek/wcarbon')
  .example(
    'Check site',
    `wcarbon timharek.no`,
  )
  .globalOption('-v, --verbose', 'A more verbose output.', {
    collect: true,
    value: (val: boolean, previous = 0) => val ? previous + 1 : 0,
  })
  .arguments('<url:string>')
  .action(async (options: { verbose: number }, url: string) =>
    console.log(await querySite(url, options.verbose ?? 0))
  )
  .command('site', siteCmd)
  .command('data', dateCmd)
  .parse(Deno.args);
