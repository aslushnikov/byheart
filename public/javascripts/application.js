// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function log(s) {
    $('#log').append(s + '\n');
}

function edit_word_in_table(id) {
    log('edit ' + id);
}

function delete_word_from_table(id) {
    $('.word' + id).remove();
    $.ajax({
        type: 'POST',
        url: '/api/delete/' + id
    });
}

function add_word_to_table(word) {
    var s = '';
    var fields = [word.id, word.orig, word.trans];
    for (var i = 0; i < fields.length; i++)
        s += '<td><span class="tdshow">' + fields[i] + '</span><span class="tdedit"></span></td>';
    s += '<td class="prelastcol">' + word.sample + '</td>';
    s += '<td class="lastcol"><span class="ctrl' + word.id + '" style="visibility: hidden;">';
    s += '<span onclick="edit_word_in_table(' + word.id + ')"><img src="/images/edit_word.png"></span>';
    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    s += '<span onclick="delete_word_from_table(' + word.id + ')"><img src="/images/delete.png"></span>';
    s += '</td>';
    var row = $('<tr></tr>');
    row.html(s);
    row.addClass('word' + word.id);
    row.mouseover(function() {
        var arr = $('.word' + word.id + ' td')
        for (var i = 0; i < arr.length; i++) arr[i].style.backgroundColor = '#ccffcc';
        arr = $('.ctrl' + word.id);
        arr[0].style.visibility = 'visible';
    });
    row.mouseout(function() {
        var arr = $('.word' + word.id + ' td')
        for (var i = 0; i < arr.length; i++) arr[i].style.backgroundColor = '#fff';
        arr = $('.ctrl' + word.id);
        arr[0].style.visibility = 'hidden';
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
        url: '/api/add_words',
        data: ws,
        success: function(data) {
            add_word_to_table(data[0].word);
        }
    });
    $('#wa_orig').focus();
}

