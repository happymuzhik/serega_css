var vLoader = {

	show: function (el,id,msg) {

		el = document.getElementById(el)||el;

		var loader = document.createElement('div');
			loader.setAttribute('id', id);
			loader.classList.add('sq-loader');			
			loader.style.top = el.offsetTop+'px';
			loader.style.width = el.offsetWidth+'px';
			loader.style.height = el.offsetHeight+'px';

		var icon = document.createElement('div');
			icon.classList.add('loading');
			for ( var i = 0; i < 4; i++ ){
				var icon_ch = document.createElement('div');
					icon_ch.classList.add('loading-bar');
					icon.appendChild(icon_ch);
			}
			icon.style.marginTop = (el.offsetHeight/2 - 20)+'px';
			icon.style.marginLeft = (el.offsetWidth/2 - 15)+'px';

		var txt_div = document.createElement('div');
			txt_div.classList.add('sq-loader-txt');			

		var txt = document.createElement('span');
			txt.innerHTML = msg||'Загрузка';
			txt_div.appendChild(txt);
			loader.appendChild(icon);
			loader.appendChild(txt_div);

		el.appendChild(loader);

		return loader;

	},
	hide: function (el){

		var el = document.getElementById(el)||el,
			loader = el.querySelectorAll('.sq-loader')[0];
		if (!el){ return; }
		jQuery(loader).animate({'opacity':0}, 300, function(){
			loader.remove();
		});

		return el;

	}

}