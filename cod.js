
            
            var qualquer = #{javascript: 
            	var db = session.getDatabase("xtr-tinto/consiste", "big-municipiospadrao.nsf", false);
            	var view  = db.getView("Municipio");
            	var doc = view.getFirstDocument()
            	var arr = [];
            	
            	while( doc != null ) {
            		var name = doc.getItemValueString("Municipio");
            		var id = doc.getItemValueString("CodMunicipio6");
            		var meso = doc.getItemValueString("Mesorregiao");
            		var micro = doc.getItemValueString("Microrregiao");
            		arr.push({
            			name: name,
            			meso: meso,
            			micro: micro,
            			id: id            			
            		});
            		
            		doc = view.getNextDocument(doc)
            	}
            	return xtrJson(arr);
            };
            qualquer = JSON.stringify(qualquer);
             element = document.createElement('a');
            element.setAttribute('href', 'data:text/javascript;charset=utf-8,' + encodeURIComponent(qualquer));
            element.setAttribute('download', "teste.js");
            element.setAttribute("target","_blank");

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);