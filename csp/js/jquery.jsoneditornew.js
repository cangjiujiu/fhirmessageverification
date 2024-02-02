// Simple yet flexible JSON editor plugin.
// Turns any element into a stylable interactive JSON editor.

// Copyright (c) 2013 David Durman

// Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).

// Dependencies:

// * jQuery
// * JSON (use json2 library for browsers that do not support JSON natively)

// Example:

//     var myjson = { any: { json: { value: 1 } } };
//     var opt = { change: function() { /* called on every change */ } };
//     /* opt.propertyElement = '<textarea>'; */ // element of the property field, <input> is default
//     /* opt.valueElement = '<textarea>'; */  // element of the value field, <input> is default
//     $('#mydiv').jsonEditor(myjson, opt);


    var Topt=""
     var Tjson=""
      var Troot=""
     var path=""
    $.fn.jsonEditor = function(json, options) {
        options = options || {};
        // Make sure functions or other non-JSON data types are stripped down.
        json = parse(stringify(json));
        
        var K = function() {};
        var onchange = options.change || K;
        var onpropertyclick = options.propertyclick || K;

        return this.each(function() {
            JSONEditor($(this), json, onchange, onpropertyclick, options.propertyElement, options.valueElement);
        });
        
    };
    
    function JSONEditor(target, json, onchange, onpropertyclick, propertyElement, valueElement) {
	    //console.log(json)
        var opt = {
            target: target,
            onchange: onchange,
            onpropertyclick: onpropertyclick,
            original: json,
            propertyElement: propertyElement,
            valueElement: valueElement
        };
        construct(opt, json, opt.target);
        $(opt.target).on('blur focus', '.property, .value', function() {
            $(this).toggleClass('editing');
        });
    }

    function isObject(o) { return Object.prototype.toString.call(o) == '[object Object]'; }
    function isArray(o) { return Object.prototype.toString.call(o) == '[object Array]'; }
    function isBoolean(o) { return Object.prototype.toString.call(o) == '[object Boolean]'; }
    function isNumber(o) { return Object.prototype.toString.call(o) == '[object Number]'; }
    function isString(o) { return Object.prototype.toString.call(o) == '[object String]'; }
    var types = 'object array boolean number string null';

    // Feeds object `o` with `value` at `path`. If value argument is omitted,
    // object at `path` will be deleted from `o`.
    // Example:
    //      feed({}, 'foo.bar.baz', 10);    // returns { foo: { bar: { baz: 10 } } }
    function feed(o, path, value) {
	    console.log(path)
        var del = arguments.length == 2;
        
        if (path.indexOf('.') > -1) {
            var diver = o,
                i = 0,
                parts = path.split('.');
            for (var len = parts.length; i < len - 1; i++) {
                diver = diver[parts[i]];
            }
            if (del) delete diver[parts[len - 1]];
            else diver[parts[len - 1]] = value;
        } else {
            if (del) delete o[path];
            else o[path] = value;
        }
       // console.log(o)
        return o;
    }

    // Get a property by path from object o if it exists. If not, return defaultValue.
    // Example:
    //     def({ foo: { bar: 5 } }, 'foo.bar', 100);   // returns 5
    //     def({ foo: { bar: 5 } }, 'foo.baz', 100);   // returns 100
    function def(o, path, defaultValue) {
        path = path.split('.');
        var i = 0;
        while (i < path.length) {
            if ((o = o[path[i++]]) == undefined) return defaultValue;
        }
        return o;
    }

    function error(reason) { if (window.console) { console.error(reason); } }
    
    function parse(str) {
        var res;
        try { res = JSON.parse(str); }
        catch (e) { res = str; error('JSON parse failed.'); }
        return res;
    }

    function stringify(obj) {
        var res;
        try { res = JSON.stringify(obj); }
        catch (e) { res = 'null'; error('JSON stringify failed.'); }
        return res;
    }
    
    function addExpander(item) {
        if (item.children('.expander').length == 0) {
            var expander =   $('<span>',  { 'class': 'expander' });
            expander.bind('click', function() {
                var item = $(this).parent();
                item.toggleClass('expanded');
            });
            item.prepend(expander);
        }
    }

    function addListAppender(item, handler) {
        var appender = $('<div>', { 'class': 'item appender' }),
            btn      = $('<button></button>', { 'class': 'property' });

        btn.text('Add New Value');

        appender.append(btn);
        item.append(appender);

        btn.click(handler);

        return appender;
    }

    function addNewValue(json,value) {
        if (isArray(json)) {
            json.push(value);
            return true;
        }

        if (isObject(json)) {
            var i = 1, newName = $('#rType').val();

            /*while (json.hasOwnProperty(newName)) {
                newName = "newKey" + i;
                i++;
            }*/

            json[newName] = value;
            return true;
        }

        return false;
    }
    
    function construct(opt, json, root, path) {
	     
        path = path || '';
        
        root.children('.item').remove();
        
        for (var key in json) {
            if (!json.hasOwnProperty(key)) continue;

            var item     = $('<div>',   { 'class': 'item', 'data-path': path }),
                property =   $(opt.propertyElement || '<input>', { 'class': 'property' }),
                value    =   $(opt.valueElement || '<input>', { 'class': 'value','onclick':'getValueType('+"'"+path+"'"+','+"'"+key+"'"+')'    });

            if (isObject(json[key]) || isArray(json[key])) {
                addExpander(item);
            }
            
            item.append(property).append(value);
            root.append(item);
            
            property.val(key).attr('title', key);
            var val = stringify(json[key]);
            value.val(val).attr('title', val);

            assignType(item, json[key]);

            //property.change(choosepropertyChanged(opt));
            property.change(propertyChanged(opt));
            value.change(valueChanged(opt));
            property.click(propertyClicked(opt));
            
            if (isObject(json[key]) || isArray(json[key])) {
                construct(opt, json[key], item, (path ? path + '.' : '') + key);
            }
        }

        if (isObject(json) ) {
            addListAppender(root, function () {
	           
	            
	            $.ajax('http://'+window.location.host+'/fhirMessageVerification/getOtherName', {

                method: 'POST',

                data: { "path":path,"json":JSON.stringify(json),"rType":$('#namelist').val(),"version":$('#versionlist').val() },
                success: function (result) {
	                
	               result= JSON.parse(result)
	               var str='<select id="rType">'
	               
	               for (var key in result) 
	                {
		                str=str+'<option value="'+result[key].name+'">'+result[key].name+'</option>'
		            }
		             str=str+'</select><div><button onclick="updateJSON1()">ok</button></div>'
		             
	                showPopup(str);
	               /// console.log(path)
	                Topt=opt
	                 Tjson=json
	                 Troot=root
	                  Tpath=path
	                  //updateJSON(opt, json, root, path)
                   

                },
                error: function (err) {
                    console.log(err);
                }
            })
                
            })
        }else if(isArray(json))
        {
	        
	        addListAppender(root, function () {
		        //console.log(path)
		        var temppath=path
		        var patharray=temppath.split('.')
	     
	        var name=""
	        var tpath=""
	        for (i=0;i<patharray.length-1;i++)
	        {
		        tpath=tpath+patharray[i]+"."
		    }
		    name=patharray[patharray.length-1]
		   
		    if (tpath!="")
		    {
			  tpath= tpath.slice(0,-1)   
			}
			
	            //path 截取为path的前几位
	          $.ajax('http://'+window.location.host+'/fhirMessageVerification/getResourceValue', {

                method: 'POST',

                data: {"name":name ,"path":tpath ,"rType":$('#namelist').val(),"version":$('#versionlist').val()},
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
           
             vResult=result.replace('\r\n', '')
        }
       
	                addNewValue(json, vResult);
                    construct(opt, json, root, path);
                    opt.onchange(parse(stringify(Topt.original)));  
                }
	   })
	
	  
               
            })
	    }
    }
    function updateJSON1()
    {
	    //console.log("??")
	   $.ajax('http://'+window.location.host+'/fhirMessageVerification/getResourceValue', {

                method: 'POST',

                data: {"name":$('#rType').val() ,"path":Tpath ,"rType":$('#namelist').val(),"version":$('#versionlist').val() },
                success: function (result) {
	                try {
            var obj=JSON.parse(result);
            if(typeof obj == 'object' && obj ){
                //return true;
                vResult=JSON.parse(result)
            }else{
                //return false;
                vResult=result.replace('\r\n', '')
            }
 
        } catch(e) {
           // console.log('error：'+str+'!!!'+e);
             vResult=result.replace('\r\n', '')
        }
	                addNewValue(Tjson, vResult);
                    construct(Topt, Tjson, Troot, Tpath);
                    Topt.onchange(parse(stringify(Topt.original)));  
                }
	   })
	  closePopup()
	  }
    function updateParents(el, opt) {
	    
        $(el).parentsUntil(opt.target).each(function() {
            var path = $(this).data('path');
            //console.log(path)
            path = (path ? path + '.' : path) + $(this).children('.property').val();
            // console.log(path)
            var val = stringify(def(opt.original, path, null));
            // console.log(val)
            $(this).children('.value').val(val).attr('title', val);
        });
    }
function updateParents2(el, opt,path,val) {
	    //console.log(el)
	    //console.log(opt.target)
        $(el).parentsUntil(opt.target).each(function() {
            //var path = path
           // console.log(path)
            //path = (path ? path + '.' : path) + $(this).children('.property').val();
             //console.log(path)
           // var val = stringify(def(opt.original, path, null));
             //console.log(val)
            $(this).children('.value').val(val).attr('title', val);
        });
    }
    function propertyClicked(opt) {
        return function() {
            var path = $(this).parent().data('path');            
            var key = $(this).attr('title');
           // console.log(propertyClicked)
            var safePath = path ? path.split('.').concat([key]).join('\'][\'') : key;
            
            opt.onpropertyclick('[\'' + safePath + '\']');
        };
    }
    
    function propertyChanged(opt) {
	    
        return function() {
            var path = $(this).parent().data('path'),
                val = parse($(this).next().val()),
                
                newKey = $(this).val(),
                oldKey = $(this).attr('title');
                
            $(this).attr('title', newKey);
            console.log("path"+path)
            feed(opt.original, (path ? path + '.' : '') + oldKey);
            if (newKey) feed(opt.original, (path ? path + '.' : '') + newKey, val);

            updateParents(this, opt);

            if (!newKey) $(this).parent().remove();
            
            opt.onchange(parse(stringify(opt.original)));
        };
    }
    function choosepropertyChanged(opt,this1,new1) {
	    
            var path = this1.parent().data('path'),
                val = parse(this1.next().val()),
                newKey = new1,
               
                oldKey = this1.attr('title');
             //console.log(val)
              this1.val(newKey)
              this1.attr('title', newKey);
            //console.log(path)
            feed(opt.original, (path ? path + '.' : '') + oldKey);
            if (newKey) feed(opt.original, (path ? path + '.' : '') + newKey, val);

            updateParents(this, opt);

            if (!newKey) this1.parent().remove();
            
            opt.onchange(parse(stringify(opt.original)));
       
    }
    function valueChanged(opt) {
	   // console.log("valuiechange")
	   
        return function() {
	         //console.log("-!!!!")
            var key = $(this).prev().val(),
                val = parse($(this).val() || 'null'),
                item = $(this).parent(),
                path = item.data('path');

            feed(opt.original, (path ? path + '.' : '') + key, val);
            if ((isObject(val) || isArray(val)) && !$.isEmptyObject(val)) {
                construct(opt, val, item, (path ? path + '.' : '') + key);
                addExpander(item);
            } else {
                item.find('.expander, .item').remove();
            }

            assignType(item, val);

            updateParents(this, opt);
            
            opt.onchange(parse(stringify(opt.original)));
        };
    }
      function showPopup(str) {
            document.getElementById("popup").style.display = "block";
            document.getElementById("pop_1_box").innerHTML = str;
        }
       

    function assignType(item, val) {
        var className = 'null';
        
        if (isObject(val)) className = 'object';
        else if (isArray(val)) className = 'array';
        else if (isBoolean(val)) className = 'boolean';
        else if (isString(val)) className = 'string';
        else if (isNumber(val)) className = 'number';

        item.removeClass(types);
        item.addClass(className);
    }
    //function get

 function closePopup() {
            document.getElementById("popup").style.display = "none";
        }
        
        //console.log(window.location.host)
