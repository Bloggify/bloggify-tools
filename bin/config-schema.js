// Dependencies
var Couleurs = require("couleurs")();

// Config schema
var ConfigSchema = module.exports = {
    properties: {
        database: {
            properties: {
                uri: {
                    message: "The database name is required."
                  , required: true
                  , description: "Database name (e.g. 'bloggify.my-blog'):"
                }
            }
        }
      , themeData: {
            properties: {
                analytics: {
                    properties: {
                        id: {
                            description: "The Google Analytics id (optional):"
                        }
                      , url: {
                            description: "The Google Analytics url (optional):"
                        }
                    }
                }
              , social: {
                    properties: {
                        twitter: {
                            description: "Your Twitter username (optional):"
                        }
                      , youtube: {
                            description: "Your YouTube username (optional):"
                        }
                      , github: {
                            description: "Your GitHub username (optional):"
                        }
                      , bitbucket: {
                            description: "Your BitBucket username (optional):"
                        }
                    }
                }
            }
        }
      , site: {
            properties: {
                title: {
                    description: "Your website title:"
                  , required: true
                }
              , description: {
                    description: "Your website description:"
                }
              , git: {
                    description: "Your website git repository (optional):"
                }
            }
        }
      , port: {
            description: "The server port (default: 8080):"
        }
    }
};

/**
 * iterateDescriptions
 *
 * @name iterateDescriptions
 * @function
 * @param {Object} obj The object that should be iterated.
 * @return {undefined}
 */
function iterateDescriptions(obj) {
    if (!obj || obj.constructor !== Object) { return; }
    if (typeof obj.description === "string") {
        obj.description = Couleurs.fg(obj.description, "#3498db");
    }
    Object.keys(obj).forEach(function (c) {
        iterateDescriptions(obj[c]);
    });
}

iterateDescriptions(ConfigSchema);
