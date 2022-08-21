

/**
 * Format BibleGateway.com verses
 * @param {String} str 
 * @returns string
 */
function formatVerse(str) {
    return str.replace(/\b(\d+)\b/g, '[$1]') // Brackets around verse numbers
        // Remove cross-refferences
        .replace(/(\([A-Za-z]{1,4}\)|(\[[A-Za-z]{1,4}\]))/g, '') 
        // Remove empty spaces
        .replace(/\s{2,}/g, ' ');
}


/**
 * Utility function to set the char 
 * at index in string
 * @param {*} str Input string
 * @param {*} index Index of character to change
 * @param {*} chr Replacement character
 * @returns {String} New string
 */
function setCharAt(str, index, chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}


module.exports = {
    "apis": {
        "esv": {
            "baseURL": "https://api.esv.org/v3/",
            "methods": {
                "getPassage": {
                    "url": "/passage/text",
                    "method": "get",
                    "repl": true,
                    "queryKey": "q",
                    "params": {
                        "include-headings": true,
                        "include-footnotes": false,
                        "include-verse-numbers": true,
                        "include-short-copyright": false,
                        "include-passage-references": false,
                        "include-passage-query": true
                    },
                    "messages": {
                        "404": "Error: Passage not found"
                    },
                    "apiKey": true
                }
            }
        },
        "biblegateway": {
            "scrape": true,
            "baseURL": "https://biblegateway.com/",
            "methods": {
                "getPassage": {
                    "url": "/passage",
                    "method": "get",
                    "repl": true,
                    "queryKey": "search",
                    "params": {
                        "version": "NTE",
                        "include-passage-query": true,
                        "include-translation": true
                    },
                    "scrapeData": {
                        "parentNode": ".result-text-style-normal",
                        "queryNode": ".dropdown-display-text",
                        "translationNode": ".dropdown-display-text",
                        childrenFilters($, el) {
                            const child = $(el).first();
                            const className = child.attr('class')
                        
                            // Recurse if std-text
                            if (className === 'std-text') {
                                return child.first().children().map((_i, el) => {
                                    return this.childrenFilters($, el);
                                }).toArray().join('\n');
                            }
                            
                            if(className === 'chapter-1') 
                                return formatVerse(setCharAt(child.text(), 0, '1'))

                            // Filter full chapter link
                            if (className === 'full-chap-link') return;

                            // Filter footnotes
                            if (className && className.includes('footnotes')) return;

                            // Filter hidden elements
                            if (className && className.includes('hidden')) return;

                            if (child[0] && child[0].name && child[0].name === 'h3')
                                return '\n' + formatVerse(child.text()) + '\n';

                            return formatVerse(child.text());
                        }
                    },
                    "messages": {
                        "404": "Error: Passage not found"
                    },
                    "apiKey": false
                },
                "getPassageReverse": {
                    "url": "/quicksearch",
                    "method": "get",
                    "repl": true,
                    "queryKey": "search",
                    "params": {
                        "version": "NLT;NIV;ESV;KJV;AMP",
                        //"searchtype": "phrase"
                    },
                    "scrapeData": {
                        "parentNode": ".content-section"
                    },
                    "messages": {
                        "404": "Error: No results not found"
                    },
                    "apiKey": false
                }
            }
        }
    }
};
