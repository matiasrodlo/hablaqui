import pdf from 'html-pdf'
import { logError } from '../../config/pino'

const htmlPdfConfig = {
  height: '11.25in',
  width: '8.5in',
  header: {
    height: '20mm',
  },
  footer: {
    height: '20mm',
  },
}

export const createPdfWithStreamAndSendResponse = (data, res) => {
  pdf.create(data, htmlPdfConfig).toStream(function(err, stream) {
    if (err) {
      logError(err)
      res.sendStatus(400)
    } else {
      res.header('Content-type', 'application/pdf')

      stream.pipe(res)
    }
  })
}
