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
            'Add': self.AddBugs,
            'Update': self.UpdateBugs,
            'Delete': self.DeleteBugs,
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

    def AddBugs(self, cur):
        sql = '''
        '''

        cur.execute(sql,self.Params)
        self.CECS544_DB.conn.commit()

        self.sendData['Result'] = 'Success'

    def UpdateBugs(self, cur):
        sql = '''
        '''

        cur.execute(sql)
        self.CECS544_DB.conn.commit()

        self.sendData['Result'] = 'Success'
    
    def DeleteBugs(self, cur):
        sql = '''
        '''

        cur.execute(sql, id=self.Params['EmpID'])
        self.CECS544_DB.conn.commit()

        self.sendData['Result'] = 'Success'

    def SearchBugs(self, cur):
        sql = '''
        SELECT bug_id, prgm_id, report_type, severity
        FROM bug_reports
        '''

        cur.execute(sql) # execute the sql statement
        allRows = cur.fetchall() # get the results on the query

        # loop through the query results
        for row in allRows:
            # save the data to our strucutre we are sending back via AJAX
            self.sendData['Data'].append({
                'ID' : row[0],
                'Program' : row[0],
                'ReportType' : row[0],
                'Severity' : row[0]
            })

        self.sendData['Result'] = 'Success'