// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function log(s) {
    $('#log').append(s + '\n');
}

function add_word_to_table(word) {
    var s = '<tr><td>' + word.id + '</td><td>' + word.orig + '</td><td>' + word.trans + '</td><td>' + word.sample + '</td></tr>';
    $('#wt').append(s);
}

function add() {
    var word = {
        orig: $('#wa_orig').prop('value'), 
        trans: $('#wa_trans').prop('value'),
        sample: $('#wa_sample').prop('value')
    };
    // TODO: double quotes
    var ws = '[{orig:"' + word.orig + '", trans:"' + word.trans + '", sample:"' + word.sample + '"}]';
    $.ajax({
        type: 'POST',
        url: 'api/add_words',
        data: ws,
        success: function(data) {
            add_word_to_table(data[0].word);
        }
    });
}

