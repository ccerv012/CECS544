import cherrypy
import win32serviceutil
import win32service

import os, os.path
import json
import sys
import time

sys.path.insert(0, 'c:\inetpub\wwwroot\CSULB\CECS544\Bughound')
from employees import employees
from Bugs import Bugs
from Programs import Programs
from functionalAreas import functionalAreas

sys.path.insert(0, 'c:\inetpub\wwwroot\CSULB\CECS544\ReusablePython')
from Login import Login
from Session import Session

CSULB_ROOT = "C:\inetpub\wwwroot\CSULB\CECS544"

class Bughound:
	@cherrypy.expose
	def index(self):
		return open(CSULB_ROOT+'\Bughound\Home.html')

class ReusablePython:
	@cherrypy.expose
	def index(self):
		return open(CSULB_ROOT+'\ReusablePython\Login.html')

class CSULB:
	@cherrypy.expose
	def index(self):
		return "CSULB Projects"

	Bughound = Bughound()
	ReusablePython = ReusablePython()

class CSULBWinService(win32serviceutil.ServiceFramework):
	"""NT Service."""

	_svc_name_ = "CSULBWinService"
	_svc_display_name_ = "CSULB Windows Service (CherryPy)"

	@cherrypy.tools.etags(autotags=True)

	def SvcDoRun(self):

		cherrypy.tree.mount(CSULB(), '/', {
			'/':{
				'tools.staticdir.root': os.path.abspath(CSULB_ROOT)
			},
			'/ReusableJavascript':{
				'tools.staticdir.on': True,
				'tools.staticdir.dir': 'ReusableJavascript',
				'tools.expires.on': True,
				'tools.expires.secs': 60
			},
			'/ReusableGraphics':{
				'tools.staticdir.on': True,
				'tools.staticdir.dir': 'ReusableGraphics',
				'tools.expires.on': True,
				'tools.expires.secs': 60
			},
			'/ReusablePython/Login':{
				'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
				'tools.response_headers.on': True,
				'tools.response_header.headers': [('Content-Type', 'text/json')],
			},
			'/ReusablePython/Session':{
				'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
				'tools.response_headers.on': True,
				'tools.response_header.headers': [('Content-Type', 'text/json')],
			},
			'/Bughound':{
				'tools.staticdir.on': True,
				'tools.staticdir.dir': 'Bughound',
				'tools.expires.on': True,
				'tools.expires.secs': 60
			},
			'/Bughound/employees':{
				'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
				'tools.response_headers.on': True,
				'tools.response_header.headers': [('Content-Type', 'text/json')],
			},
			'/Bughound/Bugs':{
				'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
				'tools.response_headers.on': True,
				'tools.response_header.headers': [('Content-Type', 'text/json')],
			},
			'/Bughound/Programs':{
				'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
				'tools.response_headers.on': True,
				'tools.response_header.headers': [('Content-Type', 'text/json')],
			},
			'/Bughound/functionalAreas':{
				'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
				'tools.response_headers.on': True,
				'tools.response_header.headers': [('Content-Type', 'text/json')],
			},
		})

		cherrypy.config.update ({
			'global': {
				'log.screen': False,
				'server.socket_host': '127.0.0.1',
				'server.socket_port': 8081,
				# 'server.max_request_body_size': 0,
				'engine.autoreload.on': False,
				'engine.SIGHUP' : None,
				'engine.SIGTERM' : None,
				# 'engine.timeout_monitor.frequency': 60*20,
				'log.error_file': r'C:\inetpub\CherryPy\CherryPy_Errors.log',
				'log.access_file': r'C:\inetpub\CherryPy\CherryPy_Access.log',
				'tools.sessions.on': True,
				'tools.sessions.storage_type': 'ram'
			},
		})

		webapp = CSULB()

		webapp.ReusablePython.Login = Login()
		webapp.ReusablePython.Session = Session()

		webapp.Bughound.employees = employees()
		webapp.Bughound.Bugs = Bugs()
		webapp.Bughound.Programs = Programs()
		webapp.Bughound.functionalAreas = functionalAreas()

		cherrypy.engine.start()
		cherrypy.engine.block()

	def SvcStop(self):
		self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
		cherrypy.engine.exit()

		self.ReportServiceStatus(win32service.SERVICE_STOPPED)

if __name__ == '__main__':
	win32serviceutil.HandleCommandLine(CSULBWinService)
