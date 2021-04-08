#!/usr/bin/env node
"use strict";

// Dependencies
const Tilda = require("tilda")
    , Bloggify = require("..")
    , inquirer = require("inquirer")
    , fullname = require("fullname")
    , slug = require("slug")
    , log = require("emoji-logger")
    ;

new Tilda(`${__dirname}/../package.json`).main(async action => {
    const MAIN_MENU = {
        title: "What do you want to do?",
        choices: [
            {
                name: "New Application"
              , value: "new-application"
              , choices: [
                    {
                        name: "Create a blog for me"
                      , value: "personal-blog"
                    }
                  , {
                        name: "Create a blog for somebody else"
                      , value: "blog"
                    }
                  , {
                        name: "Create a custom application"
                      , value: "custom-app"
                    }
                  , {
                        name: "Create a custom application with Sqlite database"
                      , value: "custom-app-sqlite"
                    }
                  , {
                        name: "« Back",
                        value: "_back"
                    }
                ]
            },
            {
                name: "Application Database Migrations"
              , value: "application-database-migrations"
              , choices: [
                    {
                        name: "Run migrations"
                      , value: "run-migrations"
                    }
                  , {
                        name: "Create migration"
                      , value: "create-migration"
                    }
                  , {
                        name: "« Back",
                        value: "_back"
                    }
                ]
            },
            {
                name: "Application Functions"
              , value: "application-functions"
              , choices: [
                    {
                        name: "Start Application"
                      , value: "application-start"
                      , choices: [
                            {
                                name: "Development"
                              , value: "application-start-development"
                            }
                          , {
                                name: "Debug"
                              , value: "application-start-debug"
                            }
                          , {
                                name: "Production"
                              , value: "application-start-production"
                            }
                          , {
                                name: "« Back",
                                value: "_back"
                            }
                        ]
                    }
                  , {
                        name: "Bundle Assets"
                      , value: "application-bundle"
                    }
                  , {
                        name: "Database Connect"
                      , value: "database-connect"
                    }
                  , {
                        name: "« Back",
                        value: "_back"
                    }
                ]
            }
        ]
    }

    const processMenu = async () => {

        let parent  = MAIN_MENU

        do {
            parent.choices = parent.choices || []
            const currentMenu = {
                type: "list",
                name: "main",
                message: parent.title || parent.name,
                choices: parent.choices.map(c => {
                    return {
                        name: c.name,
                        value: c.value
                    }
                })
            }

            const choiceMap = parent.choices.reduce((acc, c) => {
                acc[c.value] = c
                return acc
            }, {})

            const answer = (await inquirer.prompt([currentMenu])).main
            const answerMenu = choiceMap[answer]
            answerMenu.choices = answerMenu.choices || []

            if (answerMenu.choices.length) {
                answerMenu._parent = parent
                parent = answerMenu
            } else if (answer === "_back") {
                parent = parent._parent
            } else {
                return answer
            }
        } while (true)
    }

    const answer = await processMenu()
    switch (answer) {
        case "blog":
        case "personal-blog":
        case "custom-app":
        case "custom-app-sqlite":
            log("So, you want to create a new Bloggify app! Cool. Please answer the following questions. If you're happy with the defaults (the one in parentheses), just press the return key.", "info");
            const userFullName = await fullname()
            const isCustom = answer.includes("custom-app")
            const defaultGitUrl = ({
                "custom-app": "https://github.com/BloggifyTutorials/custom-app",
                "custom-app-sqlite": "https://github.com/BloggifyTutorials/custom-app-sqlite",
                "personal-blog": "https://github.com/Bloggify/bloggify-quick-start.git",
                "blog": "https://github.com/Bloggify/bloggify-quick-start.git"
            })[answer]

            let questions = [

                // Get the fullname
                !isCustom ? {
                    type: "input",
                    name: "full_name",
                    default: () => userFullName,
                    message: answer === "personal-blog" ? "Your name" : "Your friend's name"
                } : null,

                // Set the template git url
                {
                    type: "input",
                    name: "git_url",
                    default: () => defaultGitUrl,
                    message: "Application Template"
                },

                // App title
                {
                    type: "input",
                    name: "title",
                    default: answs => /blog/.test(answer) ? answs.full_name : "Custom App",
                    message: "Website title"
                },

                // App description
                {
                    type: "input",
                    name: "description",
                    message: "Website description",
                    default: answs => `${/blog/.test(answer) ? answs.full_name + "'s Blog" : "My fancy Bloggify app."}`
                },

                // Theme
                !isCustom ? {
                    type: "input",
                    name: "theme",
                    message: "Website theme",
                    default: () => `bloggify-theme-light`
                } : null,

                // Production Url
                {
                    type: "input",
                    name: "domain",
                    message: "Production url",
                    default (answers) {
                        return `https://${slug(answers.title, { lower: true })}.com`;
                    }
                    // TODO Validation
                }
            ].filter(Boolean);
            const answers = await inquirer.prompt(questions);
            answers.dir = slug(answers.title, { lower: true });
            Bloggify.init(answers);
            break;
        case "application-start-development":
            Bloggify.applicationStart(Bloggify.APP_MODES.DEVELOPMENT)
            break;

        case "application-start-debug":
            Bloggify.applicationStart(Bloggify.APP_MODES.DEBUG)
            break;

        case "application-start-production":
            Bloggify.applicationStart(Bloggify.APP_MODES.PRODUCTION)
            break;

        case "database-connect":
            Bloggify.databaseConnect()
            break;

        case "application-bundle":
            Bloggify.applicationBundle()
            break;

        // Migrations
        case "run-migrations":
            Bloggify.runMigrations()
            break;

        // Migrations
        case "create-migration":
            const { migration_name } = await inquirer.prompt([{
                type: "input",
                name: "migration_name",
                message: "Migration name"
            }])
            Bloggify.createMigration(migration_name)
            break;
    }
});
