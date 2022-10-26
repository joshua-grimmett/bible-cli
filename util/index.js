const chalk = require('chalk');

module.exports.highlightText = (target, q, colour) => {
    let neue = '';

    for (let line of target.split('\n')) {
        for (let word of line.split(' ')) {
            let filter = q.toLowerCase().split(' ');
            if (filter.indexOf(word.toLowerCase().trim()) > -1) {
                neue += colour
                    ? colour(word) + ' '
                    : chalk.blue(word) + ' ';
            } else {
                neue += word + ' ';
            }
        }
        neue += '\n';
    }
    return neue;
}

module.exports.stylePassage = (passage) => {
    return chalk.italic(passage);
}