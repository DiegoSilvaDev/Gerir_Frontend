import React, { useState, useEffect } from 'react';
import {Container,Form,Button, Table, Card, FormLabel, InputGroup} from 'react-bootstrap';
import './index.css';

const Tarefas = () => {
    const [id, setId] = useState(0);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState('');
    const [dataEntrega, setDataEntrega] = useState('');
    const [status, setStatus] = useState('');
    const [tarefas, setTarefas] = useState([]);

    useEffect( () => {
        listarTarefas();
    },[]);

    const listarTarefas = () => {
        //Por padrão no fetch é o GET
        fetch('https://localhost:5001/api/Tarefa', {
            method : 'Get',
            headers : {
                'authorization' : 'Bearer ' + localStorage.getItem('token-gerir')
            }
        })
        
            .then(response => response.json())
            .then(data => {
                setTarefas(data.data);
                console.log(data.data);
            })

        
    }
    
    const salvar = (event) => {
        event.preventDefault();

        const tarefa = {
            titulo : titulo,
            descricao : descricao,
            categoria : categoria,
            dataentrega : dataEntrega,
            status : status
        }

        const method = (id === 0 ?'POST' : 'PUT');
        const urlRequest = (id === 0 ? 'https://localhost:5001/api/tarefa' : 'https://localhost:5001/api/tarefa/' + id)
        
        fetch(urlRequest, {
            method : method,
            body : JSON.stringify(tarefa),
            headers : {
                'authorization' : 'Bearer ' + localStorage.getItem('token-gerir'),
                'content-type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then(dados => {
            alert('Tarefa salva');

            listarTarefas();

            limparCampos(); 
        })

    }

    const editar = (event) => {
        event.preventDefault();
        
        fetch('https://localhost:5001/api/tarefa/Buscar/' + event.target.value, {
            method : "Get",
            headers : {
                'authorization' : 'Bearer ' + localStorage.getItem('token-gerir')
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setId(data.id);
            setTitulo(data.titulo);
            setDescricao(data.descricao);
            setCategoria(data.categoria);
            setDataEntrega(data.dataEntrega.substring(0,10));
            setStatus(data.status);
        })
        .catch(error => {
            console.error(error);
        })
    }

    const excluir = (event) => {
        if(window.confirm("Deseja realmente excluir a tarefa?")){
            fetch('https://localhost:5001/api/tarefa/' + event.target.value, {
                method : 'Delete',
                headers : {
                    'authorization' : 'Bearer ' + localStorage.getItem('token-gerir')
                }
            })
            .then(data => {
                alert('Tarefa exlcuida com sucesso!');

                listarTarefas();
            })
        }
    }

    const alterarStatus = (event) => {
        if(window.confirm("Deseja realmente alterar o status da tarefa?")){
            fetch('https://localhost:5001/api/tarefa/AlterarStatus/' + event.target.value, {
                method : 'Put',
                headers : {
                    'authorization' : 'Bearer' + localStorage.getItem('token-gerir')
                }
            })
            .then(data => {
                alert('Status Alterado com sucesso!');

                listarTarefas();
            })
        }
    }

    const limparCampos = () => {
        setId(0);
        setTitulo('');
        setDescricao('');
        setCategoria('');
        setDataEntrega('');
        setStatus(false);
    }

    return (
        <div>
            <Container>
      
                <Card>
                    <Card.Body>
                        <Form onSubmit = {event => salvar(event)}>
                             <Form.Group controlId="formBasicTitulo">
                        		<Form.Label>Titulo</Form.Label>
                                <Form.Control type="text" value = {titulo} onChange = {event => setTitulo(event.target.value)} placeholder="Informe o Titulo" required />
                             </Form.Group>
                             
                             <Form.Group controlId ="formBasicDescricao"> 
                                <FormLabel>Descrição</FormLabel>
                                <Form.Control type="text" value = {descricao} onChange = {event => setDescricao(event.target.value)} placeholder="Informe a Descrição" required/>
                             </Form.Group>
                             
                             <Form.Group controlId ="formBasicCategoria"> 
                                <FormLabel>Categoria</FormLabel>
                                <Form.Control type="text" value = {categoria} onChange = {event => setCategoria(event.target.value)} placeholder="Informe a Categoria" required/>
                             </Form.Group>

                             <Form.Group controlId ="formBasicDataEntrega"> 
                                <FormLabel>Data de Entrega</FormLabel>
                                <Form.Control type="date" value = {dataEntrega} onChange = {event => setDataEntrega(event.target.value)} placeholder="Informe a Data a ser entregue" required/>
                             </Form.Group>

                             <Form.Group controlId ="formBasicStatus"> 
                                <FormLabel>Status</FormLabel>
                                <InputGroup.Prepend>
                                    <InputGroup.Checkbox checked = {status} value = {status}  onChange = {event => setStatus(event.target.value)} aria-label="Checkbox for following text input" />
                                </InputGroup.Prepend>
                                
                             </Form.Group>

                             

                           
                            <Button type="submit">Salvar</Button>
                        </Form>
                    </Card.Body>
                </Card>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Data de Entrega</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tarefas.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{item.titulo}</td>
                                        <td>{item.descricao}</td>
                                        <td>{item.categoria}</td>
                                        <td>{item.dataEntrega}</td>
                                        <td>{item.status ? 'Feito' : 'Para Fazer'}</td>
                                        <td>
                                            <Button variant = "warning" value={item.id} onClick = {event => editar(event)}>Editar</Button>
                                            <Button variant = "danger" value={item.id} onClick = {event => excluir(event)}>Excluir</Button>
                                            <Button variant = "primary" value={item.id} onClick = {event => alterarStatus(event)}>Alterar Status</Button>
                                        </td>

                                    </tr>
                                )
                            })   
                        }
                    </tbody>
                </Table>
            </Container>
        </div>
    )


}


export default Tarefas;