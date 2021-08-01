
const Api = require('./Api');

// Get ESV API config from config file
const esvApiConfig = require('../config').apis.esv;

// Load readline for REPL interface
const readline = require('readline');
// Load chalk for coloured strings
const chalk = require('chalk');
// Load clipboardy for saving to clipboard
const clipboard = require('clipboardy');


class ESVApi extends Api {
    /**
     * Initialise new app
     * @param {String} apiKey API Key
     */
    constructor(apiKey) {
        super({
            apiKey,
            ...esvApiConfig
        });
    }

    get apiKey() {
        return this._apiKey;
    }

    set apiKey(key) {
        this._apiKey = key;
    }
    

    /**
     * Fetch passage query from ESV Bible API
     * @param {*} q Passage query
     * @returns {String} ESV Bible Passage
     */
    async getPassage(q, options) {
        // Get endpoint configuration
        const { getPassage: endpoint } = this.methods;

        const data = await this.endpointGetRequest(q, endpoint);

        // Extract passages from data
        const passages = data.passages ? 
            data.passages.join(' ') :
            null;

        // If no passage provided, return 404 error message
        if (!passages) return endpoint.messages[404];

        /**
         * Save to clipboard if option selected
         */
         if (options.copy) {
            // Copy to clipboard
            clipboard.writeSync(passages);
        }

        return passages;
    }

    createGetPassageRepl(options) {
        // Create new readline interface
        const rl = new readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: chalk.blue('> ')
        });
    
        // Handle new lines
        rl.on('line', async query => {
            // Retrieve passage text from query
            const text = await this.getPassage(query, options);
    
            process.stdout.write(text);
    
            // Refresh prompt
            rl.prompt();
        });
    
        // Initial prompt
        rl.prompt();
    }
}

// Export app
module.exports = ESVApi;