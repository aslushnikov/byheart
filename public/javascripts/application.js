// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function log(s) {
    $('#log').append(s + '\n');
}

function edit_word_in_table(id) {
    $('.word' + id + ' .tdshow').css('display', 'none');
    $('.word' + id + ' .tdedit').css('display', 'inline');
}

function confirm_edit_word_in_table(event) {
    event = event || window.event;
    if (event.keyCode != 13) return;
    for (var wordn = 0; wordn < words.length; wordn++) {
        var changed = false;
        var id = words[wordn].word.id;
        var arr1 = $('.word' + id + ' .tdshow');
        var arr2 = $('.word' + id + ' .tdedit input');
        for (var i = 0; i < arr1.length; i++) {
            if ($(arr1[i]).html() != arr2[i].value) {
                $(arr1[i]).html(arr2[i].value);
                changed = true;
            }
        }
        $('.tdshow').css('display', 'inline');
        $('.tdedit').css('display', 'none');
        if (changed) {
            words[wordn].word.id = $('.word' + id + ' .id').html();
            words[wordn].word.orig = $('.word' + id + ' .orig').html();
            words[wordn].word.trans = $('.word' + id + ' .trans').html();
            words[wordn].word.sample = $('.word' + id + ' .sample').html();
            var ws = '{id:"' + id + '", orig:"' + words[wordn].word.orig + '", trans:"' + words[wordn].word.trans + '", sample:"' + words[wordn].word.sample + '"}';
            $.ajax({
                type: 'POST',
                url: '/api/edit/' + id,
                data: ws
            });
        }
    }
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
    var fields = [word.id, word.orig, word.trans, word.sample];
    var fieldnames = ['id', 'orig', 'trans', 'sample'];
    for (var i = 0; i < fields.length; i++) {
        s += '<td';
        if (i == fields.length - 1) s += ' class="prelastcol"';
        s += '><span class="tdshow wrd ' + fieldnames[i];
        s += '">' + fields[i] + '</span>';
        s += '<span class="tdedit wrd" style="display: none;">';
        s += '<input onkeypress="confirm_edit_word_in_table(event)" type="text" value="' + fields[i] + '">';
        s += '</span></td>';
    }
    s += '<td class="lastcol"><span class="ctrl' + word.id + '" style="visibility: hidden;">';
    s += '<span onclick="edit_word_in_table(' + word.id + ')"><img src="/images/edit_word.png"></span>';
    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    s += '<span onclick="delete_word_from_table(' + word.id + ')"><img src="/images/delete.png"></span>';
    s += '</td>';
    var row = $('<tr></tr>');
    row.html(s);
    row.addClass('word' + word.id);
    row.mouseover(function() {
        var arr = $('.word' + word.id + ' td');
        for (var i = 0; i < arr.length; i++) arr[i].style.backgroundColor = '#cfc';
        arr = $('.word' + word.id + ' td span.wrd');
        for (var i = 0; i < arr.length; i++) arr[i].style.backgroundColor = '#cfc';
        arr = $('.ctrl' + word.id);
        arr[0].style.visibility = 'visible';
    });
    row.mouseout(function() {
        var arr = $('.word' + word.id + ' td')
        for (var i = 0; i < arr.length; i++) arr[i].style.backgroundColor = '#fff';
        arr = $('.word' + word.id + ' td span.wrd');
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
            words.push(eval(data));
        }
    });
    $('#wa_orig').focus();
}

