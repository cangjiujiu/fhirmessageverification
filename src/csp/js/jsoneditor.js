var json = {
   
};

function printJSON() {
    $('#json').val(JSON.stringify(json));
    //console.log("___"+data)
}

function updateJSON(data) {
	
    json = data;
    printJSON();
}

function showPath(path) {
	console.log(json)
    $('#path').text(path);
}

$(document).ready(function() {

    /*$('#rest > button').click(function() {
        var url = $('#rest-url').val();
        $.ajax({
            url: url,
            dataType: 'jsonp',
            jsonp: $('#rest-callback').val(),
            success: function(data) {
	            console.log(url)
                json = data;
                $('#editor').jsonEditor(json, { change: updateJSON, propertyclick: showPath });
                printJSON();
            },
            error: function() {
                alert('Something went wrong, double-check the URL and callback parameter.');
            }
        });
    });*/

    $('#json').change(function() {
        var val = $('#json').val();

        if (val) {
            try { json = JSON.parse(val); }
            catch (e) { alert('Error in parsing json. ' + e); }
        } else {
            json = {};
        }
        
        $('#editor').jsonEditor(json, { change: updateJSON, propertyclick: showPath });
    });

    $('#expander').click(function() {
        var editor = $('#editor');
        editor.toggleClass('expanded');
        $(this).text(editor.hasClass('expanded') ? 'Collapse' : 'Expand all');
    });
    
    printJSON();
    console.log(json)
    $('#editor').jsonEditor(json, { change: updateJSON, propertyclick: showPath });
});


