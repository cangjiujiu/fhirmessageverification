Include HS.FHIRServer

Class FHIRMV.Util Extends %CSP.REST
{

Parameter HandleCorsRequest = "true";

XData UrlMap [ XMLNamespace = "http://www.bjgoodwill.com/urlmap" ]
{
<Routes>

  
  <Route Url="/valid" Method="POST" Call="valid" />
  <Route Url="/getJSON" Method="POST" Call="getJSON" />
  <Route Url="/getOtherName" Method="POST" Call="getOtherName" />
  <Route Url="/getResourceValue" Method="POST" Call="getResourceValue" />
  <Route Url="/GetResourceNameList" Method="POST" Call="GetResourceNameList" />
  <Route Url="/getChoose" Method="POST" Call="getChoose" />
    
 
</Routes>
}

ClassMethod getChoose() As %Status
{
	set result=[]
   	set path=%request.Data("path",1)
	//set path="['effective']"
	//set resourceType="MedicationAdministration"
	set resourceType=%request.Data("rType",1)
	set path=$replace(path,"']['",".")
	set path=$translate(path,"'][","")
	if path["."{
	  set tpath=$p(path,".",1,*-1)	
	  //w path,!
	  set type=..getFHIRTYPE(resourceType,tpath)
	 // w type,!
	  set pname=$p(path,".",*)	
	  //w pname,!
	}else{
		set type=resourceType
	    set pname=$p(path,".",*)	
	}

	//w pname,",",type,!
	set schema = ##class(HS.FHIRServer.Schema).LoadSchema("R4")
	set jsonType=$$$GetPropertyJsonType(schema,type,pname)
	//w jsonType,!
	set array=[]
	//if (jsonType="c")
	//{
	   	//获取index及可选择列
	   	set tindex=$$$GetPropertyIndex(schema,type,pname)
	   	
	    for i=1:1:$ll(@schema.TiGbl@(type, "*pn"))
	    {
		   set name=$lg(@schema.TiGbl@(type, "*pn"),i)
		   set index=$$$GetPropertyIndex(schema,type,name)
		   if (index=tindex)&&(name'=pname)
		   {
			Do array.%Push(name)   
		    }
	     }
	 //Quit array
	//}
	w array.%ToJSON(),!
	Quit $$$OK
}

ClassMethod getList(resourceType, isrequate, jType) As %Status
{
}

ClassMethod getJSON() As %Status
{
	set index={}
	set result={}
	//set rtype=%request.Data("rType",1)
	 set schema = ##class(HS.FHIRServer.Schema).LoadSchema("R4")
	 set resourceType=%request.Data("rType",1)
	 set result.resourceType=resourceType
	 	Set tPropName = $$$NextRequiredProperty(schema, resourceType, "")
	WHILE tPropName'="" {
	    set tindex=$$$GetPropertyIndex(schema, resourceType, tPropName)
	    Do index.%Set(tindex,"2")  //必要节点
		set tType= $$$GetPropertyJsonType(schema, resourceType, tPropName)
		//w tType,!
		if (tType="s")  //string
		{
			     
			     // w "123",!
			     //W $$$IsPropertyValueSet(schema,resourceType, name),!
			     if ($$$IsPropertyValueSet(schema,resourceType, tPropName)=1)
			     {
				    // w $$$NextValueInPropertyValueSet(schema,resourceType, tPropName,""),!
				    // w $$$NextValueInPropertyValueSet(schema,resourceType, name,""),!  //diyige
				     Do result.%Set(tPropName,$$$NextValueInPropertyValueSet(schema,resourceType, tPropName,""))
				     }else{Do result.%Set(tPropName,"")}
			   //  w "---",!
			 }elseif(tType="c")
			 {
				 //可选择的 
			    Do result.%Set(tPropName,"可选择")	 
		     }elseif(tType="o")
		     {
			     // w resourceType,"," ,tPropName
			      set jname=$$$GetPropertyFHIRType(schema, resourceType, tPropName)   
			      //w jname,!
			      set ob= ..getResourcrDetail(jname)
			     // w ob.%ToJSON(),!
			      //set ob={}
			     // w ..getResourcrDetail(jname)
			      //Do ob.%Set(jname,"")
			      //w $$$IsPropertyArray(schema, resourceType, tPropName)=1
			    if ($$$IsPropertyArray(schema, resourceType, tPropName)=1){
				    set ar=[]
				    Do ar.%Push(ob)
			         Do result.%Set(tPropName,ar)	 
			     }else{
				   
	  // w jname,!
	             
				     Do result.%Set(tPropName,ob)	 
				 }
		     }else{
			     Do result.%Set(tPropName,"")
			 } 
			 //w "1111",!
			Set tPropName = $$$NextRequiredProperty(schema, resourceType, tPropName)
		// See if any of the variants of this property was present		
		
	}
	set rResult={}
	set rResult.json=result
	set rResult.index=index
	w rResult.%ToJSON()
	//w $$$GetPropertyIndex(schema, resourceType, "eventUri"),!
	Quit $$$OK
}

ClassMethod test() As %Status
{
	set result={}
	
	 set schema = ##class(HS.FHIRServer.Schema).LoadSchema("R4")
	 set resourceType="Patient"
	 set result.resourceType=resourceType
	 //w $ll(@schema.TiGbl@(resourceType, "*pn"))
	 for i=1:1:$ll(@schema.TiGbl@(resourceType, "*pn"))
	 {
		 set name=$lg(@schema.TiGbl@(resourceType, "*pn"),i)
		 w $$$GetPropertyIndex(schema, resourceType, name),!
	    // w name,":",$$$GetPropertyFHIRType(schema, resourceType, name),":",$$$GetPropertyJsonType(schema, resourceType, name),":",$$$IsPropertyArray(schema, resourceType, name),":",$$$IsPropertyRequired(schema, resourceType, name),!
	     if ($$$IsPropertyRequired(schema, resourceType, name)=1)
	     {
		     
		     //w 11,!
		     if ($$$GetPropertyJsonType(schema, resourceType, name)="s")  //string
		     {
			     
			     // w "123",!
			     //W $$$IsPropertyValueSet(schema,resourceType, name),!
			     if ($$$IsPropertyValueSet(schema,resourceType, name)=1)
			     {
				    // w $$$NextValueInPropertyValueSet(schema,resourceType, name,""),!  //diyige
				     Do result.%Set(name,$$$NextValueInPropertyValueSet(schema,resourceType, name,""))}else{Do result.%Set(name,"")}
			     
			 }elseif($$$IsPropertyArray(schema, resourceType, name)=1)
			 {
			    Do result.%Set(name,[])	 
		     }else{
			     Do result.%Set(name,{})
			 }
		 }	 
     }
     w result.%ToJSON(),!
	 Quit $$$OK
}

ClassMethod getFHIRTYPE(resourceType, path) As %Status
{
	//w 11,!
	 set schema = ##class(HS.FHIRServer.Schema).LoadSchema("R4")
	 set ll=$l(path,".")
	 //w path,!
	 //w ll,!
	 for i=1:1:ll
	 {
		 if ('$ISVALIDNUM($p(path,".",i))){
		 //w resourceType,$p(path,".",i),!
		    set resourceType=$$$GetPropertyFHIRType(schema, resourceType, $p(path,".",i))
		 }
		 //w resourceType,!
	 }
	 Quit resourceType
}

ClassMethod GetResourceNameList() As %Status
{
  set result=["Account","ActivityDefinition","AdverseEvent","AllergyIntolerance","Appointment","AppointmentResponse","AuditEvent","Basic","Binary","BiologicallyDerivedProduct","BodyStructure","Bundle","CapabilityStatement","CarePlan","CareTeam","CatalogEntry","ChargeItem","ChargeItemDefinition","Claim","ClaimResponse","ClinicalImpression","CodeSystem","Communication","CommunicationRequest","CompartmentDefinition","Composition","ConceptMap","Condition","Consent","Contract","Coverage","CoverageEligibilityRequest","CoverageEligibilityResponse","DetectedIssue","Device","DeviceDefinition","DeviceMetric","DeviceRequest","DeviceUseStatement","DiagnosticReport","DocumentManifest","DocumentReference","EffectEvidenceSynthesis","Encounter","Endpoint","EnrollmentRequest","EnrollmentResponse","EpisodeOfCare","EventDefinition","Evidence","EvidenceVariable","ExampleScenario","ExplanationOfBenefit","FamilyMemberHistory","Flag","Goal","GraphDefinition","Group","GuidanceResponse","HealthcareService","ImagingStudy","Immunization","ImmunizationEvaluation","ImmunizationRecommendation","ImplementationGuide","InsurancePlan","Invoice","Library","Linkage","List","Location","Measure","MeasureReport","Media","Medication","MedicationAdministration","MedicationDispense","MedicationKnowledge","MedicationRequest","MedicationStatement","MedicinalProduct","MedicinalProductAuthorization","MedicinalProductContraindication","MedicinalProductIndication","MedicinalProductIngredient","MedicinalProductInteraction","MedicinalProductManufactured","MedicinalProductPackaged","MedicinalProductPharmaceutical","MedicinalProductUndesirableEffect","MessageDefinition","MessageHeader","MolecularSequence","NamingSystem","NutritionOrder","Observation","ObservationDefinition","OperationDefinition","OperationOutcome","Organization","OrganizationAffiliation","Patient","PaymentNotice","PaymentReconciliation","Person","PlanDefinition","Practitioner","PractitionerRole","Procedure","Provenance","Questionnaire","QuestionnaireResponse","RelatedPerson","RequestGroup","ResearchDefinition","ResearchElementDefinition","ResearchStudy","ResearchSubject","RiskAssessment","RiskEvidenceSynthesis","Rsrc","Schedule","SearchParameter","ServiceRequest","Slot","Specimen","SpecimenDefinition","StructureDefinition","StructureMap","Subscription","Substance","SubstanceNucleicAcid","SubstancePolymer","SubstanceProtein","SubstanceReferenceInformation","SubstanceSourceMaterial","SubstanceSpecification","SupplyDelivery","SupplyRequest","Task","TerminologyCapabilities","TestReport","TestScript","ValueSet","VerificationResult","VisionPrescription"]

 
  w result.%ToJSON(),!
  Quit $$$OK
}

ClassMethod getOtherName() As %Status
{
	set path=%request.Data("path",1)
	set json=%request.Data("json",1)
	
	set resourceType=%request.Data("rType",1)
	 set schema = ##class(HS.FHIRServer.Schema).LoadSchema("R4")
	if path'=""
	{
		//w "123",!
	   //set json=json.%Get(path)
	  set resourceType=..getFHIRTYPE(resourceType,path)
	   //w resourceType,!
	}
   set curren=	..getIndexList({}.%FromJSON(json),resourceType,path)
   set result=[]
  
   //set resourceType="MessageDefinition"
   //set result.resourceType=resourceType
	 //w $ll(@schema.TiGbl@(resourceType, "*pn"))
	 for i=1:1:$ll(@schema.TiGbl@(resourceType, "*pn"))
	 {
		 SET temp={}
		 set name=$lg(@schema.TiGbl@(resourceType, "*pn"),i)
		 set index=$$$GetPropertyIndex(schema, resourceType, name)
		 if (curren.%Get(index)="")||(curren.%Get(index)="0")
		 {
			 set temp.name=name
			 set temp.type=$$$GetPropertyJsonType(schema, resourceType, name)
			 ///如果type是o的话
			 
			 ///如果节点是s的话
			 
			 ///如果节点是c的话
			 
			 
			 ///其他
			 Do result.%Push(temp)
		 }
	 }
   w result.%ToJSON()
   Quit $$$OK
}

ClassMethod getIndexList(json As %DynamicObject, resourceType, path) As %DynamicArray
{
	//w 
	//w json.%ToJSON(),!
	/*if ($CLASSNAME(json) = "%Library.DynamicArray")
	{
	   set json=json.%Get((json.%Size()-1))	
	}*/
	set schema = ##class(HS.FHIRServer.Schema).LoadSchema("R4")
	set index={}
	set itor=json.%GetIterator()
	while itor.%GetNext(.key,.value)
	{
		//w 1,!
		if (key'="resourceType")
		{
			//W resourceType,",",key,!
		 set tindex=$$$GetPropertyIndex(schema, resourceType, key)
		 //w tindex,!
		 Do index.%Set(tindex,"1")
		}
		
     }
     Quit index
}

/// 获取必要节点
ClassMethod getVlist() As %Status
{
	 set schema = ##class(HS.FHIRServer.Schema).LoadSchema("R4")
	 
	 w ..getFHIRTYPE("AllergyIntolerance","onsetPeriod")
	 Quit $$$OK
}

ClassMethod getResourceValue() As %Status
{
	set name=%request.Data("name",1)
	set path=%request.Data("path",1)
   set schema = ##class(HS.FHIRServer.Schema).LoadSchema("R4")
   set resourceType=%request.Data("rType",1)
   //set name="allowedResponse"
   if (path'=""){
       set resourceType=..getFHIRTYPE(resourceType,path)
   }
  // w resourceType,!
   set type=$$$GetPropertyJsonType(schema, resourceType, name)
   //w type,!
   if type="s"
   {
	SET result=""
	w result,!   
	}elseif(type="o")
   {
	set jname=$$$GetPropertyFHIRType(schema, resourceType, name)   
	   //w jname,!
	   set ob= ..getResourcrDetail(jname)
	   if ($$$IsPropertyArray(schema, resourceType, name)=1)
	   {
		set ar=[]
		Do ar.%Push(ob)   
		w ar.%ToJSON()
		}else{
	      		w ob.%ToJSON()
		}
	  
	}elseif(type="c")
   {
	   SET result=""
	   w result,!   
	  }else{
	  SET result="" 
	  w result,!   
	}
   Quit $$$OK
   //set $lg(@schema.TiGbl@(resourceType, "*pn"),i)
}

ClassMethod getResourcrDetail(resourceType)
{
   set result={}
	
	 set schema = ##class(HS.FHIRServer.Schema).LoadSchema("R4")
	 for i=1:1:$ll(@schema.TiGbl@(resourceType, "*pn"))
	 {
		 set name=$lg(@schema.TiGbl@(resourceType, "*pn"),i)
		 if ($$$IsPropertyRequired(schema, resourceType, name)=1)
	     {
		     
		     //w 11,!
		     //w $$$GetPropertyJsonType(schema, resourceType, name),!
		     if ($$$GetPropertyJsonType(schema, resourceType, name)="s")  //string
		     {
			     
			     // w "123",!
			     //W $$$IsPropertyValueSet(schema,resourceType, name),!
			     if ($$$IsPropertyValueSet(schema,resourceType, name)=1)
			     {
				    // w $$$NextValueInPropertyValueSet(schema,resourceType, name,""),!  //diyige
				     Do result.%Set(name,$$$NextValueInPropertyValueSet(schema,resourceType, name,""))}else{Do result.%Set(name,"")}
			     
			 }elseif ($$$GetPropertyJsonType(schema, resourceType, name)="o")&&($$$IsPropertyArray(schema, resourceType, name)=1)
			 {
			    Do result.%Set(name,[])	 
		     }elseif ($$$GetPropertyJsonType(schema, resourceType, name)="o")&&($$$IsPropertyArray(schema, resourceType, name)=0){
			     Do result.%Set(name,{})
			 }else{
				 Do result.%Set(name,"")
		     }
		     ////待修改 暂时先添加为""
		 }	 
     }
    // w result.%ToJSON(),!
	// Quit $$$OK
   Quit result
}

ClassMethod getZY(resourceType) As %Status
{
	//W "---",!
	//W resourceType,!
	set schema = ##class(HS.FHIRServer.Schema).LoadSchema("R4")
   	Set tPropName = $$$NextRequiredProperty(schema, resourceType, "")
   	//W resourceType,!
	WHILE tPropName'="" {
			Set tPropName = $$$NextRequiredProperty(schema, resourceType, tPropName)
		    w tPropName,!
		    Quit
	}
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
	//w Type,",",path,",",point,!
	if (Type="ValueNotInEnumeration")||(Type="EmptyObjectOrArray")||(Type="EmptyValue"){
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
