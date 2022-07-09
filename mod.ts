import { CONFIG, FLAGS } from './config.ts';
import { printHelp } from './deps.ts';
import { isValidUrl, noArgs } from './src/helpers.ts';
import { queryData, querySite } from './src/query_api.ts';

const options = {
  format: 'long',
  type: 'site',
};

if (noArgs(FLAGS) || FLAGS.help) {
  printHelp(CONFIG);
  Deno.exit(1);
}

if (FLAGS.version) {
  console.log(CONFIG.version);
  Deno.exit(1);
}

if (FLAGS.short) {
  options.format = 'short';
}

if (FLAGS._) {
  if (FLAGS._.length > 1) {
    console.error(
      '%cToo many arguments',
      'color: white; background-color: red; font-weight: bold',
    );
    Deno.exit(-1);
  }
  const url = String(FLAGS._[0]);

  if (!isValidUrl(url)) {
    Deno.exit(-1);
  }
  console.log(await querySite(url, options.format));
}

if (FLAGS.url) {
  const url = FLAGS.url;
  if (!isValidUrl(url)) {
    Deno.exit(-1);
  }
  console.log(await querySite(url, options.format));
}

if (FLAGS.bytes) {
  console.log(
    await queryData(FLAGS.bytes, FLAGS.green ? 1 : 0, options.format),
  );
}
