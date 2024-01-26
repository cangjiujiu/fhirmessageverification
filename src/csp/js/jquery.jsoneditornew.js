<!DOCTYPE html>
<html>
<head>
    
    <link rel="stylesheet" href="css/jsoneditor.css"/>
   

    <title>FHIR|R4 MESSAGE CREATE</title>

    <style>
        body {
          padding: 0 70px;
        }
        #json {
          margin: 10px 10px 10px 32px;
          width: 50%;
          min-height: 70px;
        }
        h1 {
          font-family: Arial;
          color: #EBBC6E;
          text-align: center;
          text-shadow: 1px 1px 1px black;
          border-bottom: 1px solid gray;
          padding-bottom: 50px;
          width: 500px;
          margin: 20px auto;
        }
        h1 img {
          float: left;
        }
        h1 b {
          color: black;
          font-weight: normal;
          display: block;
          font-size: 12px;
          text-shadow: none;
        }

        #legend {
          display: inline;
          margin-left: 30px;
        }
        #legend h2 {
           display: inline;
           font-size: 18px;
           margin-right: 20px;
        }
        #legend a {
          color: white;
          margin-right: 20px;
        }
        #legend span {
          padding: 2px 4px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          border-radius: 5px;
          color: white;
          font-weight: bold;
          text-shadow: 1px 1px 1px black;
          background-color: black;
        }
        #legend .string  { background-color: #009408; }
        #legend .array   { background-color: #2D5B89; }
        #legend .object  { background-color: #E17000; }
        #legend .number  { background-color: #497B8D; }
        #legend .boolean { background-color: #B1C639; }
        #legend .null    { background-color: #B1C639; }

        #expander {
          cursor: pointer;
          margin-right: 20px;
        }

        #footer {
          font-size: 13px;
        }

        #rest {
          margin: 20px 0 20px 30px;
        }
        #rest label {
          font-weight: bold;
        }
        #rest-callback {
          width: 70px;
        }
        #rest-url {
          width: 700px;
        }
        label[for="json"] {
          margin-left: 30px;
          display: block;
        }
        #json-note {
          margin-left: 30px;
          font-size: 12px;
        }

        .addthis_toolbox {
          position: relative;
          top: -10px;
          margin-left: 30px;
        }

        #disqus_thread {
          margin-top: 50px;
          padding-top: 20px;
          padding-bottom: 20px;
          border-top: 1px solid gray;
          border-bottom: 1px solid gray;
        }


     body,P{margin:0;padding:0;}
        .popup {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        }
 
        .popup-inner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
           
            width: 1160px;
            height: 635px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
            text-align: center;
            max-width: 80%;
            overflow: auto;
            max-height: 80%;
        }
 
        .popup-close {
            position: absolute;
            top: 5px;
            right: 10px;
            font-size: 20px;
            color: #aaa;
            cursor: pointer;
        }
        .popup-inner li{margin-bottom: 6px;}
        .popup-inner li p{ display:inline-block; width: 350px; height: 58px; background-color: #e1deff; border: 1px solid #f6faff; font-size: 20px; line-height: 58px; text-align: center; color: #645488; border-radius: 7px;}
        .popup-inner div{font-weight: bold; color: #fff;}
        .popup-inner div p{ display:inline-block;}
        .popup-inner ul{padding-top: 25px; margin-bottom: 25px;}
        .popup-inner h2{font-size: 35px; color: #9f7cf1;}
        .popup-close{font-size: 45px;}
        li{list-style-type: none;}
        a{text-decoration: none; color: #f7eeee; font-weight: bold;}
        span{font-weight: bold; color: #f7eeee;}

    </style>

    <script type="text/javascript">

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-5029684-7']);
        _gaq.push(['_trackPageview']);

        (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();

    </script>
</head>

<body>
    <h1>
        FHIR|R4 MESSAGE CREATE
    </h1>
    
  

    <div id="rest">
        <select id="namelist"></select>
        <button onclick="getJSONTOSTRING()">ok</button>
    </div>
    <pre id="path"></pre>
    <div id="editor" class="json-editor"></div>


    <textarea id="json"></textarea><br/>

<div class="popup" id="popup">
        <div class="popup-inner"> <span class="popup-close" onclick="closePopup()">&times;</span>
            <h2>Please select the nodes that need to be added</h2>
            <!-- <p>自定义弹窗内容</p> -->
            <ul>
                <li class="pop1" id="pop1"></li>
            </ul>
            <div id="pop_1_box">
                
            </div>
            
        </div>
    </div>


    <script src="js/json2.js"></script>
    <script src="js/jquery.js"></script>
    <script src="js/jquery.jsoneditornew.js"></script>
    <script src="js/jsoneditor.js"></script>
    <script>
    var clickpath=""
    var clickname=""
    function getlist(){
	     $.ajax('http://'+window.location.host+'/fhirMessageVerification/GetResourceNameList',
	      {

                method: 'POST',

                data: {  },
                success: function (result) {
                   result = JSON.parse(result)
                    var sel = document.getElementById("namelist");
                    for (var key in result)
                    {
	                    var opt = new Option( result[key], result[key]);//第一个代表标签内的内容，第二个代表value
				        sel.options.add(opt);
	                 }
                          
                },
                error: function (err) {
                    console.log(err);
                }
            })
    }
    function getJSONTOSTRING() {
            json1 = $('#json').val()
            resultArray=[]
            $.ajax('http://'+window.location.host+'/fhirMessageVerification/getJSON', {

                method: 'POST',

                data: {"rType":$('#namelist').val()  },
                success: function (result) {
                   result = JSON.parse(result)
                    //var newdata = JSON.parse(json1)
                    //console.log(result)
                           $('#json').val(JSON.stringify(result.json, undefined, 2))
                           $('#editor').jsonEditor(JSON.parse($('#json').val()), { change: updateJSON, propertyclick: showPath });
                   // $('#result').html(syntaxHighlight(newdata, resultArray));


                },
                error: function (err) {
                    console.log(err);
                }
            })


        }
         function closePopup() {
            document.getElementById("popup").style.display = "none";
        }
getlist()
function choosechange(path,name,this1)
{
	
    $.ajax('http://'+window.location.host+'/fhirMessageVerification/getResourceValue', {

                method: 'POST',

                data: {"name":$('#rType').val() ,"path":path ,"rType":$('#namelist').val()},
                success: function (result) {
	                 console.log( obj)
	                console.log(typeof obj)
	                try {
            var obj=JSON.parse(result);
            console.log(obj)
            var obj=obj[0]
            if(typeof obj == 'object' && obj ){
                //return true;
                vResult=obj
            }else{
                //return false;
                vResult=obj.replace('\r\n', '')
            }
          
            } catch(e) {
           // console.log('error：'+str+'!!!'+e);
             vResult=result.replace('\r\n', '')
             
             
             if (path=="")
   {
	     
	       el=$("input[title='"+name+"']")
	       el.next().val(vResult)
	       var opt={}
	       opt.target=$('#editor') //$("div[id='editor']")
	       opt.original=JSON.parse($('#json').val())
	       opt.onchange=updateJSON
	       opt.propertyclick=showPath 
	       choosepropertyChanged(opt,$("input[title='"+name+"']"),$('#rType').val())
	       //获取对应的value
   }else{
	       var el=$("div[data-path='"+path+"']").children('.property')
	       el.next().val(vResult)
	       var opt={}
	       opt.target=$('#editor') //$("div[id='editor']")
	       opt.original=JSON.parse($('#json').val())
	       opt.onchange=updateJSON
	       opt.propertyclick=showPath 
	       choosepropertyChanged(opt,el,$('#rType').val())
	}
                 //$('#json').val(JSON.stringify(result.json, undefined, 2))
                 $('#editor').jsonEditor(JSON.parse($('#json').val()), { change: updateJSON, propertyclick: showPath });
                      
             
        }}})
}
 function get(o, path) {


            var del = arguments.length == 2;

            if (path.indexOf('.') > -1) {
                var diver = o,
                    i = 0,
                    parts = path.split('.');
                for (var len = parts.length; i < len; i++) {
                    diver = diver[parts[i]];
                    console.log(diver)
                }
            } else {
                diver = o[path];
            }
            return diver;
        }
function showPath(path) {
	//tthis=$(this)
	 //$('#test11').jsonEditor(json, { change: updateJSON, propertyclick: choosechange });
	console.log(json)
	console.log(path)
	path=path.replace("']['",".")	
     console.log(path)
    path=path.replace("[", "")
    path=path.replace("]", "")
    path=path.replace("'", "")	
    path=path.replace("'", "")	
    console.log(path)
    var tpath=""
    var patharray=path.split('.')
    for (i=0;i<patharray.length-1;i++)
	        {
		        tpath=tpath+patharray[i]+"."
		    }
		    name=patharray[patharray.length-1]
		   
		    if (tpath!="")
		    {
			  tpath= tpath.slice(0,-1)   
			}
    console.log(name,tpath)
    //clickpath=tpath
    //clickname=name
	
   // $('#path').text(path);
   $.ajax('http://'+window.location.host+'/fhirMessageVerification/getChoose', {

                method: 'POST',

                data: {"rType":$('#namelist').val(),"path":path },
                success: function (result) {
	                console.log(result)
	                
                   result = JSON.parse(result)
                   if (result.length!=0){
                   console.log(result)
                   var str='<select id="rType">'
	               
	               for (var key in result) 
	                {
		                str=str+'<option value="'+result[key]+'">'+result[key]+'</option>'
		            }
		             str=str+'</select><div><button id="test11" onclick="choosechange('+"'"+tpath+"'"+','+"'"+name+"'"+',11'+')">ok</button></div>'
		            
	                showPopup(str);
	               // $('#test11').jsonEditor(json, { change: updateJSON, propertyclick:  updateJSON })
	                }

                },
                error: function (err) {
                    console.log(err);
                }
            })
     
}

    </script>
</body>
</html>
