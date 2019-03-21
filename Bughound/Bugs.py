import cherrypy
import json
import os
from datetime import datetime
import xml.etree.ElementTree

import sys
sys.path.insert(0, 'c:\inetpub\wwwroot\CSULB\CECS544\ReusablePython')
from DB_Connection import db_CECS544

def dateFormatter(data):
    if data==None:
        return ''
    else:
        try:
            data.date()
            return ('%d/%d/%d' % (data.month, data.day, data.year))
        except:
            return(str(data))

class Bugs:
    # allow the cherrypy server to serve these files
    exposed = True
    @cherrypy.tools.accept(media='text/html')

    def __init__(self):
        self.dispatch = {
            'Search' : self.SearchBugs,
            'Add': self.AddBug,
            'Update': self.UpdateBug,
            'Delete': self.DeleteBug,
            'PopulateBug': self.PopulateBugEditor,
            'PopulateDropdown': self.PopulateDropdown,
            'ASCII' : self.ExportBugData_ASCII,
            'XML' : self.ExportBugData_XML
        }

    def POST(self, params, fileItem=None):
        # create a connection to the database
        try:
            self.CECS544_DB = db_CECS544()
            cur = self.CECS544_DB.conn.cursor()
        except ValueError as err:
            raise ValueError(err)

        # data structure that we will use to return values back to ajax call
        self.sendData = {'Result': '', 'Data': [], 'Error': ''}

        # load the params into a python dictionary so we can use them
        self.Params = json.loads(params)
        self.FileItem = fileItem

        # call the method specified in the AJAX call
        self.dispatch[self.Params['Method']](cur)

        return json.dumps(self.sendData)

    def TransferFile(self, fileInfo, bugID, cur):
        fileName = os.path.basename(fileInfo.filename)
        filePath = 'c:\inetpub\wwwroot\CSULB\CECS544\Bughound\Attachments\%s\\' % bugID
        serverFilePath = 'Attachments\%s\\' % bugID

        # transfer the file from the client to the server
        clientFile = open(filePath + fileName, 'wb', encoding="utf-8")
        clientFile.write(fileInfo.file.read())
        clientFile.close()

        self.AddAttachment(cur, fileName, serverFilePath, bugID)

    def UploadFile(self, bugID, cur):
        try:
            # check if a folder exists already for that BugID, if not, create it
            os.chdir('c:\inetpub\wwwroot\CSULB\CECS544\Bughound\Attachments')
            if not(os.path.isdir('%s' % bugID)):
                os.mkdir('%s' % bugID)

            if self.FileCount == 1:
                self.TransferFile(self.FileItem, bugID, cur)
            elif self.FileCount > 1:
                for files in self.FileItem:
                    self.TransferFile(files, bugID, cur)
        except Exception as e:
            self.sendData['Result'] = 'Failed'
            self.sendData['Error'] = '%s' % e
            raise ValueError()

    def AddAttachment(self, cur, fileName, filePath, bugID):
        sql='''
            insert into attachments
                (attach_name, attach_location, bug_id)
            values
                (:attachName, :attachLocation, :bugID)
        '''

        cur.execute(sql, attachName=fileName, attachLocation=filePath, bugID=bugID)
        self.CECS544_DB.conn.commit()

    def AddBug(self, cur):
        #  insert record into the database
        self.Params['ReportDate'] = datetime.now()
        # self.Params['ReportBy'] = cherrypy.session.get('Employee_Info')['Name']
        self.FileCount = self.Params['fileCount']

        sql = '''
            insert into bug_reports

                (PRGM_ID, REPORT_TYPE, SEVERITY, PROB_SUMMARY, REPRODUCIBILITY, SUGGESTED_FIX, REPORTED_BY_NAME, REPORT_DATE, BUG_STATUS, REPRODUCIBILITY_STEPS)
            values
                (:ProgramID, :ReportType, :Severity, :ProblemSummary, :Reproduce, :SuggestedFix, :ReportBy, :ReportDate, 1, :ReproduceSteps)

        '''
        # delete the method key so you can pass all params without specifying each one
        del self.Params['Method']
        del self.Params['fileCount']

        cur.execute(sql, self.Params)
        self.CECS544_DB.conn.commit()

        #  retrieve the bug_id that just got entered
        sql='''
        select bug_id
        from bug_reports
            inner join(
                select max(report_date) maxReportDate
                from bug_reports
            ) maxDate
            on bug_reports.report_date = maxDate.maxReportDate
        '''

        cur.execute(sql)
        allRows = cur.fetchall()

        bugID = allRows[0][0]

        if self.FileCount > 0:
            self.UploadFile(bugID, cur)

        self.sendData['Result'] = 'Success'

    def UpdateBug(self, cur):
        if cherrypy.session.get('Employee_Info')['Permission'] > 1:
            self.FileCount = self.Params['fileCount']

            # loop through values, change PleaseSelect to Null
            for param in self.Params:
                if self.Params[param] == 'PleaseSelect' or self.Params[param] == 'None':
                    self.Params[param] = None

            sql = '''
                update bug_reports
                    set
                        BUG_ID = :BugID,
                        REPORT_TYPE = :ReportType,
                        SEVERITY = :Severity,
                        PROB_SUMMARY = :ProblemSumm,
                        REPRODUCIBILITY = :Reproduceable,
                        REPRODUCIBILITY_STEPS = :ReproduceableSteps,
                        SUGGESTED_FIX = :SuggestFix,
                        FAREA_ID = :FunctionalArea,
                        ASSIGNED_TO_ID = :AssignedTo,
                        COMMENTS = :Comments,
                        BUG_STATUS = :Status,
                        BUG_PRIORITY = :Priority,
                        RESOLUTION = :Resolution,
                        RESOLUTION_VERSION = :ResolutionVer,
                        RESOLVED_BY_ID = :ResolvedBy,
                        RESOLUTION_DATE = TO_DATE(:ResolvedDate, 'MM/DD/YYYY'),
                        TESTED_BY_ID = :ResolvedTestedBy,
                        TESTED_BY_DATE = TO_DATE(:ResolvedTestDate, 'MM/DD/YYYY'),
                        TREAT_DEFERRED = :Defer
                    where bug_id = :BugID
            '''

            # delete the method key so you can pass all params without specifying each one
            del self.Params['Method']
            del self.Params['fileCount']

            cur.execute(sql, self.Params)
            self.CECS544_DB.conn.commit()

            if self.FileCount > 0:
                self.UploadFile(self.Params['BugID'], cur)

            self.sendData['Result'] = 'Success'
        else:
            self.sendData['Result'] = 'Access Denied'

    def DeleteBug(self, cur):
        sql = '''
        DELETE FROM BUG_REPORTS
            WHERE BUG_ID = :bugID
        '''

        cur.execute(sql, bugID=self.Params['ID'])
        self.CECS544_DB.conn.commit()

        self.sendData['Result'] = 'Success'

    def SearchBugs(self, cur):
        sql = '''
        SELECT BUG_ID, PRGM_NAME, REPORT_TYPE, SEVERITY, FAREA_ID, ASSIGNED_TO_ID, BUG_STATUS, BUG_PRIORITY, RESOLUTION,  REPORTED_BY_NAME, REPORT_DATE, RESOLVED_BY_ID, PRGM_RELEASE, PRGM_VERSION
        FROM bug_reports
            inner join program
            on program.prgm_id = bug_reports.prgm_id
        WHERE 1=1
        '''

        #  need to go through each of the search fields and see if they have values
        #  if they do, we need to add them to our sql string
        bindVars = {}
        if self.Params['BugID'] != "":
            sql = sql + ' AND BUG_ID = :bugID'
            bindVars['bugID'] = self.Params['BugID']

        if self.Params['Pgm'] != "" and self.Params['Pgm'] != 'PleaseSelect':
            sql = sql + ' AND PRGM_NAME = :Pgm'
            bindVars['Pgm'] = self.Params['Pgm']

        if self.Params['PgmID'] != "" and self.Params['PgmID'] != 'PleaseSelect':
            sql = sql + ' AND program.PRGM_ID = :PgmID'
            bindVars['PgmID'] = self.Params['PgmID']

        if self.Params['ReportType'] != "" and self.Params['ReportType'] != 'PleaseSelect':
            sql = sql + ' AND REPORT_TYPE = :rptType'
            bindVars['rptType'] = self.Params['ReportType']

        if self.Params['Severity'] != "" and self.Params['Severity'] != 'PleaseSelect':
            sql = sql + ' AND SEVERITY = :severity'
            bindVars['severity'] = self.Params['Severity']

        if self.Params['FunctionalArea'] != "":
            sql = sql + ' AND FAREA_ID = :FunctionalArea'
            bindVars['FunctionalArea'] = self.Params['FunctionalArea']

        if self.Params['Assigned'] != "":
            sql = sql + ' AND ASSIGNED_TO_ID = :Assigned'
            bindVars['Assigned'] = self.Params['Assigned']

        if self.Params['Status'] != 'PleaseSelect':
            sql = sql + ' AND BUG_STATUS = :Status'
            bindVars['Status'] = self.Params['Status']

        if self.Params['Priority'] != 'PleaseSelect':
            sql = sql + ' AND BUG_PRIORITY = :Priority'
            bindVars['Priority'] = self.Params['Priority']

        if self.Params['Resolution'] != "" and self.Params['Resolution'] != 'PleaseSelect':
            sql = sql + ' AND RESOLUTION = :Resolution'
            bindVars['Resolution'] = self.Params['Resolution']

        if self.Params['ReportedBy'] != "" and self.Params['ReportedBy'] != 'PleaseSelect':
            sql = sql + ' AND REPORTED_BY_NAME = :ReportedBy'
            bindVars['ReportedBy'] = self.Params['ReportedBy']

        if self.Params['ReportDate'] != "":
            sql = sql + ' AND REPORT_DATE = TO_DATE(:ReportDate, "MM/DD/YYYY")'
            bindVars['ReportDate'] = self.Params['ReportDate']

        if self.Params['ResolvedBy'] != "" and self.Params['ResolvedBy'] != 'PleaseSelect':
            sql = sql + ' AND RESOLVED_BY_ID = :ResolvedBy'
            bindVars['ResolvedBy'] = self.Params['ResolvedBy']

        cur.execute(sql, bindVars) # execute the sql statement
        allRows = cur.fetchall() # get the results on the query

        # loop through the query results
        for row in allRows:
            # save the data to our strucutre we are sending back via AJAX
            self.sendData['Data'].append({
                'ID' : row[0],
                'Program' : '%s, %s, %s' % (row[1], row[12], row[13]),
                'ReportType' : row[2],
                'Severity' : row[3],
                'FuncArea' : row[4],
                'Assigned' : row[5],
                'Status' : row[6],
                'Priority' : row[7],
                'Resolution' : row[8],
                'ReportedBy' : row[9],
                'ReportedDate' : str(row[10]),
                'ResolvedBy' : row[11]
            })

        self.sendData['Result'] = 'Success'

    def PopulateBugEditor(self, cur):
        sql = '''
        SELECT BUG_ID, PRGM_NAME, PRGM_RELEASE, PRGM_VERSION, REPORT_TYPE, SEVERITY, PROB_SUMMARY, REPRODUCIBILITY, SUGGESTED_FIX, REPORTED_BY_NAME, REPORT_DATE, FAREA_ID, ASSIGNED_TO_ID, COMMENTS, BUG_STATUS, BUG_PRIORITY, RESOLUTION, RESOLUTION_VERSION, RESOLVED_BY_ID, RESOLUTION_DATE, TESTED_BY_ID, TESTED_BY_DATE, TREAT_DEFERRED, REPRODUCIBILITY_STEPS
        FROM bug_reports
            inner join program
            on program.prgm_id = bug_reports.prgm_id
        where bug_id = :bugID
        '''

        cur.execute(sql, bugID=self.Params['BugID']) # execute the sql statement
        allRows = cur.fetchall() # get the results on the query

        # loop through the query results
        for row in allRows:
            # save the data to our strucutre we are sending back via AJAX
            self.sendData['Data'].append({
                'ID' : row[0],
                'Program' : row[1],
                'ProgramRel' : row[2],
                'ProgramVer' : row[3],
                'ReportType' : row[4],
                'Severity' : row[5],
                'ProbSumm' : row[6],
                'Reproducable' : row[7],
                'SuggFix' : row[8],
                'ReportBy' : row[9],
                'ReportDate' : dateFormatter(row[10]),
                'FuncArea' : row[11],
                'Assigned' : row[12],
                'Comments' : row[13],
                'Status' : row[14],
                'Priority' : row[15],
                'Resolution' : row[16],
                'ResolutionVer' : row[17],
                'ResolvedBy' : row[18],
                'ResolvedDate' : dateFormatter(row[19]),
                'TestedBy' : row[20],
                'TestedDate' : dateFormatter(row[21]),
                'Deferred' : row[22],
                'ReproducSteps' : row[23]
            })

        self.GetAttachments(cur)

        self.PopulateDropdown(cur)

    def GetAttachments(self, cur):
        sql='''
            select attach_name, attach_location
            from attachments
            where bug_id = :bugID
        '''

        cur.execute(sql, bugID=self.Params['BugID'])
        allRows = cur.fetchall()

        # loop through the query results
        self.sendData['Attachments'] = []
        for row in allRows:
            # save the data to our strucutre we are sending back via AJAX
            self.sendData['Attachments'].append({
                'FileName' : row[0],
                'FileLocation' : row[1]
            })

    def PopulateDropdown(self, cur):
        self.sendData['DropdownVals'] = {}
        sql = '''
        SELECT PRGM_NAME, PRGM_RELEASE, PRGM_VERSION, PRGM_ID
        FROM PROGRAM
        '''

        cur.execute(sql)
        allRows = cur.fetchall()

        self.sendData['DropdownVals']['Programs'] = {}

        for row in allRows:
            if row[0] not in self.sendData['DropdownVals']['Programs']:
                self.sendData['DropdownVals']['Programs'][row[0]] = []
                self.sendData['DropdownVals']['Programs'][row[0]].append({
                    'Rel': row[1],
                    'Ver': row[2],
                    'ID' : row[3]
                })
            else:
                self.sendData['DropdownVals']['Programs'][row[0]].append({
                    'Rel': row[1],
                    'Ver': row[2],
                    'ID' : row[3]
                })

        self.sendData['DropdownVals']['Employees'] = []
        sql = '''
        SELECT EMP_ID, EMP_NAME
        FROM EMPLOYEE
        ORDER BY EMP_NAME ASC
        '''

        cur.execute(sql)
        allRows = cur.fetchall()

        for row in allRows:
            self.sendData['DropdownVals']['Employees'].append({'ID': row[0], 'Name': row[1]})

        self.sendData['DropdownVals']['FuncAreas'] = []
        sql = '''
        SELECT FAREA_ID, FAREA_NAME
        FROM FUNCTIONAL_AREA
            INNER JOIN (
                SELECT PRGM_ID
                FROM BUG_REPORTS
                WHERE BUG_ID LIKE :bugID
            ) GetPrgID
            ON GetPrgID.PRGM_ID = FUNCTIONAL_AREA.PRGM_ID
        ORDER BY FAREA_NAME ASC
        '''

        if 'BugID' not in self.Params:
            self.Params['BugID'] = '%%'

        cur.execute(sql, bugID=self.Params['BugID'])

        cur.execute(sql)
        allRows = cur.fetchall()

        for row in allRows:
            self.sendData['DropdownVals']['FuncAreas'].append({'ID': row[0], 'Name': row[1]})

        self.sendData['Result'] = 'Success'

    def ExportBugData_ASCII(self, cur):
        sql = '''
        SELECT bug_id, prgm_name, prgm_release, prgm_version, attach_id, report_type, severity, prob_summary, reproducibility, reproducibility_steps, suggested_fix, reported_by_name, report_date, farea_id, assigned_to_id, comments, bug_status, bug_priority, resolution, resolution_version, resolved_by_id, resolution_date, tested_by_id, tested_by_date, treat_deferred
        FROM bug_reports
            inner join program
                on program.prgm_id = bug_reports.prgm_id
        '''

        cur.execute(sql)
        allRows = cur.fetchall()

        asciiHeader = 'bug_id\tprgm_name\tprgm_release\tprgm_version\tattach_id\treport_type\tseverity\tprob_summary\treproducibility\treproducibility_steps\tsuggested_fix\treported_by_name\treport_date\tfarea_id\tassigned_to_id\tcomments\tbug_status\tbug_priority\tresolution\tresolution_version\tresolved_by_id\tresolution_date\ttested_by_id\ttested_by_date\ttreat_deferred'
        asciiExport = ''
        for row in allRows:
            asciiExport = asciiExport + '\n%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s' % (row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12], row[13], row[14], row[15], row[16], row[17], row[18], row[19], row[20], row[21], row[22], row[23], row[24])

        os.chdir('c:\inetpub\wwwroot\CSULB\CECS544\Bughound\Export')
        file = open("BugExport_ASCII.txt", "w")
        file.write(asciiHeader + asciiExport)
        file.close()

        self.sendData['Result'] = 'Success'
        self.sendData['FileName'] = 'Export\BugExport_ASCII.txt'

    def ExportBugData_XML(self, cur):
        sql = '''
        select dbms_xmlgen.getxml('select * from BUG_REPORTS') xml from dual
        '''

        cur.execute(sql)
        xml_data = str(cur.fetchone()[0])

        os.chdir('c:\inetpub\wwwroot\CSULB\CECS544\Bughound\Export')
        with open("BugExport_XML.xml", "w") as file:
            file.write(xml_data)

        # modify node names and attributes
        et = xml.etree.ElementTree.parse('BugExport_XML.xml')
        root = et.getroot()
        root.tag = "BUG_REPORTS"
        root.set("timestamp", str(datetime.now()))

        for element in root.iter("ROW"):
            element.tag = "BUG_REPORT"

        # write back to file
        et.write('BugExport_XML.xml')

        self.sendData['Result'] = 'Success'
        self.sendData['FileName'] = 'Export\BugExport_XML.xml'
