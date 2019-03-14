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
            'Add': self.add_program,
            'Update': self.update_program,
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

    # TODO: check if exists
    # TODO: disallow duplicates
    def add_program(self, cur):
        # check if it exists first
        #sql =

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

    # TODO: check if exists
    # TODO: as long as ID exists, make it so you can change just one field and the others persist
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
        SELECT * FROM PROGRAM
        WHERE
            PRGM_ID = :Program_ID
        '''

        cur.execute(sql, Program_ID=self.Params['Program_ID'])
        rs = cur.fetchall()
        # rowcount can be -1 if count is indeterminate for whatever reason
        if cur.rowcount <= 0:
            self.sendData['Result'] = 'Does Not Exist'
            self.sendData['Error'] = 'Program ID ' + str(self.Params['Program_ID']) \
                                        + ' does not exist'
        else:
            sql = '''
            DELETE FROM PROGRAM
            WHERE
                PRGM_ID = :Program_ID
            '''

            cur.execute(sql, Program_ID=self.Params['Program_ID'])
            self.CECS544_DB.conn.commit()

            if cur.rowcount > 0:
                self.sendData['Data'].append(self.Params['Program_ID'])
                self.sendData['Result'] = 'Success'
            else:
                self.sendData['Result'] = 'Could Not Delete'
                self.sendData['Error'] = 'Error: ID ' + str(self.Params['Program_ID']) \
                                        + ' exists, but it could not be deleted.'

    def ID_exists(self, program_id):
        sql = '''
            SELECT * FROM PROGRAM
            WHERE
                PRGM_ID = :Program_ID
        '''

        cur.execute(sql, Program_ID=self.Params['Program_ID'])
        rs = cur.fetchall()

        return rs
