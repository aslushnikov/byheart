// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function log(s) {
    $('#log').append(s + '\n');
}

function add_word_to_table(word) {
    var s = '<td>' + word.id + '</td><td>' + word.orig + '</td><td>' + word.trans + '</td><td>' + word.sample + '</td>';
    s += '<td><img src="/images/delete.png"><img src="/images/edit_word.png"></td>'
    var row = $('<tr></tr>');
    row.html(s);
    row.addClass('word' + word.id);
    row.mouseover(function() {
        var arr = $('.word' + word.id + ' td')
        for (var i = 0; i < arr.length; i++) arr[i].style.backgroundColor = '#ccffcc';
    });
    row.mouseout(function() {
        var arr = $('.word' + word.id + ' td')
        for (var i = 0; i < arr.length; i++) arr[i].style.backgroundColor = '#fff';
    });
    row.click(function() {
        log(word.id);
    });
    $('#wt table tbody').append(row);
}

function add() {
    var word = {
        orig: $('#wa_orig').prop('value'), 
        trans: $('#wa_trans').prop('value'),
        sample: $('#wa_sample').prop('value')
    };
    if (word.orig.length == 0 || word.trans.length == 0) {
        return;
    }
    $('#wa_orig').prop('value', '');
    $('#wa_trans').prop('value', '');
    $('#wa_sample').prop('value', '');
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
    $('#wa_orig').focus();
}

