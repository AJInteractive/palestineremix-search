var Sync = require('sync');

var lunr = require('lunr');
require('./node_modules/lunr-languages/lunr.stemmer.support.js')(lunr);
require('./node_modules/lunr-languages/lunr.tr.js')(lunr);
require('./lunr.ar.js')(lunr);

var env = require('jsdom').env;
var fs = require('fs');
var jf = require('jsonfile');
var util = require('util');


function indexLanguage(lang) {  
	
	var index = lunr(function () {
        if (lang == 'A') this.use(lunr.ar);
		if (lang == 'T') this.use(lunr.tr);
		
	    this.field('T')
	    this.ref('I')
	});

	var data = [];
	
	var indexP = function (text, id) {
		index.add({
			T: text,
			I: id
		});
	};

	function indexDocument(v, html, callback) {
		env(html, function (errors, window) {
			if (errors) console.log(errors);
			var $ = require('jquery')(window);
		
			var para = $('p');
		
			for (var k = 0; k < para.length; k++) {
				var $p = $(para[k]);
			
				var text = $p.text().replace(/\n/, ' ').replace(/\s+/g, ' ').trim();
				data[v].push(text);
                text = text.replace(/["\[\]\.,-\/#!$%\^&\*;:{}=\-_`~()]/g," ").replace('؟', ' ').replace('،', ' ').replace(/\s+/g, ' ').trim();

				if (text == '') continue;
			
				var time = $($p.find('a').first()).data('m');
				var id = v + '-' + k + '-' + time;
		
				fs.writeFileSync('text/' + lang + '/' + v + '-' + k + '.txt', text);
				indexP(text, id);
			}
		
			callback(null);		
		});
	}


	
	Sync(function(){
	
		for (var v = 0; v < 21; v++) {
			data.push([]);
			
			// var file2 = '../' + v + '/' + lang + '/t.html';
			// if (fs.existsSync(file2)) {
			// 	var html = fs.readFileSync(file2).toString();
			// 	fs.writeFileSync('../' + v + '/' + lang + '/transcript.html', html);
			// }
						
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

}

// indexLanguage('E');
indexLanguage('A');
//indexLanguage('T');
// indexLanguage('B');
