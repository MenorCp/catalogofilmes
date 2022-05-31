import { alterarImagem, inserirFilme } from "../repository/filmeRepository.js";

import multer from 'multer'

import { Router } from 'express'
const server = Router();

const upload = multer({ dest: 'storage/capaFilmes' })


server.post('/filme', async(req, resp) => {
    try{
        const novoFilme = req.body;

        if(!novoFilme.nome){
            throw new Error('Nome do filme e obrigatório !!')
        }
        if(!novoFilme.sinopse){
            throw new Error('A sinopse do filme e obrigatória !!')
        }
        if(novoFilme.avaliacao == undefined || novoFilme.avaliacao < 0 ){
            throw new Error('A avaliação do filme e obrigatória !!')
        }
        if(!novoFilme.disponivel){
            throw new Error('É obrigatorio informar se o filme esta disponivel !!')
        }
        if(!novoFilme.usuario){
            throw new Error('Usuario não logado !!')
        }

        const filme = await inserirFilme(novoFilme);

        resp.send(filme)

    }catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.put('/filme/:id/capa', upload.single('capa') , async (req, resp) => {
    try{
        const { id } = req.params;
        const imagem = req.file.path;

        const resposta = alterarImagem(imagem, id);

        resp.status(204).send();
    }catch(err){    
        resp.status(400).send({
            erro: err.message
        })
    }
})

export default server;