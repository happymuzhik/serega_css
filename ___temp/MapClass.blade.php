<script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
<script src="/js/heatmap.min.js" type="text/javascript"></script>
<script type="text/javascript">
document.getElementById("map").style.minHeight = (window.innerHeight - document.getElementById('header').offsetHeight)+'px';

ymaps.ready(init);
var VMap;

function init(){     
	VMap = new ymaps.Map("map", { center: [59.91, 30.34], zoom: 10 });
	VMap.controls.remove('trafficControl');
	VMap.controls.remove('typeSelector');
	VMap.controls.remove('fullscreenControl');
	app.map = VMap;
}

var app = {

	map: null,
	page: 'map'

}

mapObjects = function(data, map, options, callback){

	this.cluster = false;
	this.heatmap = false;
	this.markersArr = [];
	this.map = map;
	this.data = data;
	this.color = options.color;
	this.cl_color = options.cl_color;
	this.map_type = options.map_type;

	if (!this.data){ return; }

	mapObjects.prototype.render_description = function(desc_options) {

		var v_history_number = desc_options.history_number||' - ', v_sex = '', v_b_date = '', v_epidochag = '', v_drug_addiction = '', v_homeless = '', v_oblast = '', v_migrant = '', v_result_code = '',
			v_virus_list = desc_options.virus_list||' - ',
			v_bacterium_list = desc_options.bacterium_list||' - ';

		if ( desc_options.sex == '1' ){ v_sex = 'мужской'; }else{ v_sex = 'женский'; }

		if ( desc_options.b_date.toString().trim().length == 0 ){
			v_b_date = ' - ';
		}else{
			v_b_date = desc_options.b_date+' ('+moment().diff(moment(desc_options.b_date,'YYYY'), 'years')+')';
        }

        if ( desc_options.epidochag.trim().length == 0 || desc_options.epidochag == '0' ){
			v_epidochag = 'нет';
		}else{
			v_epidochag = 'да';
        }

        if ( desc_options.drug_addiction.toString().trim().length == 0 || desc_options.drug_addiction == '0' ){
			v_drug_addiction = 'нет';
		}else{
			v_drug_addiction = 'да';
        }

        if ( desc_options.homeless.toString().trim().length == 0 || desc_options.homeless == '0' ){
			v_homeless = 'нет';
		}else{
			v_homeless = 'да';
        }

        if ( desc_options.oblast.toString().trim().length == 0 || desc_options.oblast == '0' ){
			v_oblast = 'нет';
		}else{
			v_oblast = 'да';
        }

        if ( desc_options.migrant.toString().trim().length == 0 || desc_options.migrant == '0' ){
			v_migrant = 'нет';
		}else{
			v_migrant = 'да';
        }

        switch(desc_options.result_code){
        	case 'Y':
        		v_result_code = 'У';
        		break
        	case 'P':
        		v_result_code = 'П';
        		break
        	default:
        		v_result_code = 'В';
        		break
        };

		var description = {
			node: 'div',
			content: [
				{
					node: 'b',
					content: '№ ИБ: '
				},
				{
					node: 'span',
					content: v_history_number
				},
				{
					node: 'br'
				},
				{
					node: 'b',
					content: 'Пол: '
				},
				{
					node: 'span',
					content: v_sex
				},
				{
					node: 'br'
				},
				{
					node: 'b',
					content: 'Год рождения: '
				},
				{
					node: 'span',
					content: v_b_date
				},
				{
					node: 'br'
				},
				{
					node: 'b',
					content: 'Вирус: '
				},
				{
					node: 'span',
					content: v_virus_list
				},
				{
					node: 'br'
				},
				{
					node: 'b',
					content: 'Бактерия: '
				},
				{
					node: 'span',
					content: v_bacterium_list
				},
				{
					node: 'br'
				},
				{
					node: 'b',
					content: 'Эпидочаг: '
				},
				{
					node: 'span',
					content: v_epidochag
				},
				{
					node: 'br'
				},				
				{
					node: 'b',
					content: 'Наркозависимость: '
				},
				{
					node: 'span',
					content: v_drug_addiction
				},
				{
					node: 'br'
				},				
				{
					node: 'b',
					content: 'БОМЖ: '
				},
				{
					node: 'span',
					content: v_homeless
				},
				{
					node: 'br'
				},				
				{
					node: 'b',
					content: 'Область: '
				},
				{
					node: 'span',
					content: v_oblast
				},
				{
					node: 'br'
				},				
				{
					node: 'b',
					content: 'Мигрант: '
				},
				{
					node: 'span',
					content: v_migrant
				},
				{
					node: 'br'
				},
				{
					node: 'b',
					content: 'Исход: '
				},
				{
					node: 'span',
					content: v_result_code
				},
				{
					node: 'br'
				}
			]
		};

		return randr(description, true);

	};
			
	mapObjects.prototype.create_markers = function(p_data) {
		var MO = this;
		if (p_data){			
			MO.data = p_data;
		}
		MO.markersArr = [];
		for ( var i = 0; i < MO.data.length; i++ ){

			// ПРОВЕРКА НА ВХОЖДЕНИЕ В ПОЛИГОН //
			var in_polygon = false, active_polygons = 0;
			for (var j = 0; j < polygonClass.polygonDistrictsFeed.length; j++) {
				if (polygonClass.polygonDistrictsFeed[j].active){
					active_polygons++;
				}
			};
			if (active_polygons>0){
				for (var j = 0; j < polygonClass.polygonDistrictsFeed.length; j++) {
					if(polygonClass.polygonDistrictsFeed[j].active){
						if (Array.isArray(polygonClass.polygonDistrictsFeed[j].polygonPoints)){
							for (var l = 0; l < polygonClass.polygonDistrictsFeed[j].polygonPoints.length; l++) {							
								in_polygon = polygonClass.polygonDistrictsFeed[j].polygonPoints[l].contains([MO.data[i].longitude,MO.data[i].latitude]);
							};
							if (in_polygon){
								break // Прошли проверку и дальше можем не проверять
							}
						}else{
							in_polygon = polygonClass.polygonDistrictsFeed[j].polygonPoints.contains([MO.data[i].longitude,MO.data[i].latitude]);
						}						
						if (in_polygon){
							break // Прошли проверку и дальше можем не проверять
						}
					}
				};
			}			
			if (!in_polygon&&active_polygons>0){
				//Если не попал ни в один полигон и они вообще включены, то не рисуем точку
				continue
			}
			// ПРОВЕРКА НА ВХОЖДЕНИЕ В ПОЛИГОН //

			var description = MO.render_description({
				history_number: MO.data[i].history_number,
				sex: MO.data[i].sex,
				b_date: MO.data[i].b_date,
				epidochag: MO.data[i].epidochag,
				drug_addiction: MO.data[i].drug_addiction,
				homeless: MO.data[i].homeless,
				oblast: MO.data[i].oblast,
				migrant: MO.data[i].migrant,
				result_code: MO.data[i].result_code,
				virus_list: MO.data[i].virus_list,
				bacterium_list: MO.data[i].bacterium_list
			});
			var placemark = new ymaps.Placemark([MO.data[i].longitude,MO.data[i].latitude], 
                                                         { balloonContent: description, clusterCaption: MO.data[i].history_number },
                                                         { preset: 'islands#'+MO.color });
			MO.markersArr.push(placemark);
		}

	};

	mapObjects.prototype.create_cluster = function() {
		var MO = this;
		MO.map.geoObjects.remove(MO.cluster);		
		MO.cluster = new ymaps.Clusterer({ preset: 'islands#'+MO.cl_color });
		MO.cluster.add(MO.markersArr);
       	MO.map.geoObjects.add(MO.cluster);        
	};

	mapObjects.prototype.destroy = function() {
		var MO = this;
		if (MO.heatmap){
			MO.heatmap.destroy();
		}
		if (MO.cluster){
			MO.cluster.remove(MO.markersArr);
			MO.map.geoObjects.remove(MO.cluster);
		}		
		MO.markersArr = [];
	};

	mapObjects.prototype.drawHeatmap = function() {		
		if (MO.heatmap){
			MO.heatmap.destroy();
		}
		ymaps.modules.require(['Heatmap'], function (Heatmap) {
			MO.heatmap = new Heatmap(MO.markersArr);
			MO.heatmap.setMap(MO.map);
		});
	}

	mapObjects.prototype.init = function(p_data, p_color_opts, p_callback) {		
		MO = this;		
		if ( p_color_opts && p_color_opts.color ) { MO.color = p_color_opts.color; }
		if ( p_color_opts && p_color_opts.cl_color ) { MO.cl_color = p_color_opts.cl_color; }
		if ( p_color_opts && p_color_opts.map_type ) { MO.map_type = p_color_opts.map_type; }
		MO.create_markers(p_data);
		if ( MO.map_type == 'heatmap' ){
			MO.drawHeatmap();
		}else{
			MO.create_cluster();
		}		

		if ( p_callback && typeof p_callback === 'function' ){
			p_callback();
		}
	};	

	this.init(null, null, callback);

}

</script>
