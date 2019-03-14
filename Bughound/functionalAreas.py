import cherrypy
import json
import cx_Oracle

import sys
sys.path.insert(0, 'c:\inetpub\wwwroot\CSULB\CECS544\ReusablePython')
from DB_Connection import db_CECS544

class functionalAreas:
     # allow the cherrypy server to serve these files
    exposed = True
    @cherrypy.tools.accept(media='text/html')


    def __init__(self):
        self.dispatch = {
            'Search' : self.searchFunctionalArea,
            'Add': self.addFuntionalArea,
            'Delete': self.deleteFunctionalArea,
            'Populate' : self.populateFunctionalArea,
            'Update' : self.updateFunctionalArea,
            'DropDown' : self.prgmDropDown
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


    def addFuntionalArea(self, cur):
        sql = '''
        INSERT INTO FUNCTIONAL_AREA
            (farea_name, prgm_id)
        VALUES
            (:name, :prgm_id)
        '''
        try:
            cur.execute(sql, name=self.Params['FunctionalArea_Name'], prgm_id=self.Params['Program'])
            self.CECS544_DB.conn.commit()

        except cx_Oracle.IntegrityError as e:
            self.sendData['Result']='PK Violation'
            raise ValueError()

        self.sendData['Result'] = 'Success'

    def searchFunctionalArea(self,cur):
        sql = '''
        select FAREA_ID, FAREA_NAME, functional_area.prgm_id,program.prgm_name
        from FUNCTIONAL_AREA
        inner join PROGRAM
        on program.prgm_id=functional_area.prgm_id
        WHERE 1=1
        '''

        bindVars = {}
        if self.Params['Program'] != "PleaseSelect":
            sql = sql + ' AND functional_area.prgm_id = :Program'
            bindVars['Program'] = self.Params['Program']

        sql = sql + " ORDER BY program.prgm_name, FAREA_NAME"

        cur.execute(sql, bindVars)
        allRows=cur.fetchall()

        for row in allRows:
            # save the data to our strucutre we are sending back via AJAX
            self.sendData['Data'].append({
                'FunctionalArea_ID' : row[0],
                'FuntionalAreaName': row[1],
                'Program_ID': row[2],
                'Program_Name' : row[3],
            })

        self.sendData['Result'] = 'Success'

    def prgmDropDown(self, cur):
        sql = '''
            SELECT PRGM_ID, PRGM_NAME
            FROM PROGRAM
            '''
        cur.execute(sql)

        allRows = cur.fetchall()

        for row in allRows:
            # save the data to our strucutre we are sending back via AJAX
            self.sendData['Data'].append({
                'ID': row[0],
                'Name': row[1]
            })

        self.sendData['Result'] = 'Success'

    def deleteFunctionalArea(self, cur):
        sql = '''
        DELETE FROM FUNCTIONAL_AREA
        WHERE FAREA_ID=:FunctionaArea_ID
        '''

        cur.execute(sql, FunctionaArea_ID=self.Params['FunctionaArea_ID'])
        self.CECS544_DB.conn.commit()

        self.sendData['Result'] = 'Success'

    def populateFunctionalArea(self, cur):
        sql = '''
        select FAREA_ID, FAREA_NAME, functional_area.prgm_id,program.prgm_name
        from FUNCTIONAL_AREA
        inner join PROGRAM
        on program.prgm_id=functional_area.prgm_id
        WHERE farea_id=:FunctionalArea_ID
        '''

        cur.execute(sql, FunctionalArea_ID=self.Params['FunctionalArea_ID'])
        allRows=cur.fetchall()

        for row in allRows:
            # save the data to our strucutre we are sending back via AJAX
            self.sendData['Data'].append({
                'FunctionalArea_ID' : row[0],
                'FuntionalAreaName': row[1],
                'Program_ID': row[2],
                'Program_Name' : row[3],
            })

        self.sendData['Result'] = 'Success'

    def updateFunctionalArea(self, cur):
        sql = '''
        UPDATE FUNCTIONAL_AREA
            SET
            farea_name = :name
        WHERE
            farea_id = :id
        '''

        cur.execute(sql, name=self.Params['FunctionalArea_Name'], id=self.Params['FunctionalArea_ID'])
        self.CECS544_DB.conn.commit()

        self.sendData['Result'] = 'Success'
