import { Command } from '../deps.ts';
import { dataOutput, siteOutput } from './cli_utils.ts';

const app = new Command()
  .name('wcarbon')
  .version('2.0.0')
  .description('Query webpages (URLs) via Website Carbons API.')
  .meta('Author', 'Tim Hårek Andreassen <tim@harek.no>')
  .meta('Source', 'https://github.com/timharek/wcarbon')
  .example(
    'Check site',
    `wcarbon timharek.no`,
  )
  .globalOption('--json', 'Display JSON output.')
  .globalOption('-c, --calculated', 'Display calculated JSON output.');

export type GlobalOptions = typeof app extends
  Command<void, void, void, [], infer Options extends Record<string, unknown>>
  ? Options
  : never;

const siteCmd = new Command<GlobalOptions>()
  .description('Calculate the carbon emissions generated per page view.')
  .example('Check specific site', 'wcarbon site timharek.no')
  .arguments('<url:string>')
  .action(async (options, url: string) =>
    console.log(await siteOutput(url, options))
  );

const dateCmd = new Command<GlobalOptions>()
  .description(
    'Calculate the emissions of a page by manually passing the bytes and whether or not it is powered by green hosting.',
  )
  .example('Check emission of page with bytes', 'wcarbon data 1024')
  .arguments('<bytes:number>')
  .option('-g, --green [value:boolean]', 'Whether a page is green or not.', {
    default: false,
  })
  .action(async ({ green }, bytes: number) => {
    console.log(
      await dataOutput({ hasGreenHosting: green, bytes }),
    );
  });

if (import.meta.main) {
  await app
    .arguments('<url:string>')
    .action(async (options, url: string) =>
      console.log(await siteOutput(url, options))
    )
    .command('site', siteCmd)
    .command('data', dateCmd)
    .parse(Deno.args);
}
