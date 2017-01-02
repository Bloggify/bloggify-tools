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

new Tilda(`${__dirname}/../package.json`).main(action => {
    inquirer.prompt([
	{
	    type: "list",
	    name: "main",
	    message: "What do you want to do?",
	    choices: [
                {
                    name: "Create a blog for me"
                  , value: "personal-blog"
                }
              , {
                    name: "Create a blog for somebody else"
                  , value: "blog"
                }
              , {
                    name: "Create custom application"
                  , value: "custom-app"
                }
              , {
                    name: "Start my app"
                  , value: "start"
                  , disabled: true
                }
              , {
                    name: "Install a plugin"
                  , value: "install-plugin"
                  , disabled: true
                }
              , {
                    name: "Uninstall a plugin"
                  , value: "uninstall-plugin"
                  , disabled: true
                }
	    ]
	}
    ]).then(function (answers) {
        switch (answers.main) {
            case "blog":
            case "personal-blog":
            case "custom-app":
                log("So, you want to create a new Bloggify app! Cool. Please answer the following questions. If you're happy with the defaults (the one in parentheses), just press the return key.", "info");
                fullname().then(userFullName=> {
                    let questions = [
                        answers.main !== "custom-app" ? {
                            type: "input",
                            name: "full_name",
                            default: () => userFullName,
                            message: answers.main === "personal-blog" ? "Your name" : "Your friend's name"
                        } : null,
                        {
                            type: "input",
                            name: "git_url",
                            default: () => answers.main === "custom-app" ? "https://github.com/BloggifyTutorials/custom-app" : "https://github.com/Bloggify/bloggify-quick-start.git",
                            message: "Git url"
                        },
                        {
                            type: "input",
                            name: "title",
                            default: answs => /blog/.test(answers.main) ? answs.full_name : "Custom App",
                            message: "Website title"
                        },
                        {
                            type: "input",
                            name: "description",
                            message: "Website description",
                            default: answs => `${/blog/.test(answers.main) ? answs.full_name + "'s Blog" : "My fancy Bloggify app."}`
                        },
                        answers.main !== "custom-app" ? {
                            type: "input",
                            name: "theme",
                            message: "Website theme",
                            default: () => `bloggify-theme-light`
                        } : null,
                        {
                            type: "input",
                            name: "domain",
                            message: "Production url",
                            default (answers) {
                                return `http://${slug(answers.title, { lower: true })}.com`;
                            }
                            // TODO Validation
                        }
                    ].filter(Boolean);
                    return inquirer.prompt(questions);
                }).then(answers => {
                    answers.dir = slug(answers.title, { lower: true });
                    Bloggify.init(answers);
                });
                break;
            case "start":
                break;
            case "install-plugin":
                break;
            case "uninstall-plugin":
                break;
        }
    });
});
