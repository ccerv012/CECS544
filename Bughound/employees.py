class employees:
    def POST(self):
        return "hello world"

    def add_employee(self):
        sql = '''
        INSERT INTO EMPLOYEE
            (emp_name, emp_username, emp_password, emp_role)
        VALUES
            ('Jane Doe', 'jdoe', 'Password1', 2)
        '''

        cur.execute(sql,self.Params)
        conn.commit()

    def update_employee(self):
        sql = '''
        UPDATE EMPLOYEE
            SET 
            emp_name = :name, 
            emp_password = :password,
            emp_role = :role
        WHERE
            emp_id = :id
        '''

        cur.execute(sql,self.Params)
        conn.commit()
    
    def delete_employee(self):
        sql = '''
        DELETE FROM EMPLOYEE
        WHERE
            emp_id = :id
        '''

        cur.execute(sql,self.Params)
        conn.commit()

    def search_employees(self):
        sql = '''
        select EMP_ID, EMP_USERNAME, EMP_NAME, EMP_ROLE 
        from EMPLOYEE 
        '''

        cur.execute(sql)