'use strict'
const Code = use('App/Models/Code');

class CodeController {
    async create({request, response, view}) {
        let options = request.qs;
        options.text  = request.params.text;

        let svg = Code.create(options);

        response.header('Content-type', 'image/svg+xml')
        return view.render('code.create', { svg: svg })
    }    
}

module.exports = CodeController
