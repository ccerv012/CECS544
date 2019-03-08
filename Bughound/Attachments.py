import os.path

class Attachments:
    exposed = True;
    @cherrypy.tools.accept(media='text/html')

    def POST(self, params, fileItem):

        self.Params = json.loads(params)
        self.FileItem = fileItem

        self.UploadFile()

    def TransferFile(self, fileInfo):
        fileName = os.path.basename(fileInfo.filename)
        filePath = 'serverpathhere' + fileName

        # transfer the file from the client to the server
        clientFile = oen(filePath, 'wb')
        clientFile.write(fileInfo.file.read())
        clientFile.close()

    def UploadFile(self):
        try:
            if int(self.Params['FileCount']) == 1:
                self.TransferFile(self.FileItem)
            elif int(self.Params['FileCount']) > 1:
                for files in self.FileItem:
                    self.TransferFile(files)
        except:
            self.sendData['Result'] = 'Failed'
            self.sendData['Error'] = '%s' % e 
            raise ValueError()