Class FHIRMV.Util Extends %CSP.REST
{

Parameter HandleCorsRequest = "true";

XData UrlMap [ XMLNamespace = "http://www.bjgoodwill.com/urlmap" ]
{
<Routes>

  
  <Route Url="/valid" Method="POST" Call="valid" />
 
</Routes>
}

ClassMethod valid() As %Status
{
	set ob={}.%FromJSON(%request.Data("JSON",1))
	
    SET TYPE=ob.resourceType
  if (TYPE'=""){
  set schema = ##class(HS.FHIRServer.Schema).LoadSchema("R4")
 set resourceValidator = ##class(HS.FHIRServer.Util.ResourceValidator).%New(schema)

 set tsc=resourceValidator.ValidateObject(ob,TYPE,TYPE,$$$OK,0) 
  }else{
	w "error"  
	  
   }
 
 //w "123",!
 set result=[]
 
  set errorlist=""
  Do $SYSTEM.Status.DecomposeStatus(tsc,.errorlist)
  //zw errorlist
 if (errorlist'=""){
  for i=1:1:errorlist
  {
	   //w errorlist(i),!
	   set path=$p(errorlist(i,"param",errorlist(i,"param")),"|",*)
	  // w path,!
	   //w errorlist(i,"dcode"),!
	   //w errorlist(i,"param",2),!
	  set tempResult={}
	  set path= ..errorPath(errorlist(i,"dcode"),$p($replace($replace(path,"[","."),"]",""),".",2,*),errorlist(i,"param",2))
	  set tempResult.path=path
	  set tempResult.ErrorType="FHIRERROR"_errorlist(i,"dcode")
	  set tempResult.point=errorlist(i,"param",2)
	   set tempResult.text=$p(errorlist(i),":",2,*)
	  //set tempResult.value=errorlist(i,"param",2)
	  Do result.%Push(tempResult)
       //w errorlist(i,"param",3),!
  }
 }
 w result.%ToJSON(),!
   Quit $$$OK
}

ClassMethod errorPath(Type, path, point) As %String
{
	//w path,point,!
	if (Type="ValueNotInEnumeration"){
		set result=path
		}else{
	set result=path
	
		if (path'="")
		{
		  set result=result_"."_point
		}else{
			set result=point
		}
	}
	Quit result
}

}

