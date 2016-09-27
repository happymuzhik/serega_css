function Table(vals, table_id, parent){

	if (!(this instanceof Table)) {
        return new Table();
    }

    T = this;
	this.headers_arr = {};
	this.table = false;
	this.inited = false;
	this.table_id = table_id;
	this.sort_col = '';
	this.sorter = false;
	this.summ_arr = {};
	this.parent = parent||document.getElementById(parent);

	Table.prototype.drawTable = function(vals){
		var T = this;
		if (!T.table){
			T.table = document.createElement('table');
			T.table.setAttribute('id', T.table_id);
			T.table.setAttribute('class', 'stats-table');
		}
		T.table.innerHTML = '';
		var tbody = document.createElement('tbody');
			tbody.appendChild(T.drawTr(vals[0], true));
		for ( var i = 0; i < vals.length; i++ ){
			tbody.appendChild(T.drawTr(vals[i]));
		}		
		T.table.appendChild(tbody);
		if (!T.inited) { T.parent.appendChild(T.table); T.inited = true; }
	}

	Table.prototype.drawTr = function(raw, th, cl){
		var T = this;
		var tr = document.createElement('tr');
			tr.classList.add('stat-raw');
			if ( cl ){ tr.classList.add(cl); }
		if ( th ){
			for ( k in raw ){			
				tr.appendChild(T.drawTh(k));
			}
			return tr;	
		}		
		for ( k in raw ){			
			tr.appendChild(T.drawTd(raw[k], k));
		}
		return tr;
	}

	Table.prototype.drawTd = function(cell, type){
		var T = this,
			td = document.createElement('td');
			td.setAttribute('class', 'stat-cell');
			td.setAttribute('type', type);
			td.innerHTML = (type.indexOf('_TIME')>-1)?StatsTable.secToTime(cell):cell;
		return td;
 	}

 	Table.prototype.drawTh = function(type){
 		var T = this,
 			th = document.createElement('th');
			th.setAttribute('class', 'stat-cell stat-header');
			th.setAttribute('type', type);
			th.innerHTML = T.headers_arr[type]||type;
			th.addEventListener('click', function(){
				T.sort(type);
			});
		return th;	
 	}

 	Table.prototype.sort = function(type){ 		 		

 		var T = this, vals = [], raws = document.querySelectorAll('#'+T.table_id+' .stat-raw'), cells = [], cnt=0;
 		
 		if ( T.sort_col == type ) { T.sorter = !T.sorter; }
 		
 		for (var i = 1; i < raws.length; i++){
 			cells = raws[i].querySelectorAll('.stat-cell');
 			vals.push({});
 			for (var j = 0; j < cells.length; j++){
 				vals[cnt][cells[j].getAttribute('type')] = cells[j].innerHTML;
 			}
 			cnt++;
 		}

 		for (var i = 0; i < vals.length; i++) {
 			var arr1 = vals[i]['WORK_TIME'].split(':');
 			vals[i]['WORK_TIME'] = parseInt((parseInt(arr1[0])*3600)+(parseInt(arr1[1])*60)+parseInt(arr1[2]));
 			var arr2 = vals[i]['CALL_TIME'].split(':');
 			vals[i]['CALL_TIME'] = parseInt((parseInt(arr2[0])*3600)+(parseInt(arr2[1])*60)+parseInt(arr2[2]));
 		};

	    for (var i = vals.length - 1; i > 0; i--) {
	        for (var j = 0; j < i; j++) {
	        	if ( type == 'fio' ) { 
	        		var val1 = vals[j][type], val2 = vals[j+1][type];
	        	}	        	
	        	else{
	        		var val1 = parseFloat(vals[j][type],10), val2 = parseFloat(vals[j+1][type],10);	 
	        	}
	            if (((T.sorter) && ( val1 > val2)) || (!(T.sorter) && (val1 < val2) )) {
	                tmp = vals[j];
	                vals[j] = vals[j+1];
	                vals[j+1] = tmp;
	            }
	        }
	    }

	    T.sort_col = type;
	    T.drawTable(vals);

 	}

 	Table.prototype.isNumeric = function(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}

	Table.prototype.addColSumm = function(h_type){

		var T = this, vals = {}, raws = document.querySelectorAll('#'+T.table_id+' .stat-raw'), cells = [],
			tbody = document.querySelectorAll('#'+T.table_id+' tbody')[0];
 		 		
 		for (var i = 1; i < raws.length; i++){
 			cells = raws[i].querySelectorAll('.stat-cell');
 			for (var j = 0; j < cells.length; j++){
 				if ( T.isNumeric(cells[j].innerHTML) ){
 					if ( !vals[cells[j].getAttribute('type')] ){ vals[cells[j].getAttribute('type')] = 0; }
 					vals[cells[j].getAttribute('type')] += parseInt(cells[j].innerHTML);	
 				}else{
 					vals[cells[j].getAttribute('type')] = '-';
 				}
 				if ( h_type && (cells[j].getAttribute('type') == h_type ) ){
 					vals[cells[j].getAttribute('type')] = 'Сумма:';	
 				}
 				
 			}
 		}

 		tbody.appendChild(T.drawTr(vals, null, 'summ-tr'));

 		return vals;

	}

 	T.drawTable(vals);

}
