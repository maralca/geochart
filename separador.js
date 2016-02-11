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

	matrixNome = {};

	document.addEventListener("DOMContentLoaded",function(){
		count = 0;
		document.getElementById("UP_1").addEventListener("change",function(event){
			arquivos = event.target.files;

			for(arquivoIndex = 0; arquivos.length > arquivoIndex; arquivoIndex++){
				arquivo = arquivos[arquivoIndex];				
				
				var iframe = document.createElement("iframe");
				iframe.setAttribute("src",URL.createObjectURL(arquivo));
				iframe.setAttribute("name",arquivo.name);
				document.body.appendChild(iframe);

			}
			docs = document.querySelectorAll("iframe");

			for(docIndex = 0; docs.length > docIndex; docIndex++){
				doc = docs[docIndex];

				doc.addEventListener("load",function(){

					table = this.contentDocument.querySelector("tbody");
					trs = table.querySelectorAll("tr");
					for(trIndex = 0; trs.length > trIndex; trIndex++){
						tr = trs[trIndex];
						tdNome = tr.querySelector("td:first-child");
						tdId = tr.querySelector("td:nth-child(2)");
						matrixNome["m"+tdId.innerHTML] = tdNome.innerHTML;
					}
					count ++;
					if(count >= docs.length){
						console.log(matrixNome);
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
					var innerMatrix = {};
					svg = this.getSVGDocument();

					ALPHA = svg.querySelector("g");
					seletorLevelOne = "#"+ALPHA.id+"> g";
					gs = svg.querySelectorAll(seletorLevelOne);
					for(gIndex = 0; gs.length > gIndex; gIndex++){
						g = gs[gIndex];
						if(regioesNome.indexOf(g.id.toLowerCase()) >= 0){
							regiao = g;
							regiaoId = regiao.id;
							innerMatrix[regiaoId] = {};

							if(gs.length > 1)
								filename = "BRASIL";
							else
								filename = regiaoId;

							seletorLevelTwo = seletorLevelOne + " > g";
							estados = regiao.querySelectorAll(seletorLevelTwo);
							if(estados.length > 0){
								for(estadoIndex = 0; estados.length > estadoIndex; estadoIndex++){
									estado = estados[estadoIndex];
									estadoId = estado.id;
									innerMatrix[regiaoId][estadoId] = {};

									seletorLevelThree = seletorLevelTwo + " > g";
									cidades = estado.querySelectorAll(seletorLevelThree);

									for(cidadeIndex = 0; cidades.length > cidadeIndex; cidadeIndex++){
										cidade = cidades[cidadeIndex];
										cidadeId = cidade.id;
										innerMatrix[regiaoId][estadoId][cidadeId] = {
											nome: matrixNome[cidadeId],
											coordenadas: []
										};

										coordenadas = cidade.getElementsByTagName("path");
										for(coordenadaIndex = 0; coordenadas.length > coordenadaIndex; coordenadaIndex++){
											coordenada = coordenadas[coordenadaIndex];
											coordenada = coordenada.getAttribute("d");
											innerMatrix[regiaoId][estadoId][cidadeId].coordenadas.push(coordenada);
										};
									};
								};
							}
							else{
								coordenadas = regiao.getElementsByTagName("path");
								for(coordenadaIndex = 0; coordenadas.length > coordenadaIndex; coordenadaIndex++){
									coordenada = coordenadas[coordenadaIndex];
									estadoId = coordenada.id;
									coordenada = coordenada.getAttribute("d");
									innerMatrix[regiaoId][estadoId] = coordenada;
								};
							}
						}
						else{
							estadoId = ALPHA.id;
							filename = estadoId;
							regiaoId = getRegiaoNome(estadoId);
							if(regiaoId == undefined || regiaoId == "undefined"){
								regiaoId = estadoId;
							}
							cidade = g;
							cidadeId = cidade.id;
							console.log(cidadeId,estadoId,regiaoId);
							if(!innerMatrix[regiaoId]){
								innerMatrix[regiaoId] = {};								
							}
							if(!innerMatrix[regiaoId][estadoId]){
								innerMatrix[regiaoId][estadoId] = {};
							}
							coordenadas = cidade.getElementsByTagName("path");
							innerMatrix[regiaoId][estadoId][cidadeId] = {
								nome: matrixNome[cidadeId],
								coordenadas: []
							};
							for(coordenadaIndex = 0; coordenadas.length > coordenadaIndex; coordenadaIndex++){
								coordenada = coordenadas[coordenadaIndex];
								coordenada = coordenada.getAttribute("d");
								innerMatrix[regiaoId][estadoId][cidadeId].coordenadas.push(coordenada);
							};
						}
							
					};		
					var content;
					content = "var XTR_"+filename+" = "+JSON.stringify(innerMatrix)+";";
					
					console.log(innerMatrix);
					FileHandler(content,false,false).download("XTR_"+filename+".js",function(){});
				});
			};
		});
	});
	function getRegiaoNome(estado){		
		const regioes = {
			"norte": ["ac","am","ap","pa","ro","rr","to"],
			"nordeste": ["al","ba","ce","ma","pb","pe","pi","rn","se"],
			"centro-oeste": ["df","go","ms","mt"],
			"sudeste": ["sp","es","mg","rj"],
			"sul": ["pr","rs","sc"]
		}
		for(regiaoNome in regioes){
			if(regioes[regiaoNome].indexOf(estado.toLowerCase()) >=0)
				return regiaoNome.toUpperCase();
		}
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
            element.setAttribute('href', 'data:text/javascript;charset=utf-8,' + base64);
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