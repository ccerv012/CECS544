import cherrypy
import json

import sys
sys.path.insert(0, 'c:\inetpub\wwwroot\CSULB\CECS544\ReusablePython')
from DB_Connection import db_CECS544

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
        }
    
    def POST(self, params):
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

        # call the method specified in the AJAX call
        self.dispatch[self.Params['Method']](cur)

        return json.dumps(self.sendData)

    def AddBug(self, cur):
        sql = '''
            insert into bug_reports
                (report_type, severity)
            values 
                (:rptType, :severity)
        '''

        cur.execute(sql, rptType=self.Params['RptType'], severity=self.Params['Severity'])
        self.CECS544_DB.conn.commit()

        self.sendData['Result'] = 'Success'

    def UpdateBug(self, cur):
        sql = '''
            update bug_reports
                set 
                    report_type = :rptType,
                    severity = :severity
                where bug_id = :bugID

        '''

        cur.execute(sql, rptType=self.Params['ReportType'], severity=self.Params['Severity'], bugID=self.Params['BugID'])
        self.CECS544_DB.conn.commit()

        self.sendData['Result'] = 'Success'
    
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
        SELECT bug_id, prgm_id, report_type, severity
        FROM bug_reports
        WHERE 1=1
        '''

        #  need to go through each of the search fields and see if they have values
        #  if they do, we need to add them to our sql string
        bindVars = {}
        if self.Params['BugID'] != "":
            sql = sql + ' AND BUG_ID = :bugID'
            bindVars['bugID'] = self.Params['BugID']

        if self.Params['ReportType'] != "":
            sql = sql + ' AND REPORT_TYPE = :rptType'
            bindVars['rptType'] = self.Params['ReportType']

        if self.Params['Severity'] != "":
            sql = sql + ' AND SEVERITY = :severity'
            bindVars['severity'] = self.Params['Severity']

        cur.execute(sql, bindVars) # execute the sql statement
        allRows = cur.fetchall() # get the results on the query

        # loop through the query results
        for row in allRows:
            # save the data to our strucutre we are sending back via AJAX
            self.sendData['Data'].append({
                'ID' : row[0],
                'Program' : row[1],
                'ReportType' : row[2],
                'Severity' : row[3]
            })

        self.sendData['Result'] = 'Success'

    def PopulateBugEditor(self, cur):
        sql = '''
        SELECT bug_id, prgm_id, report_type, severity
        FROM bug_reports
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
                'ReportType' : row[2],
                'Severity' : row[3]
            })

        self.sendData['Result'] = 'Success'