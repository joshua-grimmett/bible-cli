#!/usr/bin/env node

// Load environment vairables
require('dotenv').config();

const NTEApi = require('../apis/NTEApi');

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
    const app = new NTEApi();

    /**
     * Read-eval-print-loop when no args
     */
    if (queryArray.length < 1) {
        app.createGetPassageRepl(options);
    }
    /**
     * Print query
     */
    else {
        // Retrieve passage text from query
        const text = await app.getPassage(query, options);

        process.stdout.write(text);
    }
}

/**
 * Define program
 */
program
    // Define options
    .option('-c, --copy', 'Copy passage to clipboard')
    // Define query argument
    .argument('[query...]', 'Passage query')
    // Route actions to main
    .action(main);

    program.parse(process.argv);
