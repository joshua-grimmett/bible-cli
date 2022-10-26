
const Api = require('./Api');
const { highlightText, stylePassage } = require('../util');

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
        let output = stylePassage(passages.trim());
        let clipOutput = passages.trim();

        // If no passage provided, return 404 error message
        if (!output) return endpoint.messages[404];

        // If passage query included add to output
        if (endpoint.params['include-passage-query']) {
            output += `\n${queryText}`;
            clipOutput += `\n${queryText}`;
        }

        // If translation text included add to output
        if (endpoint.params['include-translation']) {
            output += ` (${translationText})`;
            clipOutput += ` (${translationText})`;
        }

        /**
         * Save to clipboard if option selected
         */
         if (options.copy) {
            // Copy to clipboard
            clipboard.writeSync(clipOutput);
        }

        return highlightText(output, q);
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


    /**
     * Fetch passage by keywords
     * @param {*} q Keywords
     * @param {Object} options Query options
     * @returns {String} BibleGateway Bible Passage
     */
     async getPassageReverse(q, options) {
        // getPassageReverse configuration
        const { getPassageReverse: endpoint } = this.methods;
        
        // If translation provided from options, set in endpoint params
        const { translation } = options;
        
        if (translation) {
            endpoint.params.version = translation
        }

        const data = await this.endpointGetRequest(q, endpoint);
        // Extract passage data
        let passages = this.scrapePassagesReverse(data, endpoint);

        let output = passages
            .map(passage => {
                return `${chalk.italic(passage.passage)} (${passage.translation})\n${passage.text}\n`;
            }).join('\n')

        // If no passage provided, return 404 error message
        if (!passages || passages.length < 1) return endpoint.messages[404];

        /**
         * Save to clipboard if option selected
         */
         if (options.copy) {
            // Copy to clipboard
            clipboard.writeSync(output);
        }

        return highlightText(output, q, chalk.bold.blue);
    }

    /**
     * 
     * @param {String} html HTML data
     * @param {Object} endpoint Endpoint configuration
     * @returns 
     */
    scrapePassagesReverse(html, { scrapeData }) {
        // Parse html with Cheerio
        const $ = cheerio.load(html);
        
        const passages = [];

        $(scrapeData.parentNode)
            .first()
            .children()
            .map((_i, child) => {
                const el = $(child);
                const className = el.attr('class');
                
                // Filter to passage data
                const filter = ['search-suggested-result', 'search-result-list'];
                if (filter.indexOf(className) === -1) return;
                
                // Remove unwanted elements
                $('.bible-item-extras').remove();

                /**
                 * Handle suggested results
                 */
                if (className === filter[0]) {
                    el.children().eq(1).children().map((_i, article) => {
                        article = $(article);
                        const li = article.children().first();
                        // In case no li is used for suggested results 
                        // (when user only gives one translation this happens)
                        if (li[0].name !== 'li') {
                            passages.push({
                                passage: article.children().first().text().trim(),
                                translation: $('.version-display').text().trim().replace(/\s{2,}/g, ' '),
                                text: article.children().eq(2).text().trim(),
                                html: article.children().eq(2).html()
                            });
                        } else {
                            passages.push({
                                passage: li.children().eq(1).text().trim(),
                                translation: li.children().eq(0).html(),
                                text: li.children().eq(3).text().trim(),
                                html: li.children().eq(3).html()
                            });
                        }
                    })
                }
                /**
                 * Handle regular results
                 */
                else if (className === filter[1]) {
                    const isSingleTranslation = el.children().first().children().first().attr('start');

                    if (isSingleTranslation) {
                        el.children().first().children().first().children().map((_i, li) => {
                            li = $(li);
                            passages.push({
                                passage: li.children().eq(0).text().trim(),
                                translation: $('.version-display').text().trim().replace(/\s{2,}/g,' '),
                                text: li.children().eq(1).text().trim(),
                                html: li.children().eq(1).html()
                            });
                        });
                    }

                    else { 
                        el.children().map((_i, article) => {
                            article = $(article);
                            const text = article.children().eq(1)
                                .children().first()
                                .children().first();
                            
                            const translation = text.children().first().text().trim();
                            // Cut translation from text
                            text.children().first().remove();

                            passages.push({
                                passage: article.children().eq(0).text(),
                                translation,
                                text: text.text().trim(),
                                html: text.html()
                            });
                        })
                    }
                }
            });

        return passages.slice(0, 5);
    }
}

// Export app
module.exports = BibleGatewayApi;
