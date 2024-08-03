#!/usr/bin/env node

import chalk from "chalk";
import { input, select } from "@inquirer/prompts";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import simpleGit from "simple-git"; // Import simple-git
import fs from "fs"; // Import the fs module
import path from "path"; // Import the path module

let frameworkType; // Annotate variable type
let database; // Annotate variable type
let folderName = "rest-api"; // Annotate variable type

const sleep = (ms = 1237) => new Promise((resolve) => setTimeout(resolve, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow("Welcome to Rest EZ \n");

  await sleep();
  rainbowTitle.stop();
}

async function setFolderName() {
  const folder = await input({ message: "Enter your Folder Name" });
  if (folder && folder !== "") {
    folderName = folder;
  }
}

async function cloneProject() {
  console.clear();

  const spinner = createSpinner("Setting Up project...").start();

  const git = simpleGit(); // Create an instance of simple-git
  let repoUrl;

  // Determine the repository URL based on frameworkType and database
  if (frameworkType === "NodeJS" && database === "Offline File Storage") {
    repoUrl = "https://github.com/Ankur02Sarkar/NodeJS-REST-API-Local.git";
  } else if (
    frameworkType === "FastAPI" &&
    database === "Offline File Storage"
  ) {
    repoUrl = "https://github.com/Ankur02Sarkar/Python-REST-API-Local.git";
  } else {
    spinner.error({ text: "Unsupported configuration" });
    process.exit(1);
  }

  try {
    await git.clone(repoUrl, folderName); // Clone the repository

    // Remove the .git folder after cloning
    const gitFolderPath = path.join(folderName, ".git");
    if (fs.existsSync(gitFolderPath)) {
      fs.rmSync(gitFolderPath, { recursive: true, force: true });
    }

    spinner.success({ text: "Project cloned successfully!" });

    figlet("Congratulations", async (err, data) => {
      if (err) {
        console.error("Something went wrong with figlet.");
        console.error(err);
        process.exit(1);
      }

      console.log(gradient.pastel.multiline(data) + "\n");

      const rainbowTitle = chalkAnimation.rainbow(
        "Your REST API has been generated successfully \n"
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
  } catch (error) {
    spinner.error({ text: "Failed to clone the repository." });
    console.error(error);
    process.exit(1);
  }
}

async function chooseFramework() {
  frameworkType = await select({
    message: "Choose Your Framework\n",
    choices: [
      { name: "NodeJS", value: "NodeJS" },
      { name: "FastAPI", value: "FastAPI" },
    ],
  });
}

async function chooseDB() {
  database = await select({
    message: "Choose Your Storage\n",
    choices: [
      { name: "Offline File Storage", value: "Offline File Storage" },
      { name: "MongoDB", value: "MongoDB" },
    ],
  });
}

// Run the quiz with top-level await
(async () => {
  console.clear();
  await welcome();
  await setFolderName();
  await chooseFramework();
  await chooseDB();
  await cloneProject(); // Ensure cloneProject is awaited
})();
