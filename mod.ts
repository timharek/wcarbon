// @deno-types='./mod.d.ts'
import { Command } from './deps.ts';
import { queryData, querySite } from './src/query_api.ts';

await new Command()
  .name('wcarbon')
  .version('1.2.0')
  .description('Query webpages (URLs) via Website Carbons API.')
  .meta('Author', 'Tim Hårek Andreassen <tim@harek.no>')
  .meta('Source', 'https://github.com/timharek/wcarbon')
  .example(
    'Check site',
    `wcarbon check timharek.no`,
  )
  .example(
    'Check site but verbose',
    `wcarbon check timharek.no -v`,
  )
  .globalOption('-v, --verbose [value:boolean]', 'A more verbose output.', {
    default: false,
  })
  .arguments('<url>')
  .action(async (options: { verbose: boolean }, url: string) =>
    console.log(await querySite(url, options.verbose))
  )
  .command('site', 'Calculate the carbon emissions generated per page view.')
  .arguments('<url>')
  .action(async (options: { verbose: boolean }, url: string) =>
    console.log(await querySite(url, options.verbose))
  )
  .command(
    'data',
    'Calculate the emissions of a page by manually passing the bytes and whether or not it is powered by green hosting.',
  )
  .arguments('<bytes:number>')
  .option('-g, --green [value:boolean]', 'Whether a page is green or not.', {
    default: false,
  })
  .action(
    async (
      options: { verbose: boolean; bytes: number; green: boolean },
      bytes: number,
    ) => {
      const request: DataRequest = {
        bytes,
        green: options.green ? 1 : 0,
        verbose: options.verbose,
      };
      console.log(await queryData(request));
    },
  )
  .parse(Deno.args);
