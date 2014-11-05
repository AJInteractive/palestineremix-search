/*!
 * Lunr languages, `Arabic` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

/**
 * export the module via AMD, CommonJS or as a browser global
 * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
 */
;
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory)
  } else if (typeof exports === 'object') {
    /**
     * Node. Does not work with strict CommonJS, but
     * only CommonJS-like environments that support module.exports,
     * like Node.
     */
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    factory()(root.lunr);
  }
}(this, function() {
  /**
   * Just return a value to define the module export.
   * This example returns an object, but the module
   * can return a function as the exported value.
   */
  return function(lunr) {
    /* throw error if lunr is not yet included */
    if ('undefined' === typeof lunr) {
      throw new Error('Lunr is not present. Please include / require Lunr before this script.');
    }

    /* throw error if lunr stemmer support is not yet included */
    if ('undefined' === typeof lunr.stemmerSupport) {
      throw new Error('Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.');
    }

    /* register specific locale function */
    lunr.ar = function() {
      this.pipeline.reset();
      this.pipeline.add(
        lunr.ar.stopWordFilter,
        lunr.ar.stemmer
      );
    };

    /* lunr stemmer function */
    lunr.ar.stemmer = (function() {
      /* and return a function that stems a word for the current locale */
	  // from https://github.com/ejtaal/jsastem
      return function (input) {
		
		//FIXME
		if (typeof XRegExp == 'undefined' && require) XRegExp = require('xregexp').XRegExp;
		
		var showdebug = 0;
		var stem = input;
		var candidate_roots = [];
		// Stemming step 1. Strip diacritics
		var stem = XRegExp.replace( stem, XRegExp('\\p{M}', 'g'), '');
		if ( showdebug == 1) debug( 'step 1. : ' + input + ' -> ' + stem);
		// Stemming step 2. remove length three and length two prefixes/suffixes in this order
		if (stem.length >= 6) { stem = stem.replace( /^(كال|بال|ولل|وال)(.*)$/i, "$2"); }
		if (stem.length >= 5) { stem = stem.replace( /^(ال|لل)(.*)$/i, "$2"); }
		if ( showdebug == 1) debug( 'step 2. : ' + stem);
		// Stemming step 3. remove length three and length two suffixes in this order
		if (stem.length >= 6) { stem = stem.replace( /^(.*)(تما|هما|تان|تين|كما)$/i, "$1"); }
		if (stem.length >= 5) { stem = stem.replace( /^(.*)(ون|ات|ان|ين|تن|كم|هن|نا|يا|ها|تم|كن|ني|وا|ما|هم)$/i, "$1"); }
		if ( showdebug == 1) debug( 'step 3. : ' + stem);
		// Stemming step 4. remove initial waw if found
		if (stem.length >= 4) { stem = stem.replace( /^وو/i, 'و'); }
		if ( showdebug == 1) debug( 'step 4. : ' + stem);
		// Stemming step 5. normalize initial hamza to bare alif
		if (stem.length >= 4) { stem = stem.replace( /^[آأإ]/i, 'ا'); }
		if ( showdebug == 1) debug( 'step 5. : ' + stem);
		if (stem.length <= 3) {
			return stem;
		}

		// Stemming step 6. process length four patterns and extract length three roots
		if (stem.length == 6) { 
			stem = stem.replace( /^[ام]ست(...)$/i, "$1");         // مستفعل - استفعل
			stem = stem.replace( /^[ام]ست(...)$/i, "$1");         // مستفعل - استفعل
			stem = stem.replace( /^[تم](.)ا(.)ي(.)$/i, "$1$2$3"); // تفاعيل - مفاعيل
			stem = stem.replace( /^م(..)ا(.)ة$/i, "$1$2");      // مفعالة
			stem = stem.replace( /^ا(.)[تط](.)ا(.)$/i, "$1$2$3");    // افتعال
			stem = stem.replace( /^ا(.)(.)و\2(.)$/i, "$1$2$3"); // افعوعل
			if (stem.length == 3 ) { return stem; }
			else {


				stem = stem.replace( /[ةهيكتان]$/i, "");     // single letter suffixes
				//if (stem.length == 4 ) { TODO: initiate 4 letter word routine? }
				//if (stem.length == 5 ) { TODO: initiate 5 letter word routine? }
				stem = stem.replace( /^(..)ا(..)$/i, "$1$2");   // فعالل
				stem = stem.replace( /^ا(...)ا(.)$/i, "$1$2");  // افعلال
				stem = stem.replace( /^مت(.۔..)$/i, "$1");      // متفعلل

				stem = stem.replace( /^[لبفسويتنامك]/i, "");     // single letter prefixes، added م for مفعلل
				if (stem.length == 6 ) { 
					stem = stem.replace( /^(..)ا(.)ي(.)$/i, "$1$2$3"); // فعاليل
				
				}
				//return stem;
			}
		}
		if ( showdebug == 1) debug( 'after length 6 : ' + stem);

		if (stem.length == 5) { 
			stem = stem.replace( /^ا(.)[اتط](.)(.)$/i, "$1$2$3");  //   افتعل   -  افاعل
			stem = stem.replace( /^م(.)(.)[يوا](.)$/i, "$1$2$3"); //   مفعول  -   مفعال  -   مفعيل
			stem = stem.replace( /^[اتم](.)(.)(.)ة$/i, "$1$2$3"); //   مفعلة  -    تفعلة   -  افعلة
			stem = stem.replace( /^[يتم](.)[تط](.)(.)$/i, "$1$2$3"); //   مفتعل  -    يفتعل   -  تفتعل
			stem = stem.replace( /^[تم](.)ا(.)(.)$/i, "$1$2$3");  //   مفاعل  -  تفاعل
			stem = stem.replace( /^(.)(.)[وا](.)ة$/i, "$1$2$3");  //   فعولة  -   فعالة
			stem = stem.replace( /^[ما]ن(.)(.)(.)$/i, "$1$2$3");  //   انفعل   -   منفعل
			stem = stem.replace( /^ا(.)(.)ا(.)$/i, "$1$2$3");     //    افعال
			stem = stem.replace( /^(.)(.)(.)ان$/i, "$1$2$3");     //    فعلان
			stem = stem.replace( /^ت(.)(.)ي(.)$/i, "$1$2$3");     //    تفعيل
			stem = stem.replace( /^(.)ا(.)و(.)$/i, "$1$2$3");     //    فاعول
			stem = stem.replace( /^(.)وا(.)(.)$/i, "$1$2$3");     //    فواعل
			stem = stem.replace( /^(.)(.)ائ(.)$/i, "$1$2$3");     //    فعائل
			stem = stem.replace( /^(.)ا(.)(.)ة$/i, "$1$2$3");     //    فاعلة
			stem = stem.replace( /^(.)(.)ا(.)ي$/i, "$1$2$3");     //    فعالي
			if (stem.length == 3 ) { return stem; }
			else {
				stem = stem.replace( /^[اتم]/i, ""); //    تفعلل - افعلل - مفعلل

				stem = stem.replace( /[ةهيكتان]$/i, "");     // single letter suffixes
				//if (stem.length == 4 ) { TODO: initiate 4 letter word routine? }
				stem = stem.replace( /^(..)ا(..)$/i, "$1$2");     //    فعالل
				stem = stem.replace( /^(...)ا(.)$/i, "$1$2");     //    فعلال
				stem = stem.replace( /^[لبفسويتنامك]/i, "");     // single letter prefixes، added م for مفعلل
				//return stem;
			}
		}
		if ( showdebug == 1) debug( 'after length 5 : ' + stem);

		if (stem.length == 4) { 
			stem = stem.replace( /^م(.)(.)(.)$/i, "$1$2$3");     // مفعل
			stem = stem.replace( /^(.)ا(.)(.)$/i, "$1$2$3");     // فاعل
			stem = stem.replace( /^(.)(.)[يوا](.)$/i, "$1$2$3"); // فعال   -   فعول    - فعيل
			stem = stem.replace( /^(.)(.)(.)ة$/i, "$1$2$3");     // فعلة
			if (stem.length == 3 ) { return stem; }
			else {
				stem = stem.replace( /^(.)(.)(.)[ةهيكتان]$/i, "$1$2$3");     // single letter suffixes
				if (stem.length == 3 ) { return stem; }
				stem = stem.replace( /^[لبفسويتناك](.)(.)(.)$/i, "$1$2$3");     // single letter prefixes
				//return stem;
			}
		}
		if ( showdebug == 1) debug( 'after length 4 : ' + stem);
	/*
		TODO
		var matches = new array();
		var possible_roots = new array();
		if ( matches = stem.match( /(.)ئ(.)/)) {
			possible_roots[] = $matches[0] + 'و' + $matches[1];
			possible_roots[] = $matches[0] + 'ي' + $matches[1];
		}
	
		// Filter candidate_roots through known possible roots
	*/
		return stem
	}

    })();

    lunr.Pipeline.registerFunction(lunr.ar.stemmer, 'stemmer-ar');

    /* stop word filter function */
    lunr.ar.stopWordFilter = function(token) {
      if (lunr.ar.stopWordFilter.stopWords.indexOf(token) === -1) {
        return token;
      }
    };

    lunr.ar.stopWordFilter.stopWords = new lunr.SortedSet();
    lunr.ar.stopWordFilter.stopWords.length = 282;

    // The space at the beginning is crucial: It marks the empty string
    // as a stop word. lunr.js crashes during search when documents
    // processed by the pipeline still contain the empty string.
	// [Arabic stopwords from https://code.google.com/p/stop-words/ ]
    lunr.ar.stopWordFilter.stopWords.elements = ' فى في كل لم لن له من هو هي قوة كما لها منذ وقد ولا نفسه لقاء مقابل هناك وقال وكان نهاية وقالت وكانت للامم فيه كلم لكن وفي وقف ولم ومن وهو وهي يوم فيها منها مليار لوكالة يكون يمكن مليون حيث اكد الا اما امس السابق التى التي اكثر ايار ايضا ثلاثة الذاتي الاخيرة الثاني الثانية الذى الذي الان امام ايام خلال حوالى الذين الاول الاولى بين ذلك دون حول حين الف الى انه اول ضمن انها جميع الماضي الوقت المقبل اليوم ـ ف و و6 قد لا ما مع مساء هذا واحد واضاف واضافت فان قبل قال كان لدى نحو هذه وان واكد كانت واوضح مايو ب ا أ ، عشر عدد عدة عشرة عدم عام عاما عن عند عندما على عليه عليها زيارة سنة سنوات تم ضد بعد بعض اعادة اعلنت بسبب حتى اذا احد اثر برس باسم غدا شخصا صباح اطار اربعة اخرى بان اجل غير بشكل حاليا بن به ثم اف ان او اي بها صفر ب ا أ ، عشر عدد عدة عشرة عدم عام عاما عن عند عندما على عليه عليها زيارة سنة سنوات تم ضد بعد بعض اعادة اعلنت بسبب حتى اذا احد اثر برس باسم غدا شخصا صباح اطار اربعة اخرى بان اجل غير بشكل حاليا بن به ثم اف ان او اي بها صفر حيث اكد الا اما امس السابق التى التي اكثر ايار ايضا ثلاثة الذاتي الاخيرة الثاني الثانية الذى الذي الان امام ايام خلال حوالى الذين الاول الاولى بين ذلك دون حول حين الف الى انه اول ضمن انها جميع الماضي الوقت المقبل اليوم ـ ف و و6 قد لا ما مع مساء هذا واحد واضاف واضافت فان قبل قال كان لدى نحو هذه وان واكد كانت واوضح مايو فى في كل لم لن له من هو هي قوة كما لها منذ وقد ولا نفسه لقاء مقابل هناك وقال وكان نهاية وقالت وكانت للامم فيه كلم لكن وفي وقف ولم ومن وهو وهي يوم فيها منها مليار لوكالة يكون يمكن مليون'.split(' ');

    lunr.Pipeline.registerFunction(lunr.ar.stopWordFilter, 'stopWordFilter-ar');
  };
}))