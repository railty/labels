'use strict'
const Doc = use('App/Models/Doc');

class DocController {
    async index({view}) {
        const docs = await Doc.all();
        return view.render('doc.index', { docs: docs.rows })
    }    

    async show({request, response, view}) {
        let id = request.params.id;
        let doc = await Doc.findOrFail(docId);
        return view.render('doc.show', { doc: doc })
    }    

    async edit({request, response, view}) {
        let docId = request.params.id;
        let doc = await Doc.findOrFail(docId);
        return view.render('doc.edit', { doc: doc })
    }    

    async save({request, response}) {
        let name = request.body.name;
        let doc = new Doc();
        doc.name = name;
        await doc.save()
        response.send(JSON.stringify({id: doc.id}));
    }    

    async s2p({request, response, view}) {
        const PDFDocument = require('pdfkit');
        const SVGtoPDF = require('svg-to-pdfkit');

        let filename = request.body.filename;
        let svg = request.body.svg;
        let mode = request.body.mode;

        response.implicitEnd = false

        response.header('Content-type', 'application/pdf');
        if (mode == 'inline') {
            response.header('Content-Disposition', `inline`);
        }
        else{
            response.header('Content-Disposition', `attachment; filename="${filename}"`);
        }

        var doc = new PDFDocument();
        SVGtoPDF(doc, svg, 0, 0);
        doc.pipe(response.response);
        doc.end();        
    }    

    //this will keep a local copy
    async s2p2({request, response, view}) {
        const PDFDocument = require('pdfkit');
        const SVGtoPDF = require('svg-to-pdfkit');
        const fs = require('fs');

        let filename = request.body.filename;
        let svg = request.body.svg;
        let mode = request.body.mode;

        const doc = new PDFDocument();
        SVGtoPDF(doc, svg, 0, 0);
        let stream = fs.createWriteStream('file.pdf');

        stream.on('finish', function() {
            let pdfData = fs.readFileSync('file.pdf');


            response.header('Content-type', 'application/pdf');
            if (mode == 'inline') {
                response.header('Content-Disposition', `inline`);
            }
            else{
                response.header('Content-Disposition', `attachment; filename="${filename}"`);
            }
            response.send(pdfData);
        });
        
        doc.pipe(stream);
        doc.end();

        response.implicitEnd = false        
    }    

    async test({request, response, view}) {
        const fs = require('fs');
        let data = fs.readFileSync('file.pdf');

        //open automaticlly
        //response.header('Content-type', 'application/pdf')  
        //response.send(data);

        //download
        response.attachment('file.pdf', 'renamed.pdf');
    }    

}

module.exports = DocController
