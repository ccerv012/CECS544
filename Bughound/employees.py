import cherrypy
import json
import cx_Oracle
from datetime import datetime
import xml.etree.ElementTree
import os

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
            'Delete': self.delete_employee,
            'Populate' : self.populate_employees,
            'Update' : self.update_employee,
            'ASCII' : self.ExportEmployeeData_ASCII,
            'XML' : self.ExportEmployeeData_XML
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
        except:
            return json.dumps(self.sendData)

    def add_employee(self, cur):
        sql = '''
        INSERT INTO EMPLOYEE
            (emp_name, emp_username, emp_password, emp_role)
        VALUES
            (:Employee_Name, :Employee_Username, :Employee_Password, :Employee_Role)
        '''

        try:
            cur.execute(sql, Employee_Name=self.Params['Employee_Name'], Employee_Username=self.Params['Employee_Username'], Employee_Password=self.Params['Employee_Password'], Employee_Role=self.Params['Employee_Role'])
            self.CECS544_DB.conn.commit()

        except cx_Oracle.IntegrityError as e:
            self.sendData['Result']='PK Violation'
            raise ValueError()

        self.sendData['Result']='Success'

    def update_employee(self, cur):
        sql = '''
        UPDATE EMPLOYEE
            SET
            emp_username = :username,
            emp_name = :name,
            emp_password = :password,
            emp_role = :role
        WHERE
            emp_id = :id
        '''

        cur.execute(sql, username=self.Params['emp_username'], name=self.Params['emp_name'], password=self.Params['emp_password'], role=self.Params['emp_role'], id=self.Params['emp_id'])
        self.CECS544_DB.conn.commit()

        self.sendData['Result'] = 'Success'

    def delete_employee(self, cur):
        sql = '''
        DELETE FROM EMPLOYEE
        WHERE
            emp_id = :id
        '''

        cur.execute(sql, id=self.Params['EmpID'])
        self.CECS544_DB.conn.commit()

        self.sendData['Result'] = 'Success'

    def search_employees(self, cur):
        sql = '''
        select EMP_ID, EMP_USERNAME, EMP_NAME, EMP_ROLE
        from EMPLOYEE
        WHERE 1=1
        '''
        bindVars = {}
        if self.Params['Employee_ID'] != "":
            sql = sql + ' AND EMP_ID = :Employee_ID'
            bindVars['Employee_ID'] = self.Params['Employee_ID']

        if self.Params['Employee_Username'] != "":
            sql = sql + ' AND EMP_USERNAME = :Employee_Username'
            bindVars['Employee_Username'] = self.Params['Employee_Username']

        if self.Params['Employee_Name'] != "":
            sql = sql + ' AND EMP_NAME = :Employee_Name'
            bindVars['Employee_Name'] = self.Params['Employee_Name']

        if self.Params['Employee_Role'] != "PleaseSelect":
            sql = sql + ' AND EMP_ROLE = :Employee_Role'
            bindVars['Employee_Role'] = self.Params['Employee_Role']

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

    def populate_employees(self, cur):
        sql = '''
        select EMP_ID, EMP_USERNAME, EMP_NAME, EMP_ROLE, EMP_PASSWORD
        from EMPLOYEE
        WHERE EMP_ID=:emp_id
        '''

        cur.execute(sql,emp_id=self.Params['emp_id'])
        allRows = cur.fetchall()

        for row in allRows:
            self.sendData['Data'].append({
                'ID': row[0],
                'Username' : row[1],
                'Name' : row[2],
                'Role' : row[3],
                'Password' : row[4]
            })

        self.sendData['Result'] = 'Success'

    def ExportEmployeeData_ASCII(self, cur):
        sql = '''
        SELECT EMP_ID, EMP_NAME, EMP_USERNAME, EMP_PASSWORD,  EMP_ROLE
        FROM EMPLOYEE
        '''

        cur.execute(sql)
        allRows = cur.fetchall()

        asciiExport = 'EMP_ID, EMP_NAME, EMP_USERNAME, EMP_PASSWORD,  EMP_ROLE'
        for row in allRows:
            asciiExport = asciiExport + '\n%s\t%s\t%s\t%s\t%s' % (row[0], row[1], row[2], row[3], row[4])

        os.chdir('c:\inetpub\wwwroot\CSULB\CECS544\Bughound\Export')
        file = open("EmployeeExport_ASCII.txt", "w")
        file.write(asciiExport)
        file.close()

        self.sendData['Result'] = 'Success'
        self.sendData['FileName'] = 'Export\EmployeeExport_ASCII.txt'

    def ExportEmployeeData_XML(self, cur):
        sql = '''
        select dbms_xmlgen.getxml('select * from EMPLOYEE') xml from dual
        '''

        cur.execute(sql)
        xml_data = str(cur.fetchone()[0])

        os.chdir('c:\inetpub\wwwroot\CSULB\CECS544\Bughound\Export')
        with open("EmployeeExport_XML.xml", "w") as file:
            file.write(xml_data)

        # add timestamp as attribute of root
        et = xml.etree.ElementTree.parse('EmployeeExport_XML.xml')
        root = et.getroot()
        root.tag = "EMPLOYEES"
        root.set("timestamp", str(datetime.now()))

        for element in root.iter("ROW"):
            element.tag = "EMPLOYEE"

        # write back to file
        et.write('EmployeeExport_XML.xml')

        self.sendData['Result'] = 'Success'
        self.sendData['FileName'] = 'Export\EmployeeExport_XML.xml'
