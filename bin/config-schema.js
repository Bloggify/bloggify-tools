// Dependencies
var Couleurs = require("couleurs")();

const YES_OR_NO = /^y|n$/i;

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
      , plugins: {
            properties: {
                dashboard: {
                    description: "Do you want to install the dashboard plugin?"
                  , pattern: YES_OR_NO
                  , message: "Please answer with y or n."
                  , _: {
                        username: {
                            description: "Enter your dashboard username:"
                          , required: true
                        }
                      , displayName: {
                            description: "Enter your dashboard display name:"
                          , required: true
                        }
                      , password: {
                            description: "Enter your dashboard password:"
                          , required: true
                        }
                    }
                }
              , contactForm: {
                    description: "Do you want to install the contact form plugin?"
                  , pattern: YES_OR_NO
                  , message: "Please answer with y or n."
                  , _: {
                        mandrill_key: {
                            description: "Insert your Mandrill API key:"
                          , required: true
                        }
                      , contact_page: {
                            description: "Enter the contact page:"
                          , required: true
                        }
                      , contact: {
                            properties: {
                                email: {
                                    description: "Enter your contact email address:"
                                  , required: true
                                }
                              , email: {
                                    description: "Enter your contact display name:"
                                  , required: true
                                }
                            }
                        }
                    }
                }
              , lightbox: {
                    description: "Do you want to install the contact lightbox plugin?"
                  , pattern: YES_OR_NO
                  , message: "Please answer with y or n."
                }
              , social: {
                    description: "Do you want to install the social plugin?"
                  , pattern: YES_OR_NO
                  , message: "Please answer with y or n."
                }
              , rss: {
                    description: "Do you want to install the  RSS plugin?"
                  , pattern: YES_OR_NO
                  , message: "Please answer with y or n."
                  , _: {
                        description: {
                            description: "Enter the RSS description."
                        }
                    }
                }
            }
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
