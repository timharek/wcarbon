// @deno-types='./mod.d.ts'
import { Command, GithubProvider, UpgradeCommand } from './deps.ts';
import { queryData, querySite } from './src/query_api.ts';

await new Command()
  .name('wcarbon')
  .version('1.3.1')
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
  .globalOption('-v, --verbose', 'A more verbose output.', {
    collect: true,
    value: (val: boolean, previous = 0) => val ? previous + 1 : 0,
  })
  .arguments('<url>')
  .action(async (options: { verbose: number }, url: string) =>
    console.log(await querySite(url, options.verbose ?? 0))
  )
  .command('site', 'Calculate the carbon emissions generated per page view.')
  .arguments('<url>')
  .action(async (options: { verbose: number }, url: string) =>
    console.log(await querySite(url, options.verbose ?? 0))
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
      options: { verbose: number; bytes: number; green: boolean },
      bytes: number,
    ) => {
      const request: DataRequest = {
        bytes,
        green: options.green ? 1 : 0,
      };
      console.log(await queryData(request, options.verbose));
    },
  )
  .command(
    'upgrade',
    new UpgradeCommand({
      main: 'mod.ts',
      args: ['--allow-net'],
      provider: [new GithubProvider({ repository: 'timharek/wcarbon' })],
    }),
  )
  .parse(Deno.args);
