#!/usr/bin/env node

import chalk from "chalk";
import { input, select } from "@inquirer/prompts";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

let frameworkType: string; // Annotate variable type
let database: string; // Annotate variable type

const sleep = (ms: number = 1237): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function welcome(): Promise<void> {
  const rainbowTitle = chalkAnimation.rainbow("Welcome to Rest EZ \n");

  await sleep();
  rainbowTitle.stop();
}

function cloneProject(): void {
  console.clear();
  console.log("frameworkType : ", frameworkType);
  console.log("database : ", database);

  let folderName = "rest-api"; // should be the name of the cloned folder

  figlet("Congratulations", async (err, data) => {
    if (err) {
      console.error("Something went wrong with figlet.");
      console.error(err);
      process.exit(1);
    }

    console.log(gradient.pastel.multiline(data) + "\n");

    const rainbowTitle = chalkAnimation.rainbow(
      "Your REST API has been generated succesfully \n"
    );

    await sleep(700);
    rainbowTitle.stop();

    console.log(
      chalk.green(
        `Follow Up Steps :- \n
        - cd ${folderName}
        - ${
          frameworkType === "NodeJS"
            ? "npm install"
            : "pip install -r requirements.txt"
        }
        - ${frameworkType === "NodeJS" ? "node index.js" : "uvicorn main:app"}
        `
      )
    );
    process.exit(0);
  });
}

async function chooseFramework(): Promise<void> {
  frameworkType = await select({
    message: "Choose Your Framework\n",
    choices: [
      { name: "NodeJS", value: "NodeJS" },
      { name: "FastAPI", value: "FastAPI" },
    ],
  });
}

async function chooseDB(): Promise<void> {
  database = await select({
    message: "Choose Your Storage\n",
    choices: [
      { name: "Local Storage", value: "Local Storage" },
      { name: "MongoDB", value: "MongoDB" },
    ],
  });
}

// Run the quiz with top-level await
(async () => {
  console.clear();
  await welcome();
  await chooseFramework();
  await chooseDB();
  cloneProject();
})();
