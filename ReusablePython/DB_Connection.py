import cx_Oracle

class db_CECS544:
    def __init__(self):

        try:
            self.conn = cx_Oracle.connect("TEST", "12345", "localhost/ORCL")
        except:
            raise ValueError("Oracle Connection Error")
	