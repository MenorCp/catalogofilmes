import { alterarImagem, inserirFilme, listarTodosFilmes, buscarPorId, buscarPorNome, removerFilme, alterarFilme } from "../repository/filmeRepository.js";

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

server.put('/filme/:id/capa' ,upload.single('capa'), async (req, resp) => {
    try{
        const { id } = req.params;
        const imagem = req.file.path;

        const resposta = await alterarImagem(imagem, id);

        if (resposta != 1)
                throw new Error ('Aimgame não pode ser salva');
                
        resp.status(204).send();
    }catch(err){    
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/filme', async(req, resp) => {
    try{
        const resposta = await listarTodosFilmes();

        resp.send(resposta);
    }catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/filme/busca', async(req, resp) => {
    try{
        const { Nome } = req.query;
        const resposta = await buscarPorNome(Nome);

        if (!resposta || resposta.length == 0)
                resp.status(404).send([])
                
        else
            resp.send(resposta);
            
        }catch(err){
            resp.status(400).send({
                erro: err.message
            })
    }
})


server.get('/filme/:id', async(req, resp) => {
    try{
        const { id } = req.params;
        const resposta = await buscarPorId(id);

            resp.send(resposta);
        }catch(err){
            resp.status(400).send({
                erro: err.message
            })
    }
})

server.delete('/filme/:id', async (req, resp) => {
    try{
        const { id } = req.params;

        const resposta = await removerFilme(id);

        if(resposta != 1)
            throw new Error ('O filme não pode ser removido.....');

        resp.status(204).send();

    }catch(err){
        resp.status(404).send({
            erro: err.message
        })
    }
})


server.put('/filme/:id', async (req, resp) => {
    try{
        const { id } = req.params;
        const filme = req.body;

        if(!filme.nome){
            throw new Error('Nome do filme e obrigatório !!')
        }
        if(!filme.sinopse){
            throw new Error('A sinopse do filme e obrigatória !!')
        }
        if(filme.avaliacao == undefined || filme.avaliacao < 0 ){
            throw new Error('A avaliação do filme e obrigatória !!')
        }
        if(filme.disponivel == undefined){
            throw new Error('É obrigatorio informar se o filme esta disponivel !!')
        }
        if(!filme.usuario){
            throw new Error('Usuario não logado !!')
        }


        const resposta = await alterarFilme(id, filme);
        if(resposta != 1)
             throw new Error ('O filme não pode ser alterado..')

        else
            resp.status(204).send();
    }catch(err){
        resp.status(404).send({
            erro: err.message 
        })
    }
})



export default server;