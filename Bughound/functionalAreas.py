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
            'DropDown' : self.prgmDropDown,
            'ASCII' : self.ExportFuncAreaData_ASCII
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
        # need to figure out which prg id to add it to
        sql = '''
        select prgm_id
        from program
        where prgm_name = :Program
        and prgm_release = :ProgramRel
        and prgm_version = :ProgramVer
        '''

        cur.execute(sql, Program=self.Params['Program'], ProgramRel=self.Params['ProgramRel'], ProgramVer=self.Params['ProgramVer'])
        allRows = cur.fetchall()

        if cur.rowcount > 0:

            prgID = allRows[0][0]

            sql = '''
            INSERT INTO FUNCTIONAL_AREA
                (farea_name, prgm_id)
            VALUES
                (:name, :prgm_id)
            '''
            try:
                cur.execute(sql, name=self.Params['FunctionalArea_Name'], prgm_id=prgID)
                self.CECS544_DB.conn.commit()

            except cx_Oracle.IntegrityError as e:
                self.sendData['Result']='PK Violation'
                raise ValueError()

            self.sendData['Result'] = 'Success'
        else:
            self.sendData['Result'] = 'Invalid Program'

    def searchFunctionalArea(self,cur):
        sql = '''
        select FAREA_ID, FAREA_NAME, functional_area.prgm_id,program.prgm_name, program.prgm_release, program.prgm_version
        from FUNCTIONAL_AREA
        inner join PROGRAM
        on program.prgm_id=functional_area.prgm_id
        WHERE 1=1
        '''

        bindVars = {}
        if self.Params['Program'] != "PleaseSelect":
            sql = sql + ' AND program.prgm_name = :Program'
            bindVars['Program'] = self.Params['Program']

        sql = sql + " ORDER BY program.prgm_name, program.prgm_release, program.prgm_version, FAREA_NAME"

        cur.execute(sql, bindVars)
        allRows=cur.fetchall()

        for row in allRows:
            # save the data to our strucutre we are sending back via AJAX
            self.sendData['Data'].append({
                'FunctionalArea_ID' : row[0],
                'FuntionalAreaName': row[1],
                'Program_ID': row[2],
                'Program_Name' : row[3],
                'Program_Rel' : row[4],
                'Program_Ver' : row[5],
            })

        self.sendData['Result'] = 'Success'

    def prgmDropDown(self, cur):
        sql = '''
            SELECT PRGM_NAME
            FROM PROGRAM
            GROUP BY PRGM_NAME
            '''
        cur.execute(sql)

        allRows = cur.fetchall()

        for row in allRows:
            # save the data to our strucutre we are sending back via AJAX
            self.sendData['Data'].append({
                'Name': row[0]
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

    def ExportFuncAreaData_ASCII(self, cur):
        sql = '''
        SELECT FAREA_ID, FAREA_NAME, PRGM_ID
        FROM FUNCTIONAL_AREA
        '''

        cur.execute(sql)
        allRows = cur.fetchall()

        asciiExport = 'FAREA_ID, FAREA_NAME, PRGM_ID'
        for row in allRows:
            asciiExport = asciiExport + '\n%s\t%s\t%s' % (row[0], row[1], row[2])

        os.chdir('c:\inetpub\wwwroot\CSULB\CECS544\Bughound\Export')
        file = open("FuncAreaExport_ASCII.txt", "w")
        file.write(asciiExport)
        file.close()
        
        self.sendData['Result'] = 'Success'
        self.sendData['FileName'] = 'Export\FuncAreaExport_ASCII.txt'