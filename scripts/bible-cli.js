#!/usr/bin/env node

// Load environment vairables
require('dotenv').config();

const BibleGatewayApi = require('../apis/BibleGatewayApi');

// Load program object for CLI
const { program } = require('commander');


/**
 * Initialise CLI
 */
async function main(queryArray) {
    // Load options
    const options = program.opts();
    // Parse query
    const query = queryArray.join(' ');

    // Initialise new app
    const app = new BibleGatewayApi();

    /**
     * Read-eval-print-loop when no args
     */
    if (queryArray.length < 1) {
        return app.createGetPassageRepl(options);
    }
    
    if (program.opts().reverse) {
        const text = await app.getPassageReverse(query, options);
        return process.stdout.write(text);
    }

    // Retrieve passage text from query
    const text = await app.getPassage(query, options);

    process.stdout.write(text);
}

/**
 * Define program
 */
program
    // Define options
    .option('-c, --copy', 'Copy passage to clipboard')
    // Define reverse search
    .option('-r, --reverse', 'Reverse search (search for verses that contain the query)')
    // Define version option
    .option('-t, --translation <translation>', 'Set translation')
    // Define query argument
    .argument('[query...]', 'Passage query')
    // Route actions to main
    .action(main);

    program.parse(process.argv);
