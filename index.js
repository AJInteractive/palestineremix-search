var Sync = require('sync');
var lunr = require('lunr');
var env = require('jsdom').env;
var fs = require('fs');
var jf = require('jsonfile');
var util = require('util');

var lang = 'E';

var index = lunr(function () {
    this.field('T')
    this.ref('I')
});

var data = [];

function indexDocument(v, html, callback) {
	env(html, function (errors, window) {
		if (errors) console.log(errors);
		var $ = require('jquery')(window);
		
		var para = $('p');
		
		for (var k = 0; k < para.length; k++) {
			var $p = $(para[k]);
			
			var text = $p.text().trim();
			data[v].push(text);

			if (text == '') continue;
			
			var time = $($p.find('a').first()).data('m');
			var id = v + '-' + k + '-' + time;
		
			fs.writeFileSync('text/' + lang + '/' + v + '-' + k + '.txt', text);
		
			index.add({
				T: text,
				I: id
			});
		}
		
		callback(null);		
	});
}

Sync(function(){
	
	for (var v = 0; v < 21; v++) {
		data.push([]);
		var file = '../' + v + '/' + lang + '/transcript.html';
		if (!fs.existsSync(file)) continue;
		
		var html = fs.readFileSync(file).toString();
		fs.writeFileSync('html/' + lang + '/' + v + '.html', html);
		
		indexDocument.sync(null, v, html);

	}

	console.log(data.length);
	
	jf.writeFileSync('data/' + lang + '/data.json', data);
	jf.writeFileSync('data/'　+　lang　+　'/index.json', index.toJSON());
	
}); //sync
