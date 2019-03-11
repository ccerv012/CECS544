CREATE TABLE EMPLOYEE (
    EMP_ID NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    EMP_NAME VARCHAR2(53),
    EMP_USERNAME VARCHAR2(20),
    EMP_PASSWORD VARCHAR2(50),
    EMP_ROLE NUMBER,
    CONSTRAINT EMPLOYEE_PK PRIMARY KEY(EMP_ID,EMP_USERNAME)    
);

CREATE TABLE PROGRAM (
    PRGM_ID NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    PRGM_NAME VARCHAR2(80),
    PRGM_VERSION NUMBER,
    PRGM_RELEASE NUMBER,
    CONSTRAINT PROGRAM_PK PRIMARY KEY(PRGM_ID,PRGM_NAME,PRGM_RELEASE,PRGM_VERSION)
);

CREATE TABLE FUNCTIONAL_AREA (
    FAREA_ID NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    FAREA_NAME VARCHAR2(80),
    PRGM_ID NUMBER,
    CONSTRAINT FUNCTIONAL_AREA_PK PRIMARY KEY(FAREA_ID, FAREA_NAME, PRGM_ID)
);

CREATE TABLE ATTACHMENTS (
    ATTACH_ID NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    ATTACH_NAME VARCHAR2(80),
    ATTACH_LOCATION VARCHAR2(80),
    BUG_ID NUMBER,
    CONSTRAINT ATTACHMENTS_PK PRIMARY KEY(ATTACH_ID)
);

CREATE TABLE BUG_REPORTS (
    BUG_ID NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    PRGM_NAME VARCHAR2(80),
	PRGM_RELEASE NUMBER,
    PRGM_VERSION NUMBER,
    ATTACH_ID NUMBER,  
    REPORT_TYPE NUMBER,
    SEVERITY NUMBER,
    PROB_SUMMARY VARCHAR2(500),
    REPRODUCIBILITY VARCHAR2(1),
    SUGGESTED_FIX VARCHAR2(500),
    REPORTED_BY_ID NUMBER,
    REPORT_DATE DATE,
    FAREA_ID NUMBER,
    ASSIGNED_TO_ID NUMBER, 
    COMMENTS VARCHAR2(500),
    BUG_STATUS NUMBER,
    BUG_PRIORITY VARCHAR2(15),
    RESOLUTION VARCHAR2(500),
    RESOLUTION_VERSION NUMBER,
    RESOLVED_BY_ID NUMBER,
    RESOLUTION_DATE DATE,
    TESTED_BY_ID NUMBER,
    TESTED_BY_DATE DATE,
    TREAT_DEFERRED VARCHAR2(1),
    CONSTRAINT BUG_REPORTS_PK PRIMARY KEY(BUG_ID)
);