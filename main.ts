import Denomander from "https://deno.land/x/denomander/mod.ts";

const program = new Denomander({
  app_name: "RTF Reader",
  app_description:
    "This app will help you generate FS Number of printed orders",
  app_version: "1.0.0",
});

program
  .command("generate")
  .requiredOption("-i --input", "Define the input directory")
  .requiredOption("-o --output", "Define the output path")
  .parse(Deno.args);

if (program.input) {
  let data = "ORDER ID, FS NUMBER, CUSTOMER, DATE\n";

  for await (const dirEntry of Deno.readDir(program.input)) {
    if (dirEntry.isFile && dirEntry.name.endsWith(".rtf")) {
      const fileContents = await Deno.readTextFile(dirEntry.name);

      const matches = fileContents.matchAll(
        /FS\sNo.(.+?)\s*DATE:\s(.*)\n*.*\n*\n*(Customers\sTIN.*)?\n*Customer:\s(.*)\nRef:\s(.*)/g,
      );

      for (const x of matches) {
        data += `${x[5]}, ${x[1]}, ${x[4]}, ${x[2]}\n`;
      }
    }
  }

  await Deno.writeTextFile(`${program.output}.csv`, data);
}
