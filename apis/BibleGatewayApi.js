
const Api = require('./Api');

// Get ESV API config from config file
const metadata = require('../assets/apiMetadata').apis.biblegateway;

// Load readline for REPL interface
const readline = require('readline');
// Load chalk for coloured strings
const chalk = require('chalk');
// Load clipboardy for saving to clipboard
const clipboard = require('clipboardy');
// Load cheerio for scraping
const cheerio = require('cheerio');

class BibleGatewayApi extends Api {
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
     * @returns {String} BibleGateway Bible Passage
     */
    async getPassage(q, options) {
        // Get endpoint configuration
        const { getPassage: endpoint } = this.methods;
        // Get translation from options
        const { translation } = options;
        
        if (translation) {
            endpoint.params.version = translation
        }

        const data = await this.endpointGetRequest(q, endpoint);
        // Extract passage data
        let { 
            passages, 
            queryText, 
            translationText
        } = this.scrapePassages(data, endpoint);
        let output = passages.trim();

        // If no passage provided, return 404 error message
        if (!output) return endpoint.messages[404];

        // If passage query included add to output
        if (endpoint.params['include-passage-query']) {
            output += `\n${queryText}`;
        }

        // If translation text included add to output
        if (endpoint.params['include-translation']) {
            output += ` (${translationText})`;
        }

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
        
        const passages = $(scrapeData.parentNode).first().children().map((_i, el) => {
            return scrapeData.childrenFilters($, el);
        })
            .toArray()
            .join('\n');

        // Append query
        const queryText = $(scrapeData.queryNode).html();

        // Append translation
        const translationText = $(scrapeData.translationNode).last().html();

        return { passages, queryText, translationText };
    }
}

// Export app
module.exports = BibleGatewayApi;