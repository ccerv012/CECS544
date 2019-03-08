import os
import sys
import json
import cherrypy

from DB_Connection import db_CECS544

class Login:
    exposed = True
    @cherrypy.tools.accept(media='text/html')

    def AuthenticateEmployee(self, cur):
        # sql statement used to check if employee and password match a record in the table
        sql = '''
            select EMP_ID, EMP_USERNAME, EMP_NAME, EMP_ROLE 
            from EMPLOYEE 
            where EMP_USERNAME = '%s'
            and EMP_PASSWORD = '%s'
        ''' %(self.Params['Username'], self.Params['Password'])

        # execute the sql statement passing in the sql and the binding values
        cur.execute(sql)

        # now that the sql was executed, store the results into a variable
        allRows = cur.fetchall()

        # check if a matching record was returned
        if cur.rowcount > 0:
            # loop through the results and save the data into our python object ued for the AJAX call
            for row in allRows:
                self.sendData['Data'] = {
                    'EmployeeName': row[2].split()[0]
                }

                # create a session variable for the user and store information about the user
                cherrypy.session['Employee_Info'] = {
                    'Employee_ID': row[0],
                    'Username': row[1],
                    'Name': row[2],
                    'Permission': int(row[3])
                }

            # change the status of the AJAX call to Success
            self.sendData['Result'] = 'Success'
            
        else:
            self.sendData['Result'] = 'Failed'
            self.sendData['Error'] = sql

    def POST(self, parameters):
        try:
            self.CECS544_DB = db_CECS544()
            cur = self.CECS544_DB.conn.cursor()
        except ValueError as err:
            raise ValueError(err)

        # create an object to send back to the AJAX call
        self.sendData = {'Result': '', 'Data': {}, 'Error': ''}

        # read the AJAX object and store it into a python object
        self.Params = json.loads(parameters) # json.loads reconverts the data, remember we called json.stringify in the javascript

        # call method to authenticate the user, only need to pass the cur so a database call can be made, the parameters are a class variables that can be accessed by self.xxx
        self.AuthenticateEmployee(cur)

        return json.dumps(self.sendData)