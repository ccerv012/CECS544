import cherrypy
import json

import sys
sys.path.insert(0, 'c:\inetpub\wwwroot\CSULB\CECS544\ReusablePython')
from DB_Connection import db_CECS544

class employees:
    # allow the cherrypy server to serve these files
    exposed = True
    @cherrypy.tools.accept(media='text/html')


    def __init__(self):
        self.dispatch = {
            'Search' : self.search_employees,
            'Add': self.add_employee,
            'Delete': self.delete_employee
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

    def add_employee(self, cur):
        sql = '''
        INSERT INTO EMPLOYEE
            (emp_name, emp_username, emp_password, emp_role)
        VALUES
            ('Jane Doe', 'jdoe', 'Password1', 2)
        '''

        cur.execute(sql,self.Params)
        self.CECS544_DB.conn.commit()

    def update_employee(self, cur):
        sql = '''
        UPDATE EMPLOYEE
            SET 
            emp_name = :name, 
            emp_password = :password,
            emp_role = :role
        WHERE
            emp_id = :id
        '''

        cur.execute(sql)
        self.CECS544_DB.conn.commit()
    
    def delete_employee(self, cur):
        sql = '''
        DELETE FROM EMPLOYEE
        WHERE
            emp_id = :id
        '''

        cur.execute(sql, id=self.Params['EmpID'])
        self.CECS544_DB.conn.commit()

    def search_employees(self, cur):
        sql = '''
        select EMP_ID, EMP_USERNAME, EMP_NAME, EMP_ROLE 
        from EMPLOYEE 
        '''

        cur.execute(sql) # execute the sql statement
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