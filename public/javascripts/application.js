// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function log(s) {
    $('#log').append(s + '\n');
}

function update_table_view() {
    var arr = $('#wt table tbody > tr');
    var n = arr.length;
    var last = false;
    for (var i = n - 1; i >= 0; i--) {
        if ($(arr[i]).css('display') == 'none') continue;
        if (!last) {
            $(arr[i]).css('border-bottom', '1px solid black');
            $(arr[i]).children('.lastcol').css('border-bottom', '1px solid white');
            last = true;
        } else {
            $(arr[i]).css('border-bottom', 'none');
            // $(arr[i]).children('.lastcol').css('border-bottom', '1px solid white');
        }
    }
}

function edit_word_in_table(id) {
    confirm_edit_word_in_table();
    $('.word' + id + ' .tdshow').css('display', 'none');
    $('.word' + id + ' .tdedit').css('display', 'inline');
    update_table_view();
    $($('.word' + id + ' .tdedit.orig input')[0]).focus();
}

function on_input_key_enter(event) {
    event = event || window.event;
    if (event.keyCode != 13) return;
    confirm_edit_word_in_table();
}

function on_input_blur() {
    // confirm_edit_word_in_table();
}

function on_add_word_click(event) {
    event = event || window.event;
    if (event.keyCode != 13) return;
    add();
}

function confirm_edit_word_in_table() {
    for (var wordn = 0; wordn < words.length; wordn++) {
        var changed = false;
        var id = words[wordn].word.id;
        var arr1 = $('.word' + id + ' .tdshow');
        var arr2 = $('.word' + id + ' .tdedit input');
        for (var i = 0; i < arr1.length && i < arr2.length; i++) {
            if ($(arr1[i]).html() != arr2[i].value) {
                $(arr1[i]).html(arr2[i].value);
                changed = true;
            }
        }
        $('.tdshow').css('display', 'inline');
        $('.tdedit').css('display', 'none');
        if (changed) {
            words[wordn].word.id = $('.word' + id + ' .tdshow.id').html();
            words[wordn].word.orig = $('.word' + id + ' .tdshow.orig').html();
            words[wordn].word.trans = $('.word' + id + ' .tdshow.trans').html();
            words[wordn].word.sample = $('.word' + id + ' .tdshow.sample').html();
            var ws = '{id:"' + id + '", orig:"' + words[wordn].word.orig + '", trans:"' + words[wordn].word.trans + '", sample:"' + words[wordn].word.sample + '"}';
            $.ajax({
                type: 'POST',
                url: '/api/edit/' + id,
                data: ws
            });
            update_table_view();
        }
    }
}


function delete_word_from_table(id) {
    $('.word' + id).remove();
    update_table_view();
    $.ajax({
        type: 'POST',
        url: '/api/delete/' + id
    });
}

function calc_color(percentage) {
    return "000000";
}

function stat_count(succ, show) {
    if (show == 0) {
        return '';
    } else {
        // return '<span style="color: #' + calc_color(p) + '">' + word.orig_succ + ' / ' + word.orig_show + '</span>';
        return succ + ' / ' + show;
    }
}

function add_word_to_table(word) {
    var s = '';
    var p1 = stat_count(word.orig_succ, word.orig_show);
    var p2 = stat_count(word.trans_succ, word.trans_show);
     
    var fields = [word.id, word.orig, word.trans, word.sample, p1, p2];
    var fieldnames = ['id', 'orig', 'trans', 'sample', 'origStats', 'transStats'];
    for (var i = 0; i < fields.length; i++) {
        s += '<td';
        if (i == fields.length - 1) s += ' class="prelastcol"';
        s += '><span class="tdshow wrd ' + fieldnames[i];
        s += '">' + fields[i] + '</span>';
        s += '<span class="tdedit wrd ' + fieldnames[i] + '" style="display: none;">';
        if (i <= 3) {
            s += '<input onkeypress="on_input_key_enter(event)" class="editwordinput" type="text" value="' + fields[i] + '">';
        } else {
            s += fields[i];
        }
        s += '</span></td>';
    }
    s += '<td class="lastcol"><span class="ctrl' + word.id + '" style="visibility: hidden;">';
    s += '<span onclick="delete_word_from_table(' + word.id + ')"><img src="/images/delete.png"></span>';
    s += '</td>';
    var row = $('<tr></tr>');
    row.html(s);
    row.addClass('word' + word.id);
    row.mouseover(function() {
        var arr = $('.word' + word.id + ' td');
        for (var i = 0; i < arr.length; i++) arr[i].style.backgroundColor = '#eee';
        arr = $('.word' + word.id + ' td span.wrd');
        for (var i = 0; i < arr.length; i++) arr[i].style.backgroundColor = '#eee';
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
    row.click(function() {
        edit_word_in_table(word.id);
    });
    $('#wt table tbody').append(row);
    update_table_view();
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

