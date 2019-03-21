import cherrypy
import json
import cx_Oracle
import os

import sys
sys.path.insert(0, 'c:\inetpub\wwwroot\CSULB\CECS544\ReusablePython')
from DB_Connection import db_CECS544

class Programs:
    # allow the cherrypy server to serve these files
    exposed = True
    @cherrypy.tools.accept(media='text/html')


    def __init__(self):
        self.dispatch = {
            'Search' : self.search_program,
            'Add': self.add_program,
            'Delete': self.delete_program,
            'Populate' : self.populate_program,
            'Update' : self.update_program,
            'ASCII' : self.ExportProgramData_ASCII
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

        try:
            # call the method specified in the AJAX call
            self.dispatch[self.Params['Method']](cur)

            return json.dumps(self.sendData)
        except ValueError as err:
            return json.dumps(self.sendData)

    def add_program(self, cur):
        sql = '''
        INSERT INTO PROGRAM
            (PRGM_NAME, PRGM_VERSION, PRGM_RELEASE)
        VALUES
            (:Program_Name, :Program_Version, :Program_Release)
        '''

        try:
            cur.execute(sql, Program_Name=self.Params['Program_Name'], \
                        Program_Version=self.Params['Program_Version'], \
                        Program_Release=self.Params['Program_Release'])
            self.CECS544_DB.conn.commit()

        except cx_Oracle.IntegrityError as e:
            self.sendData['Result']='PK Violation'
            raise ValueError()

        self.sendData['Result']='Success'

    def search_program(self, cur):
        sql = '''
            select *
            from PROGRAM
            WHERE 1=1
        '''

        bind_vars = {}

        if self.Params['Program_Name'] != "":
            sql = sql + ' AND PRGM_NAME = :Program_Name'
            bind_vars['Program_Name'] = self.Params['Program_Name']
        if self.Params['Program_Version'] != "":
            sql = sql + ' AND PRGM_VERSION = :Program_Version'
            bind_vars['Program_Version'] = self.Params['Program_Version']
        if self.Params['Program_Release'] != "":
            sql = sql + ' AND PRGM_RELEASE = :Program_Release'
            bind_vars['Program_Release'] = self.Params['Program_Release']
        sql = sql + ' order by PRGM_NAME, PRGM_RELEASE, PRGM_VERSION'
        cur.execute(sql, bind_vars) # execute the sql statement
        allRows = cur.fetchall() # get the results on the query

        # loop through the query results
        for row in allRows:
            # save the data to our strucutre we are sending back via AJAX
            self.sendData['Data'].append({
                'Prgm_ID': row[0],
                'Prgm_Name': row[1],
                'Version': row[2],
                'Release': row[3],
            })

        self.sendData['Result'] = 'Success'


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

        cur.execute(sql, Program_ID=self.Params['Program_ID'], \
            Program_Name=self.Params['Program_Name'], \
            Program_Version=self.Params['Program_Version'], \
            Program_Release=self.Params['Program_Release'])
        self.CECS544_DB.conn.commit()

        self.sendData['Result']='Success'

    def delete_program(self, cur):
        sql = '''
            DELETE FROM PROGRAM
            WHERE
                PRGM_ID = :Program_ID
        '''

        cur.execute(sql, Program_ID=self.Params['Program_ID'])
        self.CECS544_DB.conn.commit()

        self.sendData['Result'] = 'Success'


    def populate_program(self, cur):
        sql = '''
        select PRGM_ID, PRGM_NAME, PRGM_VERSION, PRGM_RELEASE
        from PROGRAM
        WHERE PRGM_ID = :Program_ID
        '''

        cur.execute(sql,Program_ID=self.Params['Program_ID'])
        allRows = cur.fetchall()

        for row in allRows:
            self.sendData['Data'].append({
                'Prgm_ID': row[0],
                'Prgm_Name' : row[1],
                'Version' : row[2],
                'Release' : row[3]
            })

        self.sendData['Result'] = 'Success'

    def ExportProgramData_ASCII(self, cur):
        sql = '''
        SELECT PRGM_ID, PRGM_NAME, PRGM_VERSION, PRGM_RELEASE
        FROM PROGRAM
        '''

        cur.execute(sql)
        allRows = cur.fetchall()

        asciiHeader = 'PRGM_ID\tPRGM_NAME\tPRGM_VERSION\tPRGM_RELEASE'
        asciiExport = ''
        for row in allRows:
            asciiExport = asciiExport + '\n%s\t%s\t%s\t%s' % (row[0], row[1], row[2], row[3])

        os.chdir('c:\inetpub\wwwroot\CSULB\CECS544\Bughound\Export')
        file = open("ProgramExport_ASCII.txt", "w")
        file.write(asciiHeader+asciiExport)
        file.close()
        
        self.sendData['Result'] = 'Success'
        self.sendData['FileName'] = 'Export\ProgramExport_ASCII.txt'