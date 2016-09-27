;(function(w,document,undefined){
var res = '';
w.css_randr = function(json,format,node){
	for (k in json) {
		res += k + '{'
		for (l in json[k]){
			if (!format){
				res += l+':'+json[k][l]+';';
			}
		};
		res += '}';
	};
	return res;
};
})(window, document);