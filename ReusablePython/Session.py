import json
import cherrypy

class Session:
    exposed = True
    @cherrypy.tools.accept(media='text/html')

    def POST(self):

        return json.dumps(cherrypy.session.get('Employee_Info'))