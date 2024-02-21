ARG ARG IMAGE=intersystemsdc/irishealth-community
FROM $IMAGE as builder


#WORKDIR /home/irisowner/irisdev
WORKDIR /opt/fhirmessageverification
USER ${ISC_PACKAGE_MGRUSER}

COPY --chown=${ISC_PACKAGE_MGRUSER}:${ISC_PACKAGE_IRISGROUP} iris.script iris.script
COPY --chown=${ISC_PACKAGE_MGRUSER}:${ISC_PACKAGE_IRISGROUP} src src
COPY --chown=${ISC_PACKAGE_MGRUSER}:${ISC_PACKAGE_IRISGROUP} csp csp
COPY --chown=${ISC_PACKAGE_MGRUSER}:${ISC_PACKAGE_IRISGROUP} module.xml module.xml
# run iris and initial 
RUN iris start IRIS \
	&& iris session IRIS < iris.script \
    && iris stop IRIS quietly

    

