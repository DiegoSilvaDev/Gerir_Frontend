import React, { useState } from 'react';
import {Container,Form,Button} from 'react-bootstrap';
import logo from '../../logo.svg';
import './index.css';

import {useHistory} from 'react-router-dom';



const Login = () => {

    let history = useHistory();
    //public string Email { get; set; };
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    //Chama o evento na api
    const logar = (event) => {
        event.preventDefault();


        //Representa o objeto que contém
        // os dados do usuário para login
        const objLogin = {
            "email" : email,
            "senha" : senha
        }

        fetch('https://localhost:5001/api/usuario/login', {
            method : 'POST',
            body : JSON.stringify(objLogin),
            headers : {
                'content-type' : 'application/json'
            }
        })
        .then(response => {
            //Verifica se a resposta da Api esta ok
            if(response.ok){
                return response.json();
            }
            //Caso tenha retornado algum erro da api informa 
            alert("Dados inválidos");
            
        })
        .then(data => {
            console.log(data);

            localStorage.setItem('token-gerir', data.token);

            history.push("/tarefas");

            //Navegar para as tarefas

        })
        
        
    }

    return (
        <Container className='form-height'>
                <Form className='form-signin' onSubmit={event => logar(event)} >
                    <div className='text-center'>
                     <img src={logo} alt='Gerir' style={{ width : '64px'}} />
                    </div>
                    <br/>
                    <small>Informe os dados Abaixo</small>
                    <hr/>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email </Form.Label>
                        <Form.Control type="email" value = {email} onChange = {event => setEmail(event.target.value)}  placeholder = "Insira seu email" required/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control type="password" value = {senha} onChange = {event => setSenha(event.target.value)} placeholder = "Insira sua senha" required/>
                    </Form.Group>
                    <Button variant="primary" type="submit" >
                        Enviar
                    </Button>
                    <br/><br/>
                    <a href='/cadastrar' style={{ marginTop :'30px'}}>Não tenho conta!</a>
                </Form>
            </Container>
    );

}

export default Login;