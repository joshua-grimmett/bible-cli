
const Api = require('./Api');

// Get ESV API config from config file
const metadata = require('../assets/apiMetadata').apis.nte;

// Load readline for REPL interface
const readline = require('readline');
// Load chalk for coloured strings
const chalk = require('chalk');
// Load clipboardy for saving to clipboard
const clipboard = require('clipboardy');
// Load cheerio for scraping
const cheerio = require('cheerio');

class NTEApi extends Api {
    /**
     * Initialise new app
     */
    constructor() {
        super({
            ...metadata
        });
    }
    

    /**
     * Fetch passage query from BibleGateway
     * @param {*} q Passage query
     * @param {Object} options Query options
     * @returns {String} NTE Bible Passage
     */
    async getPassage(q, options) {
        // Get endpoint configuration
        const { getPassage: endpoint } = this.methods;

        const data = await this.endpointGetRequest(q, endpoint);
        // Extract passages from data
        const output = this.scrapePassages(data, endpoint).trim();

        // If no passage provided, return 404 error message
        if (!output) return endpoint.messages[404];

        /**
         * Save to clipboard if option selected
         */
         if (options.copy) {
            // Copy to clipboard
            clipboard.writeSync(output);
        }

        return output;
    }

    /**
     * Create a passage search repl
     * @param {Object} options 
     */
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

            console.log(text);
    
            // Refresh prompt
            rl.prompt();
        });
    
        // Initial prompt
        rl.prompt();
    }


    scrapePassages(html, { scrapeData }) {
        // Parse html with Cheerio
        const $ = cheerio.load(html);
        
        let output = '';

        // Append verse
        output += $(scrapeData.parentNode).first().children().map((_i, el) => {
            return scrapeData.childrenFilters($(el).first());
        })
            .toArray()
            .join('\n');

        // Append query
        output += '\n' + $(scrapeData.queryNode).html();
        return output;
    }
}

// Export app
module.exports = NTEApi;