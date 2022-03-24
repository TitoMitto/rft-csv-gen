import Denomander from "https://deno.land/x/denomander/mod.ts";

const program = new Denomander({
  app_name: "RTF to CSV Generator",
  app_description:
    "This program will help you generate csv of FSNumbers of printed sales",
  app_version: "1.0.0",
});

program
  .command("generate")
  .requiredOption("-i --input", "Define the input file or directory")
  .option("-o --output", "Define the output path")
  .parse(Deno.args);


if (program.input) {
  let data = "ORDER ID, FS NUMBER, CUSTOMER, DATE\n";

  if(program.input.endsWith(".rtf")){
    const fileContents = await Deno.readTextFile(`${program.input}`);
    data = generateText(fileContents, data);
  } else{ 
    for await (const dirEntry of Deno.readDir(program.input)) {
        if (dirEntry.isFile && dirEntry.name.endsWith(".rtf")) {
          const fileContents = await Deno.readTextFile(`${program.input}/${dirEntry.name}`);
          data =generateText(fileContents, data)
        }
      }
  }
  
  await Deno.writeTextFile(`${program.output ?? "output"}.csv`, data);
}


function generateText(fileContents: string, data:string){
    const matches = fileContents.matchAll(
        /FS\sNo.(.+?)\s*DATE:\s(.*)\n*.*\n*\n*(Customers\sTIN.*)?\n*Customer:\s(.*)\nRef:\s(.*)/g,
      );

      for (const x of matches) {
        data += `${x[5]}, ${x[1]}, ${x[4]}, ${x[2]}\n`;
      }
      return data;
}