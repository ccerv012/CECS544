import cherrypy
import json

import sys
sys.path.insert(0, 'c:\inetpub\wwwroot\CSULB\CECS544\ReusablePython')
from DB_Connection import db_CECS544

class Programs:
    # allow the cherrypy server to serve these files
    exposed = True
    @cherrypy.tools.accept(media='text/html')


    def __init__(self):
        self.dispatch = {
            'Search' : self.search_programs,
            'Add': self.add_program,
            'Delete': self.delete_program
        }

    def POST(self, params):
        # create a connection to the database
        try:
            self.CECS544_DB = db_CECS544()
            cur = self.CECS544_DB.conn.cursor()
        except:
            raise ValueError(err)

        # data structure that we will use to return values back to ajax call
        self.sendData = {'Result': '', 'Data': [], 'Error': ''}

        # load the params into a python dictionary so we can use them
        self.Params = json.loads(params)

        # call the method specified in the AJAX call
        self.dispatch[self.Params['Method']](cur)

        return json.dumps(self.sendData)

    def add_program(self, cur):
        sql = '''
        INSERT INTO PROGRAM
            (PRGM_ID, PRGM_NAME, PRGM_VERSION, PRGM_RELEASE)
        VALUES
            (:Program_ID, :Program_Name, :Program_Version, :Program_Release)
        '''

        cur.execute(sql, Program_ID=self.Params['Program_ID'], \
            Program_Name=self.Params['Program_Name'], \
            Program_Version=self.Params['Program_Version'], \
            Program_Release=self.Params['Program_Release'])
        self.CECS544_DB.conn.commit()

        self.sendData['Result']='Success'

    def update_program(self, cur):
        sql = '''
        UPDATE PROGRAM
            SET
            PRGM_ID = :Program_ID,
            PRGM_NAME = :Program_Name,
            PRGM_VERSION = :Program_Version,
            PRGM_RELEASE = :Program_Release
        WHERE
            PRGM_ID = :Program_ID
        '''

        cur.execute(sql)
        self.CECS544_DB.conn.commit()

    def delete_program(self, cur):
        sql = '''
        DELETE FROM PROGRAM
        WHERE
            PRGM_ID = :Program_ID
        '''

        cur.execute(sql, Program_ID=self.Params['Program_ID'])
        self.CECS544_DB.conn.commit()

        self.sendData['Result'] = 'Success'

    def search_programs(self, cur):
        sql = '''
        select PRGM_ID, PRGM_NAME, PRGM_VERSION, PRGM_RELEASE
        from PROGRAM
        WHERE 1=1
        '''
        bindVars = {}
        if self.Params['Program_ID'] != "":
            sql = sql + ' AND PRGM_ID = :Program_ID'
            bindVars['Program_ID'] = self.Params['Program_ID']

        if self.Params['Program_Name'] != "":
            sql = sql + ' AND PRGM_NAME = :Program_Name'
            bindVars['Program_Name'] = self.Params['Program_Name']

        if self.Params['Program_Version'] != "":
            sql = sql + ' AND PRGM_VERSION = :Program_Version'
            bindVars['Program_Version'] = self.Params['Program_Version']

        if self.Params['Program_Release'] != "":
            sql = sql + ' AND PRGM_RELEASE = :Program_Release'
            bindVars['Program_Release'] = self.Params['Program_Release']

        cur.execute(sql, bindVars) # execute the sql statement
        allRows = cur.fetchall() # get the results on the query

        # loop through the query results
        for row in allRows:
            # save the data to our strucutre we are sending back via AJAX
            self.sendData['Data'].append({
                'ID': row[0],
                'Username': row[1],
                'Name': row[2],
                'Role': row[3]
            })

        self.sendData['Result'] = 'Success'
