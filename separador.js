	String.prototype.capitalize = function() {
   	 return this.charAt(0).toUpperCase() + this.slice(1);
	}
	var docs,doc;
	var docIndex;

	var filename;

	var arquivos,arquivo;
	var arquivoIndex;

	var svg;
	
	var gs,g;
	var gIndex;

	var paths,path;
	var pathIndex;
	var pathDs,pathD;

	var matrix;
	var matrixItem;

	var table;
	var trs,tr;
	var trIndex;
	var tdNome,tdId;

	var count;

	var matrixNome;

	var arqNomes;

	if(window.XTR_NOME_MUNICIPIOS)
		matrixNome = XTR_NOME_MUNICIPIOS;
	else
		matrixNome = {};

	arqNomes = {};
	console.log(matrixNome);
	document.addEventListener("DOMContentLoaded",function(){
		count = 0;
		document.getElementById("UP_1").addEventListener("change",function(event){
			arquivos = event.target.files;

			for(arquivoIndex = 0; arquivos.length > arquivoIndex; arquivoIndex++){
				arquivo = arquivos[arquivoIndex];				
				
				var iframe = document.createElement("iframe");
				iframe.setAttribute("src",URL.createObjectURL(arquivo));
				iframe.setAttribute("name",arquivo.name);
				arqNomes[arquivoIndex] = arquivo.name.slice(0,2);
				document.body.appendChild(iframe);

			}
			docs = document.querySelectorAll("iframe");

			for(docIndex = 0; docs.length > docIndex; docIndex++){
				doc = docs[docIndex];
				doc.setAttribute("data-index",docIndex);
				doc.addEventListener("load",function(){
					var docIndex = this.getAttribute("data-index");
					table = this.contentDocument.querySelector("tbody");
					trs = table.querySelectorAll("tr");
					for(trIndex = 0; trs.length > trIndex; trIndex++){
						tr = trs[trIndex];
						tdNome = tr.querySelector("td:first-child");
						tdId = tr.querySelector("td:nth-child(2)");	
						matrixNome["m"+tdId.innerHTML] = tdNome.innerHTML + " / "+ arqNomes[docIndex];
					}
					count ++;
					if(count >= docs.length){
						console.log(matrixNome);
						var content = "var XTR_NOME_MUNICIPIOS = "+JSON.stringify(matrixNome)+";";
						//FileHandler(content,false,false).download("XTR_NOME_MUNICIPIOS.js",function(){});
					}
				});
			};
		});
		const regioesNome = [
			"norte",
			"nordeste",
			"centro-oeste",
			"sudeste",
			"sul"
		];

		document.getElementById("UP_2").addEventListener("change",function(event){
			arquivos = event.target.files;

			for(arquivoIndex = 0; arquivos.length > arquivoIndex; arquivoIndex++){
				arquivo = arquivos[arquivoIndex];				
				
				var iframe = document.createElement("iframe");
				iframe.setAttribute("src",URL.createObjectURL(arquivo));
				iframe.setAttribute("name",arquivo.name);
				document.body.appendChild(iframe);

			}
			docs = document.querySelectorAll("iframe");

			matrix = {};
			for(docIndex = 0; docs.length > docIndex; docIndex++){
				doc = docs[docIndex];
				doc.addEventListener("load",function(){
					var filename;
					var innerMatrix;

					var indexLevelOne;
					var indexLevelTwo;
					var indexLevelThree;
					var indexLevelFour;

					var svg;

					var g1,g2,g3,g4;
					var path;

					var gBrasil
					var gRegioes,gRegiao;
					var gEstados,gEstado;
					var gMunicipios,gMunicipio;
					var pathEstados,pathEstado;
					var pathMunicipios,pathMunicipio;
					var coordenadas;

					innerMatrix = {};

					svg = this.getSVGDocument();

					g1 = svg.querySelector("g");
					if(g1.id == "BRASIL"){
						innerMatrix["BRASIL"] = {};

						gBrasil = g1;

						g2 = svg.querySelectorAll("#"+gBrasil.id+" > g");
						gRegioes = g2;
						for(indexLevelOne = 0; gRegioes.length > indexLevelOne; indexLevelOne++){
							gRegiao = gRegioes[indexLevelOne];

							innerMatrix["BRASIL"][gRegiao.id] = {};

							g3 = svg.querySelectorAll("#"+gBrasil.id+" > #"+gRegiao.id+" > g");
							if(g3.length > 0){ //BRASIL_MUNICIPIOS
								gEstados = g3;
								filename = "BRASIL_MUNICIPIOS";
								for(indexLevelTwo = 0; gEstados.length > indexLevelTwo; indexLevelTwo++){
									gEstado = gEstados[indexLevelTwo];

									innerMatrix["BRASIL"][gRegiao.id][gEstado.id] = {};

									gMunicipios = svg.querySelectorAll("#"+gBrasil.id+" > #"+gRegiao.id+" > #"+gEstado.id+" > g");

									for(indexLevelThree = 0; gMunicipios.length > indexLevelThree; indexLevelThree++){
										gMunicipio = gMunicipios[indexLevelThree];

										if(!matrixNome[gMunicipio.id]){
											var aux = gMunicipio.id.substr(1);
											aux = "m1"+aux;
											matrixNome[gMunicipio.id] = matrixNome[aux];
										}

										innerMatrix["BRASIL"][gRegiao.id][gEstado.id][gMunicipio.id] = {
											nome: matrixNome[gMunicipio.id],
											coordenadas: [],
											tag: "path",
											attr: "d"
										};

										pathMunicipios = gMunicipio.querySelectorAll("path");

										for(indexLevelFour = 0; pathMunicipios.length > indexLevelFour; indexLevelFour++){
											pathMunicipio = pathMunicipios[indexLevelFour];
											coordenadas = pathMunicipio.getAttribute("d");
											innerMatrix["BRASIL"][gRegiao.id][gEstado.id][gMunicipio.id].coordenadas.push(coordenadas)
										}

									}
								}
							}
							else{ //BRASIL_ESTADOS
								pathEstados = gRegiao.querySelectorAll("path");

								filename = "BRASIL_ESTADOS";
								for(indexLevelTwo = 0; pathEstados.length > indexLevelTwo; indexLevelTwo++){
									pathEstado = pathEstados[indexLevelTwo];

									innerMatrix["BRASIL"][gRegiao.id][pathEstado.id] = {
										nome: pathEstado.id,
										coordenadas: pathEstado.getAttribute("d"),
										tag: "path",
										attr: "d"
									};

								}
							}
						}
					}
					else if(getEstados(g1.id)){ 
						gRegiao = g1;

						innerMatrix[gRegiao.id] = {};

						gEstados = svg.querySelectorAll("#"+gRegiao.id+" > g");

						if(getEstados.length > 0){ // REGIAO_ESTADOS
							filename = gRegiao.id+"_ESTADOS";

							pathEstados = gRegiao.querySelectorAll("polygon");

							for(indexLevelOne = 0; pathEstados.length > indexLevelOne; indexLevelOne++){
								pathEstado = pathEstados[indexLevelOne];

								innerMatrix[gRegiao.id][pathEstado.id] = {
									nome: pathEstado.id,
									coordenadas: pathEstado.getAttribute("points"),
									tag: "polygon",
									attr: "points"
								};
							}
						}
						else{ // REGIAO_MUNICIPIOS
							filename = gRegiao.id+"_MUNICIPIOS";
							for(indexLevelOne = 0; gEstados.length > 0; indexLevelOne++){
								gEstado = gEstados[indexLevelOne];
								innerMatrix[gRegiao.id][gEstado.id] = {};

								gMunicipios = svg.querySelectorAll("#"+gRegiao.id+" > #"+gEstado.id+" > g");

								for(indexLevelTwo = 0; gMunicipios.length > indexLevelTwo; indexLevelTwo++){
									gMunicipio = gMunicipios[indexLevelTwo];


									if(!matrixNome[gMunicipio.id]){
										var aux = gMunicipio.id.substr(1);
										aux = "m1"+aux;
										matrixNome[gMunicipio.id] = matrixNome[aux];
									}
									innerMatrix[gRegiao.id][gEstado.id][gMunicipio.id]={
										nome: matrixNome[gMunicipio.id],
										coordenadas: [],
										tag: "path",
										attr: "d"
									};

									pathMunicipios = gMunicipio.querySelectorAll("path");

									for(indexLevelThree = 0; pathMunicipios.length > indexLevelThree; indexLevelThree++){
										pathMunicipio = pathMunicipios[indexLevelThree];
										coordenadas = pathMunicipio.getAttribute("d");
										innerMatrix[gRegiao.id][gEstado.id][gMunicipio.id].push(coordenadas);
									}
								}
							}
						}
					}
					else if(g1.id.length == 2){ //ESTADO_MUNICIPIOS
						gEstado = g1;

						innerMatrix[gEstado.id] = {};

						filename = gEstado.id;
						gMunicipios = svg.querySelectorAll("#"+gEstado.id+" > g");

						for(indexLevelOne = 0; gMunicipios.length > indexLevelOne; indexLevelOne++){
							gMunicipio = gMunicipios[indexLevelOne];

							if(!matrixNome[gMunicipio.id]){
								var aux = gMunicipio.id.substr(1);
								aux = "m1"+aux;
								matrixNome[gMunicipio.id] = matrixNome[aux];
							}
							innerMatrix[gEstado.id][gMunicipio.id] = {
								nome: matrixNome[gMunicipio.id],
								coordenadas: [],
								attr: "d",
								tag: "path"
							};

							pathMunicipios = gMunicipio.querySelectorAll("path");

							for(indexLevelTwo = 0; pathMunicipios.length > indexLevelTwo; indexLevelTwo++){
								pathMunicipio = pathMunicipios[indexLevelTwo];

								coordenadas = pathMunicipio.getAttribute("d");

								innerMatrix[gEstado.id][gMunicipio.id].coordenadas.push(coordenadas);

							}
						}
					}
					var content;
					content = "var XTR_"+filename+" = "+JSON.stringify(innerMatrix)+";";
					
					console.log(innerMatrix);
					FileHandler(content,false,false).download("XTR_"+filename+".js",function(){});
					innerMatrix = null;
				});
			};
		});
	});
	const regioes = {
		"norte": ["ac","am","ap","pa","ro","rr","to"],
		"nordeste": ["al","ba","ce","ma","pb","pe","pi","rn","se"],
		"centro-oeste": ["df","go","ms","mt"],
		"sudeste": ["sp","es","mg","rj"],
		"sul": ["pr","rs","sc"]
	}
	function getEstados(regiao){
		regiao = regiao.toLowerCase();
		if(isset(regioes[regiao])){
			return regioes[regiao];
		}
		return false;
	}
	function getRegiaoNome(estado){		
		
		for(regiaoNome in regioes){
			if(regioes[regiaoNome].indexOf(estado.toLowerCase()) >=0)
				return regiaoNome.toUpperCase();
		}
		return false;
	}
	function FileHandler(data,isBase,isJson){
		var isBase64;
		/**
		 * BTER, em json codificado em base64 o input de \data
		 *
		 * @method  create
		 *
		 @return  {[type]}  [description]
		 */
		function create(){
			var json;
			var base64;

			json = data
			if(isJson)
            	json = JSON.stringify(json);

            base64 = json;
            if(isBase)
           		base64 = Base64.encode(base64);

            return base64;
        }
        /**
         * FORNECER, arquivo a ser upado
         *
         * @method  upload
         *
         * @param  {File}    arquivo   [description]
         * @param  {Function}  callback
         *
         * @return  {void}    
         */
		function upload(arquivo,callback){
			var msg;
			var content;
			var base64;
			var json;
			if(arquivo){
			    var reader = new FileReader();
			    reader.onload = function(item) { 
			        base64 = item.target.result;
			        json = Base64.decode(base64);
			        content = JSON.parse(json);
			       	if(iscallable(callback)){
			       		callback();
			       	}
			    }
			    reader.readAsText(arquivo);
			} 
			else {
			    msg = "Carregar, nenhum arquivo foi fornecido";
			    console.warn(msg);
			    alert(msg);
			}
		}
		/**
		 *  FORNECER, elemento que faz o download do arquivo codificado em \create
		 *
		 * @method  download
		 *
		 * @param  {String}    filename 
		 * @param  {Function}  callback
		 *
		 * @return  {void}
		 */
        function download(filename,callback){
        	var element;
        	var base64;

        	filename = isset(filename) ? filename : "xtrGrafico";

        	base64 = create();

            element = document.createElement('a');
            element.setAttribute('href', 'data:text/javascript;charset=utf-8,' + encodeURIComponent(base64));
            element.setAttribute('download', filename);
            element.setAttribute("target","_blank");

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);

            if(iscallable(callback)){
            	callback();
            }
        }
        /**
         * ATTACH, elemento à ação de \upload
         *
         * @method  attachUpload
         *
         * @param  {String}    id        id do elemento
         * @param  {String}    type      evento de click
         * @param  {Function}  callback  metodo attached na ação
         *
         * @return  {void}      
         */
        function attachUpload(id,type,callback){
        	var element;
        	var arquivo;

        	element = document.getElementById(id);
        	if(element == null){
        		console.warn("DataHandler",attachUpload,"didn't find any element with id:",id);
        		return;
        	}
        	element.addEventListener(type,function(event){
        		arquivo = event.target.files[0]; 
        		upload(arquivo,callback);
        	});
        }
        function attachDownload(id,type,callback,filename){
        	var element;
        	var arquivo;

        	element = document.getElementById(id);
        	if(element == null){
        		console.warn("DataHandler",attachDownload,"didn't find any element with id:",id);
        		return;
        	}
        	element.addEventListener(type,function(event){
        		download(filename,callback);
        	});
        }
        this._=data;
        this.upload=upload;
        this.create=download;
        this.attachDownload=attachDownload;
        this.attachUpload=attachUpload;
        this.download=download;
        this.upload=upload;
        return this;
	}

	function isset(obj){
		var IsSet = typeof obj!=undefined && typeof obj!="undefined";
		return IsSet;
	}
