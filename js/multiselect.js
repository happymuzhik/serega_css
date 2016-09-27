;(function(window, document, undefined){
window.__MultiSelect = function(p_obj, options){

	var MS = {}, values = [], obj, el = {}, objVals = [], elVals = [], objStyle, bodyOverflow = '';

	MS.popup = options && options.popup||false;
	MS.multiple = options && options.multiple||false;
	MS.attachedValueList = options && options.attachedValueList||false;
	MS.placeholder = options && options.placeholder||'';
	MS.selectObj;

	MS.optsOnclick = (options && options.optsOnclick && (typeof(options.optsOnclick) == 'function')) && options.optsOnclick||false

	MS.init = function(p_obj){

		var thisMS = this;

		obj = document.getElementById(p_obj)||p_obj;

		thisMS.selectObj = obj;

		objStyle = window.getComputedStyle(p_obj);

		el.cont = document.createElement('div');
		el.displayVal = document.createElement('div');	
		el.displayVal.setAttribute('data-text', thisMS.placeholder);
		el.displayVal.setAttribute('title', thisMS.placeholder);
		el.valueList = document.createElement('div');				

		el.displayVal.addEventListener('click', function(){			
			thisMS.toggleValueList();
		});

		el.cont.appendChild(el.displayVal);
		el.cont.appendChild(el.valueList);
		obj.parentNode.insertBefore(el.cont, obj);

		this.setStyle();
		this.renderOptions();

		return el;
	}

	MS.toggleValueList = function(){
		el.valueList.classList.toggle('active');
		if ( this.popup ){
			el.modal.classList.toggle('multi-select-hidden');
			document.body.classList.toggle('oveflow-hidden');
		}				
	}

	MS.setStyle = function(){

		var thisMS = this;

		el.cont.style.margin = objStyle.margin;
		el.cont.style.width = (objStyle.width)+'px';
		el.displayVal.style.width = (objStyle.width)+'px';		
		el.displayVal.style.minHeight = (obj.offsetHeight)+'px';
		el.displayVal.style.padding = objStyle.padding;
		el.displayVal.style.lineHeight = objStyle.lineHeight;
		el.displayVal.style.fontSize = objStyle.fontSize;
		el.displayVal.style.marginBottom = objStyle.marginBottom;
		el.displayVal.style.border = objStyle.borderBottomWidth + ' ' + objStyle.borderBottomStyle + ' ' + objStyle.borderBottomColor;

		if ( !this.popup ){
			el.valueList.style.width = (obj.offsetWidth)+'px';
		}else{
			el.cont.classList.add('popup');
			el.modal = document.createElement('div');
			el.modal.classList.add('multi-select-modal');
			el.modal.classList.add('multi-select-hidden');
			el.modal.setAttribute('title', 'Закрыть');			
			el.modal.addEventListener('click', function(){
				thisMS.toggleValueList();
			});
			el.cont.appendChild(el.modal);

			el.popupLabel = document.createElement('div');	
			el.popupLabel.innerHTML = 'Выберите значения';	
			el.popupLabel.classList.add('multi-select-popup-label');
			el.valueList.appendChild(el.popupLabel);

		}

		if ( thisMS.attachedValueList && !thisMS.popup ){
			el.valueList.classList.add('attached');
		}

		el.displayVal.classList.add('multi-select-label');
		el.valueList.classList.add('multi-select-values');
		obj.classList.add('multi-select-hidden');
		el.cont.classList.add('multi-select');

	}

	MS.renderOptions = function(){

		var thisMS = this;

		if ( thisMS.multiple ){
			el.allOpt = document.createElement('div');
			el.allOpt.innerHTML = 'Все';
			el.allOpt.setAttribute('value', 'all');
			el.allOpt.classList.add('multi-select-option');
			el.allOpt.style.padding = objStyle.padding;
			el.valueList.appendChild(el.allOpt);

			el.allOpt.addEventListener('click', function(){			
				if ( !this.classList.contains('selected') ){
					for ( var i = 0; i < elVals.length; i++ ){
						elVals[i].classList.add('selected');
					}
					this.classList.add('selected');
					el.displayVal.innerHTML = 'Выбрано - все';
				}else{
					for ( var i = 0; i < elVals.length; i++ ){
						elVals[i].classList.remove('selected');
					}
					this.classList.remove('selected');
					el.displayVal.innerHTML = '';
				}

				if (thisMS.optsOnclick){
					thisMS.optsOnclick();
				}

			});		
		}

		var objvals = obj.querySelectorAll('option');		
		for ( var i = 0; i < objvals.length; i++ ){
			var opt = document.createElement('div');
				opt.innerHTML = objvals[i].innerHTML;
				opt.style.padding = objStyle.padding;
				opt.setAttribute('value', objvals[i].getAttribute('value')||objvals[i].innerHTML);
				opt.classList.add('multi-select-option');
				opt.addEventListener('click', function(){

					if ( !thisMS.multiple ){
						for ( var i = 0; i < elVals.length; i++ ){
							elVals[i].classList.remove('selected');
						}
					}					

					var cnt = 0;
					this.classList.toggle('selected');
					for ( var i = 0; i < elVals.length; i++ ){
						if (elVals[i].classList.contains('selected')){
							cnt++;
						}
					}
					if ( thisMS.multiple ){						
						if ( cnt == 0 ){
							el.displayVal.innerHTML = '';
						}else{
							el.displayVal.innerHTML = 'Выбрано - '+cnt;
							if ( cnt == elVals.length ){								
								el.allOpt.click();								
							}
						}
					}else{
						el.displayVal.innerHTML = this.innerHTML;
						thisMS.toggleValueList();
					}

					if ( el.valueList.querySelectorAll('.selected')[0] && el.valueList.querySelectorAll('.selected')[0].getAttribute('value') == 'all' ){
						el.valueList.querySelectorAll('.selected')[0].classList.remove('selected');
					}

					if (thisMS.optsOnclick){
						thisMS.optsOnclick();
					}

				});
				el.valueList.appendChild(opt);
				elVals.push(opt);;
				objVals.push({val:objvals[i].getAttribute('value')||objvals[i].innerHTML, label: objvals[i].innerHTML});
		}

	}

	MS.value = function(){
		values = [];
		for ( var i = 0; i < elVals.length; i++ ){
			if (elVals[i].classList.contains('selected')){
				values.push(elVals[i].getAttribute('value')||elVals[i].innerHTML);
			}
		}
		return values;
	}

	MS.setValue = function(vals){
		for ( var i = 0; i < elVals.length; i++ ){
			elVals[i].classList.remove('selected');
		}
		for ( var i = 0; i < vals.length; i++ ){
			for ( var j = 0; j < elVals.length; j++ ){
				if ( elVals[j].getAttribute('value') == vals[i] ){
					elVals[j].click();
				}
			}			
		}
		return vals;
	}

	MS.nodes = el;

	MS.init(p_obj);
	return MS;

};
window._MultiSelect = {};
	_MultiSelect.selects = {};
	_MultiSelect.bind = function(name, p_obj, options){
		var m = new __MultiSelect(p_obj, options);
		_MultiSelect.selects[name] = m;
		return m;
	}
})(window, document);